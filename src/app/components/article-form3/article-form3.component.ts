import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Article } from '../../models/article.model';
import { NgIf } from '@angular/common';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-article-form3',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatFormField,
    MatCheckbox,
  ],
  templateUrl: './article-form3.component.html',
  styleUrl: './article-form3.component.scss',
})
export class ArticleForm3Component implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() article?: Article;
  @Output() submitForm = new EventEmitter<Partial<Article>>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [{ value: this.article?.id || '', disabled: true }],
      title: [this.article?.title || '', Validators.required],
      content: [this.article?.content || '', Validators.required],
      slug: [this.article?.slug || ''],
      coverImage: [this.article?.coverImage || ''],
      tags: [this.article?.tags?.join(', ') || ''],
      isPublished: [this.article?.isPublished ?? false],
    });

    if (this.mode === 'view') {
      this.form.disable();
    }
    if (this.mode === 'create') {
      this.form.removeControl('id'); // 新建时不需要 id
    }
  }

  onSubmit() {
    if (this.form.valid && this.mode !== 'view') {
      const value = { ...this.form.getRawValue() };
      value.tags = value.tags
        ? value.tags.split(',').map((t: string) => t.trim())
        : [];
      this.submitForm.emit(value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
