import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../../services/articles.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { Article } from '../../../models/article.model';
import { ArticlePreviewComponent } from '../../components/article-preview/article-preview.component';

@Component({
  selector: 'app-article-detail',
  imports: [ArticlePreviewComponent],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ArticlesService);
  private snackBarService = inject(SnackBarService);
  article$: Article | null = null;
  defaultCover = 'assets/images/article-cover-image-default.jpg';
  articleMarkdown = ``;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || id <= 0) {
      this.snackBarService.showError('无效的文章ID', 3000);
      setTimeout(() => {
        this.router.navigate(['/admin/articles']);
      }, 3000);
    } else {
      this.fetchArticle(id);
    }
  }

  ngAfterViewInit() {
    // 只做调试用：检查 code block 数量
    const blocks = document.querySelectorAll('pre code');
    // console.log('code blocks found after view init:', blocks.length);
  }

  onMdReady() {
    // 先强制让 Angular 刷新，把渲染完成的 DOM 插入页面
    this.cdr.detectChanges();

    // 仅用于调试，不再做高亮
    const blocks = document.querySelectorAll('pre code');
    console.log('onMdReady: code blocks in DOM:', blocks.length);
  }

  fetchArticle(id: number): void {
    this.service.getArticleById(id).subscribe({
      next: (article) => {
        console.log(article, 'fetched article:');
        this.article$ = article;
        this.articleMarkdown = article.content;
      },
      error: (err) => {
        this.snackBarService.showError('获取文章失败: ' + err?.message, 3000);
        setTimeout(() => {
          this.router.navigate(['/admin/articles']);
        }, 3000);
      },
    });
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultCover;
  }
}
