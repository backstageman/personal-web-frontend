import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  ProjectPublic,
  ProjectPublicResponse,
} from '../models/project-public.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsPublicService {
  private API = `${environment.apiUrl}/public/articles`;

  constructor(private http: HttpClient) {}

  getAllProjects(
    page = 1,
    limit = 10,
    search = ''
  ): Observable<ProjectPublicResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    /*if (search) {
      params = params.set('search', search);
    } */
    return this.http
      .get<ProjectPublicResponse>(this.API, {
        params,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to fetch projects'));
        })
      );
  }

  getProjectById(id: string): Observable<ProjectPublic> {
    return this.http.get<ProjectPublic>(`${this.API}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch project by ID'));
      })
    );
  }
}
