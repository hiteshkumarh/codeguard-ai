import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  analyze(code: string, fileName?: string): Observable<any> {
    const payload = fileName ? { code, file_name: fileName } : { code };
    return this.http.post(`${this.apiUrl}/analyze`, payload);
  }

  getResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/results`);
  }
}
