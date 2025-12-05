import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InferenceService {

  private API_URL = "http://127.0.0.1:8000/onboarding/inference/infer"

  constructor(private http: HttpClient) { }

  inferDocument(userId: string, inferenceType: string, file:File): Observable<any> {
    const formData = new FormData();

    formData.append('user_id', userId);
    formData.append('inference_type', inferenceType);
    formData.append('file', file);

    return this.http.post(this.API_URL, formData);
  }
}
