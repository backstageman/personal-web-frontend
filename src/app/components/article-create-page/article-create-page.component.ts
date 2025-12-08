import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import { Article } from '../../models/article.model';
import { ArticleForm2Component } from '../article-form2/article-form2.component';

@Component({
  selector: 'app-article-create-page',
  imports: [ArticleForm2Component],
  template: `
    <app-article-form2
      mode="create"
      (submitForm)="onCreate($event)"
    ></app-article-form2>
  `,
  styleUrl: './article-create-page.component.scss',
})
export class ArticleCreatePageComponent {
  router = inject(Router);
  service = inject(ArticlesService);

  onCreate(article: Partial<Article>) {
    this.service.createArticle(article).subscribe({
      next: (res) => {
        this.goBack();
      },
      error: (err) => {
        // console.error('Error creating article:', err);
      },
    });
  }

  private goBack(): void {
    this.router.navigate(['/admin/articles']);
  }
}
