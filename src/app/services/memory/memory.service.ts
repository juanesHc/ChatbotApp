import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetrieveGlobalMemoryResponseDto } from '../../model/memory/RetrieveGlobalMemoryResponseDto';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  private memoriesBaseUrl = 'http://localhost:8080/api/memories';
  private personIdtest: string = '82aaad00-e6ac-408b-8325-1bcde0213677';

  constructor(private http:HttpClient) { }



  getMemories(): Observable<RetrieveGlobalMemoryResponseDto[]> {
    return this.http.get<RetrieveGlobalMemoryResponseDto[]>(`${this.memoriesBaseUrl}/${this.personIdtest}/retrieve`);
  }
}
