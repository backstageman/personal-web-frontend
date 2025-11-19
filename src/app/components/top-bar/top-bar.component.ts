import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../core/auth/models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-top-bar',
  imports: [IconComponent, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  user$: Observable<User | null>;
  isDevMode = environment.enableDevMode;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  signOut() {
    this.authService.logOut().subscribe({
      next: () => {
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
      },
    });
  }
}
