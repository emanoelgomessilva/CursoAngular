import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseUrl = 'https://localhost:44391/api/evento';

  constructor(public http: HttpClient) { }

  getAllEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  getEventoByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/getByTema/${tema}`);
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/getById/${id}`);
  }

  postEvento(evento: Evento) {
    return this.http.post(this.baseUrl, evento);
  }

}
