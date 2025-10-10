import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import {
  MatFormField,
  MatLabel,
  MatInputModule,
} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

type PageMode = 'new' | 'edit' | 'view';

@Component({
  selector: 'app-article-form',
  imports: [
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
})
export class ArticleFormComponent implements OnInit {
  form!: FormGroup;
  mode: PageMode = 'new';
  articleId?: number;
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticlesService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    const snapshot = this.route.snapshot;
    if (snapshot.routeConfig?.path?.includes('articles/new')) {
      this.mode = 'new';
    } else if (snapshot.routeConfig?.path?.includes('articles/view')) {
      this.mode = 'view';
      this.articleId = Number(snapshot.paramMap.get('id'));
    } else if (snapshot.routeConfig?.path?.includes('articles/edit')) {
      this.mode = 'edit';
      this.articleId = Number(snapshot.paramMap.get('id'));
    }

    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    if (this.articleId && Number(this.articleId) > 0) {
      this.articleService.getArticleById(this.articleId).subscribe({
        next: (article) => {
          console.log('article >>>', article);
          this.form.patchValue(article);
        },
        error: (error) => {
          console.log('error >', error);
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.mode === 'new') {
      this.articleService.createArticle(this.form.value).subscribe({
        next: (data) => {
          console.log('success data', data);
          setTimeout(() => {
            this.router.navigate(['/admin/articles']);
          });
        },
        error: (error) => {
          console.log('failed >>', error);
        },
      });
    } else if (this.mode === 'edit') {
      if (this.articleId)
        this.articleService
          .updateArticle(this.articleId, this.form.value)
          .subscribe({
            next: (data) => {
              console.log('success data', data);
              setTimeout(() => {
                this.router.navigate(['/admin/articles']);
              });
            },
            error: (error) => {
              console.log('failed >>', error);
            },
          });
    }
  }
}
