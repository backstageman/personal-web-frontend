import { Component, inject, OnInit } from '@angular/core';
import { ArticleForm2Component } from '../article-form2/article-form2.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import { map, switchMap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-article-view-page',
  imports: [ArticleForm2Component, NgIf, AsyncPipe, MatProgressSpinner],
  templateUrl: './article-view-page.component.html',
  styleUrl: './article-view-page.component.scss',
})
export class ArticleViewPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  service = inject(ArticlesService);
  router = inject(Router);
  article$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.service.getArticleById(id))
  );

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getArticleById(id).subscribe({
      next: (article) => {
        // this.article = article;
      },
      error: (err) => {
        // console.error('Error fetching article:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/articles']);
  }
}
