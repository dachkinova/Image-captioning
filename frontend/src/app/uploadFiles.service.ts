import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  upload(file: File) {
    const formData: FormData = new FormData();

    formData.append('image', file);

    // const req = new HttpRequest('POST', `${this.baseUrl}/generateCaption`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    return this.http.post( `${this.baseUrl}/generateCaption`, formData);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
