import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    email: ['charlie@126.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(
            '登录成功,3s后跳转到首页 >',
            JSON.stringify(res, null, 2)
          );
          setTimeout(() => this.router.navigate(['/']), 3000);
        }
      },
      error: (err) => alert(err.error?.message || 'Login failed'),
    });
  }
}
