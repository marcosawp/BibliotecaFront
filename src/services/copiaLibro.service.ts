import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CopiaLibroService {

  constructor(private http: HttpClient) { }

  getCopiaLibros(){
    return this.http.get(`${apiUrl}/copiaLibro`);
  }

}
