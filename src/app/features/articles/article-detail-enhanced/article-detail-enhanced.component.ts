import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjectPublic } from '../../../models/project-public.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsPublicService } from '../../../services/projects-public.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { DatePipe, NgOptimizedImage, NgIf } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-article-detail-enhanced',
  imports: [DatePipe, NgOptimizedImage, NgIf],
  standalone: true,
  templateUrl: './article-detail-enhanced.component.html',
  styleUrl: './article-detail-enhanced.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailEnhancedComponent implements OnInit {
  public article!: ProjectPublic;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectsPublicService);
  private snackBarService = inject(SnackBarService);
  private sanitizer = inject(DomSanitizer);
  defaultCover = '/assets/images/article-cover-image-default.jpg';

  get safeHtmlContent(): SafeHtml {
    if (this.article?.htmlContent) {
      return this.sanitizer.bypassSecurityTrustHtml(this.article.htmlContent);
    }
    return this.sanitizer.bypassSecurityTrustHtml(this.article?.content || '');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      this.snackBarService.showError('无效的项目ID', 3000);
      setTimeout(() => {
        this.router.navigate(['/projects']);
      }, 3000);
    } else {
      this.fetchProject(id);
    }
  }

  fetchProject(id: string): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        // console.log(project, 'fetched project as article:');
        this.article = project;
      },
      error: (err) => {
        this.snackBarService.showError('获取项目详情失败: ' + err?.message, 3000);
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 3000);
      },
    });
  }
}
