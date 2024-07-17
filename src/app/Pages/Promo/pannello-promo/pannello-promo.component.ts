import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponService } from 'one-more-frontend-common/projects/one-more-fe-service/src/coupon-service';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Coupon } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Coupon';
import { InsertPromoUserAttiva, Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';

@Component({
  selector: 'app-pannello-promo',
  templateUrl: './pannello-promo.component.html',
  styleUrls: ['./pannello-promo.component.scss'],
})
export class PannelloPromoComponent implements OnInit {
  
  @Input() listaPromo!: Promo[];
  @Output() openPageLogin = new EventEmitter<boolean>();
  id!: number;
  requestPromo!: InsertPromoUserAttiva;
  Coupon!: Coupon;
  riepilogoPromo: Promo | undefined;
  idSoggetto!: number;
  isPromoPresente: boolean | undefined;
  isModalConfirmOpen = false;
  isLoading: boolean | undefined;
  isConfirmed: boolean | undefined;
  isError: boolean | undefined;
  
  constructor( 
    private authService: AuthService,
    private couponService: CouponService
  ) {}
  
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
  }
  
  async Prenota(){
    this.isLoading = true;
    this.requestPromo = new InsertPromoUserAttiva();
    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && userSession.idSoggetto) {
      this.requestPromo.idSoggetto = userSession.idSoggetto;
      this.requestPromo.idPromo = this.riepilogoPromo?.idPromo;
      console.log(this.requestPromo);
      if(this.riepilogoPromo?.idPromo)
        this.Coupon = new Coupon(this.riepilogoPromo.idPromo, userSession.idSoggetto);  
      try {
        if(this.Coupon){
          await this.couponService.AddCoupon(this.Coupon).toPromise();
          this.isConfirmed = true;
        }
      } catch (error) {
        this.isConfirmed = false;
        this.isError = true;
      }
    }
    this.isLoading = false;
  }
  
  dismissConfirmModal(): void {
    this.isError = false;
    this.isConfirmed = false;
    this.riepilogoPromo = undefined;
    this.isModalConfirmOpen = false;
  }

  openConfirmModal(promo: Promo): void {
    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && userSession.idSoggetto){
      this.riepilogoPromo = promo;
      this.isModalConfirmOpen = true;
    }
    else {
      this.openPageLogin.emit(true);
    }
  }
}