import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [IconComponent, MatButtonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  signOut() {
    this.authService.logOut();
    this.snackBar
      .open('success, 3s go back home page', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snackbar-position'],
      })
      .afterDismissed()
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
