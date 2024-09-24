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
  @Output() redirecEsitoEvent = new EventEmitter<boolean>();
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
  isVerificato: boolean = false;
  isModalVerifiedOpen: boolean = false;
  esitoResendVerification: string | undefined;

  constructor( 
    private authService: AuthService,
    private couponService: CouponService
  ) {}
  
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    const user = this.authService.getCurrentUserFromAuth();
    const usersession = this.authService.getUserSessionFromCookie();
    if((user && user?.emailVerified == true && usersession?.typeLog == 1) || (usersession?.typeLog == 2 || usersession?.typeLog == 3))
       this.isVerificato = true;
  }

  
  async Prenota() {
    this.isLoading = true;

    this.requestPromo = new InsertPromoUserAttiva();
    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && userSession.idSoggetto) {
      this.requestPromo.idSoggetto = userSession.idSoggetto;
      this.requestPromo.idPromo = this.riepilogoPromo?.idPromo;
      if (this.riepilogoPromo?.idPromo)
        this.Coupon = new Coupon(this.riepilogoPromo.idPromo, userSession.idSoggetto);  
      try {
        if (this.Coupon) {
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

  dismissisModalVerified(): void {
    this.isError = false;
    this.isModalVerifiedOpen = false;
  }

  dismissConfirmModal(isEsito:boolean, isCoupon:boolean): void {
    this.isError = false;
    this.isConfirmed = false;
    this.riepilogoPromo = undefined;
    this.isModalConfirmOpen = false;
    if(isCoupon)
      this.redirecEsitoEvent.emit(true);
    else
      location.reload();
  }

  openConfirmModal(promo: Promo): void {

    if(this.isVerificato == false){
      this.isModalVerifiedOpen = true;
      return;
    }
    
    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && userSession.idSoggetto){
      this.riepilogoPromo = promo;
      this.isModalConfirmOpen = true;
    } else {
      this.openPageLogin.emit(true);
    }
  }

  async resendVerificationEmail(){
    this.esitoResendVerification = await this.authService.resendVerificationEmail();
  }
}