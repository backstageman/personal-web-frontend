import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { combineLatest, filter, map, take } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 检查是否启用开发模式
  if (environment.enableDevMode) {
    return true; // 开发模式下直接通过
  }

  return combineLatest([authService.user$, authService.authChecked$]).pipe(
    filter(([_, checked]) => checked),
    take(1),
    map(([user]) => {
      if (user) return true;
      // 带上当前页面地址，登录后跳回来
      return router.createUrlTree(['/login'], {
        queryParams: { redirectTo: state.url },
      });
    })
  );
};
