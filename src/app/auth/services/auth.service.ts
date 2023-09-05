import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environments } from 'src/environments/environments';
import { Observable, of, tap, map, catchError, throwError } from 'rxjs';
import { AuthStatus } from '../enum/auth-status';
import { CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environments.baseUrl;
  private http: HttpClient = inject( HttpClient );
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );

  constructor() { }

  login(email:string, password:string):Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password};
    return this.http.post<LoginResponse>( url, body)
      .pipe(
        tap( ({ user, token} ) => {
          this.updateAuthenticationState(token, user, AuthStatus.authenticated);
        }),
        map( () => true ),
        catchError( err => throwError( () => err.error.message ))
      );
  }

  protected updateAuthenticationState( token:string, user: User | null, state: AuthStatus ) {
    this._currentUser.set( user );
    this._authStatus.set( state );
    localStorage.setItem('token', token);
  }

  checkAuthStatus():Observable<boolean> {
    const endPoint = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(endPoint, {headers})
      .pipe(
        map( ({token, user}) => {
          this.updateAuthenticationState(token, user, AuthStatus.authenticated);
          return true;
        }),
        catchError( () => {
          this.updateAuthenticationState('', null, AuthStatus.notAuthenticated);
          return of( false )
        })
      );

  }
}
