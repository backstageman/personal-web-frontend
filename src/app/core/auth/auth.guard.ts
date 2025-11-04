import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { combineLatest, filter, map, take, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.user$, authService.authChecked$]).pipe(
    tap(([user, checked]) => console.log('guard state:', { user, checked })),
    filter(([_, checked]) => checked),
    take(1),
    map(([user]) => {
      //  ? 这里的user是从哪里来的？
      if (user) return true;
      // 带上当前页面地址，登录后跳回来
      return router.createUrlTree(['/login'], {
        queryParams: { redirectTo: state.url },
      });
    })
  );
};
