import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  ArticlePublic,
  ArticlePublicResponse,
} from '../models/article-public.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesPublicService {
  private API = `${environment.apiUrl}/public/articles`;

  constructor(private http: HttpClient) {}

  getAllArticles(
    page = 1,
    limit = 10,
    search = ''
  ): Observable<ArticlePublicResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    /*if (search) {
      params = params.set('search', search);
    } */
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
