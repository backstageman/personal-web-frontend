import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, ArticleResponse } from '../models/article.model';
import {
  BatchUpdatePayload,
  BatchUpdateResponse,
} from '../shared/interfaces/api-response.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private apiUrl = `${environment.apiUrl}/articles`;
  private http = inject(HttpClient);

  constructor() {}

  getArticles(page = 1, limit = 10, params?: any): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
      { params }
    );
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  updateArticle(id: number, article: Partial<Article>): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/${id}`, article);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  batchUpdateArticles(
    payload: BatchUpdatePayload
  ): Observable<BatchUpdateResponse> {
    return this.http.post<BatchUpdateResponse>(
      `${this.apiUrl}/batch-update`,
      payload
    );
  }
}
