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
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { SnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  private snackBarService = inject(SnackBarService);
  private authService = inject(AuthService); // Use explicit type if possible, or inference

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.registerForm.value;

    this.authService.register(email, password).subscribe({
      next: (res) => {
        // console.log('Register success:', res);
        this.snackBarService.showInfo(
          'Registration successful! Please login.',
          2000
        );
        // Successful registration, redirect to login with email state
        this.router.navigate(['/login'], { state: { email: email } });
      },
      error: (err) => {
        // console.error('Register failed:', err);
        // Extract error message if available from backend response
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';
        this.snackBarService.showError(this.errorMessage, 3000);
        this.loading = false;
      },
      complete: () => {
        // Only set loading to false here if not redirecting. 
        // If redirecting, we might want to keep it true to avoid flicker? 
        // But for safety, set it false in case navigation is slow or fails.
        this.loading = false;
      },
    });
  }
}
