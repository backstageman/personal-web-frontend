import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 当前是否已登录
  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    // 未登录，跳转到登录页
    router.navigate(['/login'], {
      queryParams: { redirect: state.url }, // 可选：登录后回跳
    });
    return false;
  }

  return true;
};
