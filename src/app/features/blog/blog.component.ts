import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListItemComponent } from '../projects/components/project-list-item/project-list-item.component';
import { ProjectListItemSkeletonComponent } from '../projects/components/project-list-item-skeleton/project-list-item-skeleton.component';
import {
  ArticlePublic,
  ArticlePublicResponse,
} from '../../models/article-public.model';
import { ArticlesPublicService } from '../../services/articles-public.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    ProjectListItemComponent,
    ProjectListItemSkeletonComponent,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  articles: ArticlePublic[] = [];
  isLoading = true;

  // private articleService = ArticlesPublicService;
  constructor(private articleService: ArticlesPublicService) { }

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(page: number = 1, limit: number = 10): void {
    this.isLoading = true;
    this.articleService.getAllArticles(page, limit).subscribe({
      next: (result: ArticlePublicResponse) => {
        this.articles = result.data;
        // console.log('Fetched articles:', this.articles);
      },
      error: (error) => {
        // console.error('Error fetching articles:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
