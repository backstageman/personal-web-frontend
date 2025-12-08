import { Component, inject, OnInit } from '@angular/core';
import { ArticleForm2Component } from '../article-form2/article-form2.component';
import { Article } from '../../models/article.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import { map, Observable, switchMap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-article-edit-page',
  imports: [
    ArticleForm2Component,
    NgIf,
    AsyncPipe,
    MatProgressSpinner,
    MatChipsModule,
  ],
  templateUrl: './article-edit-page.component.html',
  styleUrl: './article-edit-page.component.scss',
})
export class ArticleEditPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(ArticlesService);
  article$!: Observable<Article>;
  /* article$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.service.getArticleById(id))
  ); */

  ngOnInit(): void {
    this.article$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.service.getArticleById(id))
    );
    // const id = Number(this.route.snapshot.paramMap.get('id'));
    /*  this.service.getArticleById(id).subscribe({
      next: (article) => {
        // this.article = article;
      },
      error: (err) => {
        console.error('Error fetching article:', err);
      },
    }); */
  }

  onUpdate(article: Partial<Article>) {
    if (!article.id) {
      // console.error('Article ID is required for update');
      return;
    } else {
      this.service.updateArticle(article.id, article).subscribe({
        next: () => {
          // console.log('Article updated successfully');
          this.goBack();
        },
        error: (err) => {
          // console.error('Error updating article:', err);
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/articles']);
  }
}
