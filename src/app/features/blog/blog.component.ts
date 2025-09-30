import { Component, OnInit } from '@angular/core';
import { ArticleItemComponent } from '../components/article-item/article-item.component';
import {
  ArticlePublic,
  ArticlePublicResponse,
} from '../../models/article-public.model';
import { ArticlesPublicService } from '../../service/articles-public.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [ArticleItemComponent, NgFor],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  articles: ArticlePublic[] = [];

  // private articleService = ArticlesPublicService;
  constructor(private articleService: ArticlesPublicService) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(page: number = 1, limit: number = 10): void {
    this.articleService.getAllArticles(page, limit).subscribe({
      next: (result: ArticlePublicResponse) => {
        this.articles = result.data;
        console.log('Fetched articles:', this.articles);
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
      },
    });
  }
}
