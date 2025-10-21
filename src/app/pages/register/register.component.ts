import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.auth.register(email!, password!).subscribe({
      next: (res) => {
        // console.log(`Login success! ${JSON.stringify(res, null, 2)}`);
        /*      if (res && res.success) {
          console.log('注册成功，3S后跳转到登录页面');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          console.log('注册失败，email已存在');
        } */
      },
      error: (err) => alert(err.error?.message || 'Login failed'),
    });
  }
}
