import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticlesPublicService } from '../../../services/articles-public.service';
import { ProjectsPublicService } from '../../../services/projects-public.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { ArticlePublic } from '../../../models/article-public.model';
import { NgOptimizedImage, NgIf, CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ProjectPublic } from '../../../models/project-public.model';

@Component({
  selector: 'app-article-detail-enhanced',
  standalone: true,
  imports: [NgOptimizedImage, NgIf, CommonModule, RouterModule],
  templateUrl: './article-detail-enhanced.component.html',
  styleUrl: './article-detail-enhanced.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailEnhancedComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectsPublicService);
  private snackBarService = inject(SnackBarService);
  private sanitizer = inject(DomSanitizer);

  article: ArticlePublic | ProjectPublic | null = null;
  isLoading = true;
  error: string | null = null;

  // Default images
  readonly defaultCover = '/assets/images/article-cover-image-default.jpg';
  readonly defaultAuthorAvatar = '/assets/images/author-avatar-default.webp';

  // Helper to check if this is a project
  get isProject(): boolean {
    return this.article &&
      'description' in this.article &&
      'technologies' in this.article
      ? true
      : false;
  }

  // Get description safely for both article and project
  get description(): string {
    if (!this.article) return '';
    if (this.isProject) {
      return (this.article as ProjectPublic).description || '';
    }
    // For articles, we can use a truncated content as description
    const content = (this.article as ArticlePublic).content || '';
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }

  // Get author avatar safely
  get authorAvatar(): string {
    if (!this.article) return this.defaultAuthorAvatar;
    if (this.isProject) {
      return (
        (this.article as ProjectPublic).authorAvatar || this.defaultAuthorAvatar
      );
    }
    return this.defaultAuthorAvatar; // Articles don't have authorAvatar in their model
  }

  private subscriptions = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.loadArticle();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadArticle(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      this.error = 'Invalid ID';
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/blog']);
      }, 3000);
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Determine if this is a project route or article route
    const isProjectRoute = url.includes('/projects/');

    const subscription = this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(
          `Failed to load ${isProjectRoute ? 'project' : 'article'}:`,
          err
        );
        this.error =
          `Failed to load ${isProjectRoute ? 'project' : 'article'}: ` +
          (err?.message || 'Unknown error');
        this.isLoading = false;
        this.snackBarService.showError(this.error, 3000);
        setTimeout(() => {
          this.router.navigate([isProjectRoute ? '/projects' : '/blog']);
        }, 3000);
      },
    });

    this.subscriptions.add(subscription);
  }

  get safeHtmlContent(): SafeHtml {
    if (!this.article?.content) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    return this.sanitizer.bypassSecurityTrustHtml(this.article.content);
  }

  get readingTime(): number {
    if (!this.article?.content) return 0;
    const wordsPerMinute = 200;
    const textContent = this.article.content.replace(/<[^>]*>/g, '').trim();
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target.alt === 'Author Avatar') {
      target.src = this.defaultAuthorAvatar;
    } else {
      target.src = this.defaultCover;
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  formatReadDate(date: Date | string): string {
    const articleDate = typeof date === 'string' ? new Date(date) : date;
    return articleDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  shareArticle(): void {
    if (navigator.share && this.article) {
      navigator.share({
        title: this.article.title,
        text: this.article.title,
        url: window.location.href,
      });
    } else {
      // Fallback: Copy URL to clipboard
      this.copyToClipboard(window.location.href);
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.snackBarService.showSuccess(
          'Article link copied to clipboard!',
          2000
        );
      },
      (err) => {
        console.error('Failed to copy article link:', err);
        this.snackBarService.showError('Failed to copy article link', 2000);
      }
    );
  }
}
