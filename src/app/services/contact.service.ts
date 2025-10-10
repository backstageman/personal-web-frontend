import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private API = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  submitContactForm(data: ContactForm): Observable<any> {
    return this.http.post(this.API, data);
  }
}
