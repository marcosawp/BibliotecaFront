import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class SolicitudPrestamoService {

  constructor(private http: HttpClient) { }


  getSolicitudPrestamos(){
    console.log("hol")
    return this.http.get(`${apiUrl}/SolicitudPrestamo`);
  }


  crear(idUsuario:any){
    return this.http.post(`${apiUrl}/SolicitudPrestamo`,idUsuario);
  }
}
