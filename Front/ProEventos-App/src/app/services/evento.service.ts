import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { take } from 'rxjs/operators';

@Injectable(
 // pode ser adicionado o injetor aqui tambem
 // {providedIn: 'root'}
)
export class EventoService {
  baseUrl = 'https://localhost:5001/api/Eventos';

  constructor(private http: HttpClient) {}

  public getEventos() : Observable<Evento[]> {
    // take chama a função somente a quantidade de vezes especificada no (), depois se desinscreve do observable;
    return this.http.get<Evento[]>(this.baseUrl).pipe(take(1))
  }

  public getEventosByTema(tema : string) : Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/${tema}/tema`).pipe(take(1));
  }

  public getEventoById(id : number) : Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`).pipe(take(1));
  }

  public post(evento : Evento) : Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl,evento).pipe(take(1));
  }
  public put(evento: Evento) : Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${evento.id}`,evento).pipe(take(1));
  }
  public deleteEvento(id : number) : Observable<any> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`).pipe(take(1));
  }
}
