import { Coupon } from '../EntityInterface/Coupon';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  coupon : Coupon | undefined;

  constructor(private http:HttpClient) { }

  AddRemoveFavorite(idSoggetto: number, idAttivita: number): Observable<boolean>{
    const params = new HttpParams()
    .set('idSoggetto', idSoggetto.toString())
    .set('idAttivita', idAttivita.toString());

    return this.http.get<boolean>('http://192.168.8.130:7253/User/AddRemoveFavorite', { params });
  }


  apiCheckIsFavorite(idSoggetto: number, idAttivita: number): Observable<boolean> {
      const params = new HttpParams()
      .set('idSoggetto', idSoggetto.toString())
      .set('idAttivita', idAttivita.toString());
      return this.http.get<boolean>('http://192.168.8.130:7253/User/CheckFavorite', { params });
  }
}
