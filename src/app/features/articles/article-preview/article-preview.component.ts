import { Component, inject, OnInit } from '@angular/core';
import { Article } from '../../../models/article.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../../services/articles.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-article-preview',
  imports: [DatePipe, NgOptimizedImage],
  standalone: true,
  templateUrl: './article-preview.component.html',
  styleUrl: './article-preview.component.scss',
})
export class ArticlePreviewComponent implements OnInit {
  public article!: Article;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticlesService);
  private snackBarService = inject(SnackBarService);
  defaultCover = 'assets/images/article-cover-image-default.jpg';

  ngOnInit(): void {
    const articleFromState = history.state.article;
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (articleFromState) {
      this.article = articleFromState;
    }

    if (!id || id <= 0) {
      this.snackBarService.showError('无效的文章ID', 3000);
      setTimeout(() => {
        this.router.navigate(['/blog']);
      }, 3000);
    } else {
      this.fetchArticle(id);
    }
  }

  fetchArticle(id: number): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        console.log(article, 'fetched article:');
        this.article = article;
        // this.articleMarkdown = article.content;
      },
      error: (err) => {
        this.snackBarService.showError('获取文章失败: ' + err?.message, 3000);
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 3000);
      },
    });
  }
}
