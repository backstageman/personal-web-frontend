import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ArticlePublic } from '../../../models/article-public.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesPublicService } from '../../../services/articles-public.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { DatePipe, NgOptimizedImage, NgIf } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-article-preview',
  imports: [DatePipe, NgOptimizedImage, NgIf],
  standalone: true,
  templateUrl: './article-preview.component.html',
  styleUrl: './article-preview.component.scss',
  encapsulation: ViewEncapsulation.None, // 禁用样式封装，使样式可以应用到动态插入的 HTML
})
export class ArticlePreviewComponent implements OnInit {
  public article!: ArticlePublic;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticlesPublicService);
  private snackBarService = inject(SnackBarService);
  private sanitizer = inject(DomSanitizer);
  defaultCover = 'assets/images/article-cover-image-default.jpg';

  /**
   * 将 HTML 内容标记为安全，允许渲染
   * 注意：后端已经使用 sanitize-html 清理过内容，所以是安全的
   * 使用 bypassSecurityTrustHtml 来绕过 Angular 的默认 sanitization
   */
  get safeHtmlContent(): SafeHtml {
    if (!this.article?.htmlContent) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    // 后端已经清理过 HTML，所以可以安全地绕过 Angular 的 sanitization
    return this.sanitizer.bypassSecurityTrustHtml(this.article.htmlContent);
  }

  ngOnInit(): void {
    const articleFromState = history.state.article;
    const id = this.route.snapshot.paramMap.get('id');

    if (articleFromState) {
      this.article = articleFromState;
    }

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      this.snackBarService.showError('无效的文章ID', 3000);
      setTimeout(() => {
        this.router.navigate(['/blog']);
      }, 3000);
    } else {
      this.fetchArticle(id);
    }
  }

  fetchArticle(id: string): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        // console.log(article, 'fetched article:');
        this.article = article;
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
