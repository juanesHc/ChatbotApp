import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetrievePersonDataResponseDto } from '../../model/person/myaccount/RetrievePersonDataResponseDto';
import { DeleteUserResponseDto } from '../../model/person/myaccount/DeleteUserResponseDto';
import { UpdateUserAccountRequestDto, UpdateUserAccountResponseDto } from '../../model/person/myaccount/UpdateUserAccountDto';


@Injectable({
  providedIn: 'root'
})
export class MyAccountService {

  private readonly baseUrl = 'http://localhost:8080/api/account';

  constructor(private http: HttpClient) {}

  getPersonData(personId: string): Observable<RetrievePersonDataResponseDto> {
    return this.http.get<RetrievePersonDataResponseDto>(`${this.baseUrl}/see/${personId}`);
  }

  deletePersonData(personId: string): Observable<DeleteUserResponseDto> {
    return this.http.delete<DeleteUserResponseDto>(`${this.baseUrl}/delete/${personId}`);
  }

  updatePersonData(personId: string, updateUserAccountRequestDto: UpdateUserAccountRequestDto): Observable<UpdateUserAccountResponseDto> {
    return this.http.put<UpdateUserAccountResponseDto>(`${this.baseUrl}/edit/${personId}`, updateUserAccountRequestDto);
  }

}