import { Coupon, StatusCoupon } from '../EntityInterface/Coupon';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CouponListDto } from '../EntityInterface/CouponListDto';


@Injectable({
  providedIn: 'root'
})
export class CouponService {

  coupon : Coupon | undefined;

  constructor(private http:HttpClient) { }

  AddCoupon(coupon : Coupon): Observable<any>{
    return this.http.post<Coupon>('http://192.168.8.130:7253/Coupon/Add', coupon);
  }
  
  ListCoupon(idSoggetto: number): Observable<CouponListDto[]> {
    return this.http.get<CouponListDto[]>(`http://192.168.8.130:7253/Coupon/List?idSoggetto=${idSoggetto}`);
  }

  UpdateCoupon(coupon : StatusCoupon): Observable<any>{
    return this.http.put<StatusCoupon>('http://192.168.8.130:7253/Coupon/update', coupon);
  }
}
