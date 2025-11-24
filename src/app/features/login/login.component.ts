import { Component, inject, OnInit } from '@angular/core';
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
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { SnackBarService } from '../../services/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  private snackBarService = inject(SnackBarService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  countdown = 3;
  countdownTimer: any;

  // 开发模式相关
  isDevMode = environment.enableDevMode;
  hasStoredCredentials = false;
  storedUserInfo: any = null;

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

  ngOnInit() {
    // 开发模式下检查是否有存储的登录信息
    if (this.isDevMode) {
      this.checkStoredCredentials();
    }
  }

  /**
   * 检查存储的登录信息
   */
  private checkStoredCredentials(): void {
    this.hasStoredCredentials = this.authService.hasStoredCredentials();
    if (this.hasStoredCredentials) {
      this.storedUserInfo = this.authService.getUserInfo();
    }
  }

  /**
   * 快速登录（使用存储的凭证）
   */
  quickLogin(): void {
    if (!this.hasStoredCredentials || !this.storedUserInfo) {
      return;
    }

    console.log('LoginComponent: Quick login with stored credentials');
    this.loading = true;

    // 直接设置已登录状态
    this.authService.setAccessToken(this.authService.getAccessToken());
    this.startCountdown();
  }

  /**
   * 清除存储的登录信息
   */
  clearStoredCredentials(): void {
    if (!this.isDevMode) {
      return;
    }

    this.authService.logOut().subscribe({
      complete: () => {
        this.hasStoredCredentials = false;
        this.storedUserInfo = null;
        this.snackBar.open('已清除本地登录信息', '关闭', {
          duration: 2000,
        });
      },
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    // 开发模式下使用mock登录或真实登录
    const loginMethod = this.isDevMode ? 'devModeLogin' : 'login';

    this.authService[loginMethod](email, password).subscribe({
      next: (res) => {
        console.log('Login success:', res);
        if (res.accessToken) {
          this.successMessage = this.isDevMode
            ? 'Dev mode login successful! Redirecting...'
            : 'Login successful! Redirecting...';

          this.startCountdown();
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
