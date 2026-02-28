import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserWithRoleRequestDto, RegisterUserWithRoleResponseDto } from '../../model/person/registerpersonwithrole/RegisterUserWithRole';
import { Observable } from 'rxjs';
import { RegisterNotificationRequestDto, RegisterAdminNotificationResponseDto } from '../../model/notification/NotificationDto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private readonly BASE_URL = '/api/users';

  constructor(private http: HttpClient) { }

  registerUserWithRole(
    payload: RegisterUserWithRoleRequestDto
  ): Observable<RegisterUserWithRoleResponseDto> {
    return this.http.post<RegisterUserWithRoleResponseDto>(
      `${this.BASE_URL}/register`,
      payload,
      { withCredentials: true } // <-- envía la cookie de sesión del admin
    );
  }

  sendNotification(personId: string, dto: RegisterNotificationRequestDto): Observable<RegisterAdminNotificationResponseDto> {
    return this.http.post<RegisterAdminNotificationResponseDto>(`${this.BASE_URL}/sent/${personId}`, dto);
  }

}
