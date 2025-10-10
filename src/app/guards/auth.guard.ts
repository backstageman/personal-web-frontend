import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  console.log(
    'authService.isAuthenticated() >>',
    authService.isAuthenticated()
  );
  // return authService.isAuthenticated();
  return true;
};
