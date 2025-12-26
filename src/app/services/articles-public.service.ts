import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  ArticlePublic,
  ArticlePublicResponse,
} from '../models/article-public.model';
import { environment } from '../../environments/environment';
import { ArticleQuery } from '../shared/interfaces/article-query';
import { O } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class ArticlesPublicService {
  private readonly API = `${environment.apiUrl}/public/articles`;

  constructor(private http: HttpClient) {}

  getAllArticles(query: ArticleQuery = {}): Observable<ArticlePublicResponse> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http
      .get<ArticlePublicResponse>(this.API, {
        params,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to fetch articles'));
        })
      );
  }

  getArticleById(id: string): Observable<ArticlePublic> {
    return this.http.get<ArticlePublic>(`${this.API}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch article by ID'));
      })
    );
  }
}
