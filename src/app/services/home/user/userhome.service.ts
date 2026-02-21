import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetrieveChatsNameResponseDto } from '../../../model/chat/retrieve/RetrieveChatsNameResponseDto';
import { RegisterChatNameResponseDto } from '../../../model/chat/register/RegisterChatNameResponseDto';
import { RegisterChatNameRequestDto } from '../../../model/chat/register/RegisterChatNameRequestDto';
import { DeleteChatResponseDto } from '../../../model/chat/delete/DeleteChatResponseDto';
import { LoginService } from '../../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class UserhomeService {

  private readonly chatsBaseUrl = 'http://localhost:8080/api/chat';

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  private get personId(): string {
    const id = this.loginService.getUserId();
    if (!id) throw new Error('Usuario no autenticado');
    return id;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`
    });
  }

  getChatsNameList(): Observable<RetrieveChatsNameResponseDto[]> {
    return this.http.get<RetrieveChatsNameResponseDto[]>(
      `${this.chatsBaseUrl}/${this.personId}/retrieve/names`,
      { headers: this.getHeaders() }
    );
  }

  registerChatName(request: RegisterChatNameRequestDto): Observable<RegisterChatNameResponseDto> {
    return this.http.post<RegisterChatNameResponseDto>(
      `${this.chatsBaseUrl}/${this.personId}/register/name`,
      request,
      { headers: this.getHeaders() }
    );
  }

  deleteChat(chatId: string): Observable<DeleteChatResponseDto> {
    return this.http.delete<DeleteChatResponseDto>(
      `${this.chatsBaseUrl}/${chatId}/delete`,
      { headers: this.getHeaders() }
    );
  }

  updateChatName(request: RegisterChatNameRequestDto, id: string): Observable<RegisterChatNameResponseDto> {
    return this.http.put<RegisterChatNameResponseDto>(
      `${this.chatsBaseUrl}/${id}/update`,
      request,
      { headers: this.getHeaders() }
    );
  }
}