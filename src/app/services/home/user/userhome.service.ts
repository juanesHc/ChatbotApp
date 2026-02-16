import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetrieveChatsNameResponseDto } from '../../../model/chat/retrieve/RetrieveChatsNameResponseDto';
import { RegisterChatNameResponseDto } from '../../../model/chat/register/RegisterChatNameResponseDto';
import { RegisterChatNameRequestDto } from '../../../model/chat/register/RegisterChatNameRequestDto';
import { DeleteChatResponseDto } from '../../../model/chat/delete/DeleteChatResponseDto';
import { RegisterMessageRequestDto } from '../../../model/bot/RegisterMessageRequestDto';
import { ChatBotResponseDto } from '../../../model/bot/ChatBotResponseDto';



@Injectable({
  providedIn: 'root'
})
export class UserhomeService {

  private chatsBaseUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) { }

  private personIdtest: string = '82aaad00-e6ac-408b-8325-1bcde0213677';

  getChatsNameList(): Observable<RetrieveChatsNameResponseDto[]> {
    return this.http.get<RetrieveChatsNameResponseDto[]>(`${this.chatsBaseUrl}/${this.personIdtest}/retrieve/names`);
  }

  registerChatName(request: RegisterChatNameRequestDto): Observable<RegisterChatNameResponseDto> {
    return this.http.post<RegisterChatNameResponseDto>(`${this.chatsBaseUrl}/${this.personIdtest}/register/name`, request);
  }

  deleteChat(chatId: string): Observable<DeleteChatResponseDto> {
    return this.http.delete<DeleteChatResponseDto>(`${this.chatsBaseUrl}/${chatId}/delete`);
  }

  updateChatName(request: RegisterChatNameRequestDto,id: string): Observable<RegisterChatNameResponseDto>{
    return this.http.put<RegisterChatNameResponseDto>(`${this.chatsBaseUrl}/${id}/update`, request);
  }
  
}
