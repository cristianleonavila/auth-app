import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environments } from 'src/environments/environments';
import { Observable, of, tap, map } from 'rxjs';
import { AuthStatus } from '../enum/auth-status';
import { LoginResponse, User } from '../interfaces';

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
          this._currentUser.set( user );
          this._authStatus.set( AuthStatus.authenticated );
          localStorage.setItem('token', token);
          console.log({user,token});
        }),
        map( () => true )
      );
  }
}
