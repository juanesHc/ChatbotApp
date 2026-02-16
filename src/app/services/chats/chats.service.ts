import { Injectable } from '@angular/core';
import { RegisterMessageRequestDto } from '../../model/bot/RegisterMessageRequestDto';
import { Observable } from 'rxjs';
import { ChatBotResponseDto } from '../../model/bot/ChatBotResponseDto';
import { HttpClient } from '@angular/common/http';
import { RetrieveMessageResponseDto } from '../../model/bot/RetrieveMessageResponseDto';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  private chatsBaseUrl = 'http://localhost:8080/api/message';

  constructor(private http: HttpClient) { }
  
  getMessages(chatId: string): Observable<RetrieveMessageResponseDto[]> {
    return this.http.get<RetrieveMessageResponseDto[]>(`${this.chatsBaseUrl}/${chatId}/messages`);
  }

  // Enviar mensaje al bot
  askBot(chatId: string, content: RegisterMessageRequestDto): Observable<ChatBotResponseDto> {
    return this.http.post<ChatBotResponseDto>(`${this.chatsBaseUrl}/${chatId}/ask`, content);
  }
}
