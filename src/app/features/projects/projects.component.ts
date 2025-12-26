import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListItemComponent } from './components/project-list-item/project-list-item.component';
import { ProjectListItemSkeletonComponent } from './components/project-list-item-skeleton/project-list-item-skeleton.component';
import {
  ProjectPublic,
  ProjectPublicResponse,
} from '../../models/project-public.model';
import { ArticlesPublicService } from '../../services/articles-public.service';
import { ArticleType } from '../../core/auth/models/article-type.enum';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    ProjectListItemComponent,
    ProjectListItemSkeletonComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  projects: ProjectPublic[] = [];
  isLoading = true;

  constructor(private articleService: ArticlesPublicService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(page: number = 1, limit: number = 10): void {
    this.isLoading = true;
    this.articleService
      .getAllArticles({ page, limit, type: ArticleType.TECH })
      .subscribe({
        next: (result: ProjectPublicResponse) => {
          this.projects = result.data;
          // console.log('Fetched projects:', this.projects);
        },
        error: (error) => {
          // console.error('Error fetching projects:', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
