import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ContactService } from '../../services/contact.service';
import { SnackBarService } from '../../services/snackbar.service';
import { MIN_FILL_TIME } from '../../utils/constants';

@Component({
  selector: 'app-contact',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatIcon,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatError,
    MatCard,
    MatButton,
    MatButtonModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  private snackBarService = inject(SnackBarService);
  formLoadTime = Date.now();

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      address: [''],
    });
  }

  onSubmit() {
    if (this.isSubmitting) return;

    if (this.contactForm.get('address')?.value) {
      // 如果地址字段有值，可能是机器人提交，直接返回
      return;
    }

    const elapsed = Date.now() - this.formLoadTime;
    if (elapsed < MIN_FILL_TIME) {
      this.snackBarService.showInfo(
        'Form submitted too quickly. Please take your time to fill out the form.'
      );
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const sendMessage = Object.assign({}, this.contactForm.value);
    delete sendMessage.address; // 删除隐藏字段

    this.contactService.submitContactForm(sendMessage).subscribe({
      next: () => {
        this.snackBarService.showSuccess(
          'Message sent! I’ll get back to you as soon as possible.'
        );
        this.resetAllKeys();
      },
      error: (err) => {
        console.error('Error submitting contact form', err);
        this.snackBarService.showError(
          'Message not sent. Please check your internet connection or try again later.'
        );
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  resetAllKeys() {
    this.contactForm.reset();
    // 🚀 关键修复步骤：在重置后手动清除错误状态
    // 遍历所有控件，确保它们的错误和 'touched' 状态被完全清除
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      if (control) {
        // 清除错误对象
        control.setErrors(null);
        // 确保状态是 pristine 和 untouched
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }
}
