import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetrieveRolesResponseDto } from '../../model/role/RetrieveRolesResponse';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly API_URL = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<RetrieveRolesResponseDto> {
    return this.http.get<RetrieveRolesResponseDto>(
      `${this.API_URL}/retrieve`
    );
  }
}