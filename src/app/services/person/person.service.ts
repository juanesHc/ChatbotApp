import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  PagedUsersResponse, 
  RetrieveUsersFilterRequest, 
  UsersPageParams 
} from '../../model/person/retrieveuser/RetrieveUsersFilterRequestDto';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private readonly BASE_URL = 'http://localhost:8080/api/users/retrieve';

  constructor(private http: HttpClient) {}

  retrieveUsers(
    filter: RetrieveUsersFilterRequest,
    pagination: UsersPageParams
  ): Observable<PagedUsersResponse> {
    

    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sortBy', pagination.sortBy)
      .set('sortDir', pagination.sortDir);

    const filterEntries = Object.entries(filter);
    for (const [key, value] of filterEntries) {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    }

    // 3. Petición limpia
    return this.http.get<PagedUsersResponse>(this.BASE_URL, { params })
      .pipe(
        catchError(error => {

          console.error('Error en la petición de usuarios:', error);
          return throwError(() => new Error(error.message || 'Error del servidor'));
        })
      );
  }
}