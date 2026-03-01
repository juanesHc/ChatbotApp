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

  getNotifications(personId: string, filters?: {
    senderId?: string,
    read?: boolean,
    role?: 'SENDER' | 'RECEIVER'
  }): Observable<RetrieveMyNotificationResponseDto[]> {
    let params: any = {};
    if (filters?.senderId) params['senderId'] = filters.senderId;
    if (filters?.read !== undefined) params['read'] = filters.read;
    if (filters?.role) params['role'] = filters.role;
  
    return this.http.get<RetrieveMyNotificationResponseDto[]>(
      `${this.baseUrl}/retrieve/${personId}`, { params }
    );
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
