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

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  login(email:string, password:string):Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password};
    return this.http.post<LoginResponse>( url, body)
      .pipe(
        map( ({ user, token}) => this.setAuthentication(token, user) ),
        catchError( err => throwError( () => err.error.message ))
      );
  }

  protected setAuthentication( token:string, user: User) {
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    return true;
  }

  public initializeAuthentication() {
    this._currentUser.set( null );
    this._authStatus.set( AuthStatus.notAuthenticated );
    localStorage.removeItem('token');
    return of(false);
  }

  checkAuthStatus():Observable<boolean> {
    const endPoint = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) return this.initializeAuthentication();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(endPoint, {headers})
      .pipe(
        map( ({token, user}) => this.setAuthentication(token, user)),
        catchError( () => this.initializeAuthentication())
      );

  }
}
