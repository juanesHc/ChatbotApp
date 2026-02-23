import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetrieveGlobalMemoryResponseDto } from '../../model/memory/RetrieveGlobalMemoryResponseDto';
import { Observable } from 'rxjs/internal/Observable';
import { DeleteGlobalMemoryResponseDto } from '../../model/memory/DeleteGlobalMemoryResponseDto';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  private memoriesBaseUrl = 'http://localhost:8080/api/memories';

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`
    });
  }

  private get personId(): string {
    const id = this.loginService.getUserId();
    if (!id) throw new Error('Usuario no autenticado');
    return id;
  }

  getMemories(): Observable<RetrieveGlobalMemoryResponseDto[]> {
    return this.http.get<RetrieveGlobalMemoryResponseDto[]>(
      `${this.memoriesBaseUrl}/${this.personId}/retrieve`,
      { headers: this.getHeaders() }
    );
  }

  deleteMemory(memoryId: string): Observable<DeleteGlobalMemoryResponseDto> {
    return this.http.delete<DeleteGlobalMemoryResponseDto>(
      `${this.memoriesBaseUrl}/delete/${memoryId}`,
      { headers: this.getHeaders() }
    );
  }
}