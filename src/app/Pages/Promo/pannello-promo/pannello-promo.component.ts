import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InsertPromoUserAttiva, Promo } from 'src/app/EntityInterface/Promo';
import { GetApiPromoService } from '../../../Services/get-api-promo.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../HomePage/login/login.component';
import { DialogConfermaComponent } from '../../Promo/dialog-conferma/dialog-conferma.component';
import { Coupon } from 'src/app/EntityInterface/Coupon';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/Services/dialog-service';
import { CouponService } from 'src/app/Services/coupon-service';
import { user } from '@angular/fire/auth';

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
      this.Coupon = new Coupon();
      this.Coupon.IdPromo = this.riepilogoPromo?.idPromo;
      this.Coupon.IdSoggetto = userSession.idSoggetto;
  
      try {
        await this.couponService.AddCoupon(this.Coupon).toPromise();
        this.isConfirmed = true;
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