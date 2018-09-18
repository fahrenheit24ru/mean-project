import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Position } from '../interfaces/position';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(private _http: HttpClient) {}

  fetch(categoryId: string): Observable<Position[]> {
    return this._http.get<Position[]>(`/api/position/${categoryId}`);
  }

  create(position: Position): Observable<Position> {
    return this._http.post<Position>('/api/position', position);
  }

  update(position: Position): Observable<Position> {
    return this._http.patch<Position>(`/api/position/${position._id}`, position);
  }
}
