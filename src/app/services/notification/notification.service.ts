import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EliminationNotificationResponseDto, RetrieveMyNotificationResponseDto } from '../../model/notification/NotificationDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly baseUrl = 'http://localhost:8080/api/notification';

  constructor(private http: HttpClient) {}

  getNotifications(personId: string): Observable<RetrieveMyNotificationResponseDto[]> {
    return this.http.get<RetrieveMyNotificationResponseDto[]>(`${this.baseUrl}/retrieve/${personId}`);
  }

  deleteNotification(notificationId: string): Observable<EliminationNotificationResponseDto> {
    return this.http.delete<EliminationNotificationResponseDto>(`${this.baseUrl}/delete/${notificationId}`);
  }

  sendNotification(message: string): Observable<EliminationNotificationResponseDto> {
    return this.http.post<EliminationNotificationResponseDto>(`${this.baseUrl}/send`, { message });
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/read/${notificationId}`, {});
  }

}
