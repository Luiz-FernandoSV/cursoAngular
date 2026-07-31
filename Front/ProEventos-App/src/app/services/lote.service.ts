import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class LoteService {
baseUrl = 'https://localhost:5001/api/Lotes';

  constructor(private http: HttpClient) {}

  public getLotesByEventoId(eventoId : number) : Observable<Lote[]> {
    // take chama a função somente a quantidade de vezes especificada no (), depois se desinscreve do observable;
    return this.http.get<Lote[]>(`${this.baseUrl}/${eventoId}`).pipe(take(1))
  }

  public getLoteByIds(id : number) : Observable<Lote> {
    return this.http.get<Lote>(`${this.baseUrl}/${id}`).pipe(take(1));
  }

  public saveLote(eventoId : number, lotes: Lote[]) : Observable<Lote> {
    return this.http.put<Lote>(`${this.baseUrl}/${eventoId}`,lotes).pipe(take(1));
  }
  public deleteLote(loteId : number, eventoId : number) : Observable<any> {
    return this.http.delete<string>(`${this.baseUrl}/${eventoId}/${loteId}`).pipe(take(1));
  }
}

