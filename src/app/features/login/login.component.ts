import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { SnackBarService } from '../../services/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  private snackBarService = inject(SnackBarService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  countdown = 3;
  countdownTimer: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // ✅ 注入服务
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['charlie@126.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('Login success:', res);
        if (res.accessToken) {
          this.snackBar
            .open('Login successful! Redirecting in 3 seconds...', 'close', {
              duration: 1000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-position'],
            })
            .afterDismissed()
            .subscribe(() => {
              this.router.navigate(['admin', 'articles']);
            });
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage =
          err.error?.message || 'Login failed. Please try again.';
        this.snackBarService.showError(this.errorMessage, 2000);
      },
      complete: () => (this.loading = false),
    });
  }

  startCountdown() {
    this.countdown = 3;
    this.countdownTimer = setInterval(() => {
      this.countdown--;
      this.successMessage = `Login successful! Redirecting in ${
        this.countdown
      } second${this.countdown !== 1 ? 's' : ''}...`;
      this.countdown > 0 &&
        this.snackBarService.showInfo(this.successMessage, 500);
      if (this.countdown === 0) {
        clearInterval(this.countdownTimer);
        this.router.navigate(['admin', 'articles']);
      }
    }, 1000);
  }
}
