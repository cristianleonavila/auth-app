import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../enum/auth-status';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if ( authService.authStatus() === AuthStatus.authenticated ) {
    return true;
  }
  const url = state.url;
  const router = inject(Router);
  localStorage.setItem('requestedUrl', url);
  router.navigateByUrl('/auth/login');
  return false;
};
