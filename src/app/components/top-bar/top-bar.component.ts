import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { User } from '../../core/auth/models/user.model';

@Component({
  selector: 'app-top-bar',
  imports: [IconComponent, MatButtonModule, NgIf, AsyncPipe],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  user$: Observable<User | null> = of(null);
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  signOut() {
    // console.log('signOut!!!');
    this.authService.logOut().subscribe({
      next: () => {
        // console.log('✅ 已登出');
        this.snackBar
          .open('success, 3s go back home page', 'close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-position'],
          })
          .afterDismissed()
          .subscribe(() => {
            this.router.navigate(['/']);
          });
      },
      error: (err) => {
        // console.error('❌ 登出失败', err);
      },
    });
  }
}
