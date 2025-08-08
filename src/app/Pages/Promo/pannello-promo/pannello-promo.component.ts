import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponService } from 'one-more-frontend-common/projects/one-more-fe-service/src/coupon-service';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Coupon } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Coupon';
import { InsertPromoUserAttiva, Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { MessagingService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/MessagingService';
import { lastValueFrom } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pannello-promo',
  templateUrl: './pannello-promo.component.html',
  styleUrls: ['./pannello-promo.component.scss'],
})
export class PannelloPromoComponent implements OnInit {
  @Input() listaPromo!: Promo[];
  @Output() openPageLogin = new EventEmitter<boolean>();
  @Output() redirecEsitoEvent = new EventEmitter<boolean>();
  @Input() idAttivita: number | undefined;
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
    private couponService: CouponService,
    private messagingService: MessagingService,
    private translate: TranslateService,
    private alertController: AlertController
  ) {}
  
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit() {
    console.log(this.listaPromo);
    const user = await this.authService.getCurrentUserFromAuth();
    const usersession = this.authService.getUserSession();
    if((user && user?.emailVerified == true && usersession?.typeLog == 1) || (usersession?.typeLog == 2 || usersession?.typeLog == 3))
       this.isVerificato = true;
  }

  
  async Prenota() {
    this.isLoading = true;

    this.requestPromo = new InsertPromoUserAttiva();
    const userSession = this.authService.getUserSession();
    if (userSession && userSession.idSoggetto) {
      this.requestPromo.idSoggetto = userSession.idSoggetto;
      this.requestPromo.idPromo = this.riepilogoPromo?.idPromo;
      if (this.riepilogoPromo?.idPromo)
        this.Coupon = new Coupon(this.riepilogoPromo.idPromo, userSession.idSoggetto);  
      try {
        if (this.Coupon) {
          await this.couponService.AddCoupon(this.Coupon).toPromise();
          this.isConfirmed = true;
          const fcmToken = await lastValueFrom(this.messagingService.apiGetFCMToken(this.idAttivita)); // Tratta il token come stringa
          if(fcmToken){
            const title = await firstValueFrom(this.translate.get('MESSAGES.RESERVATION_MADE'));
            const message = await firstValueFrom(this.translate.get('MESSAGES.COUPON_RESERVED'));
            await this.messagingService.sendNotification(fcmToken, title, message);
          }
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

  dismissConfirmModal(tipeEsito: number): void {
    this.isError = false;
    this.isConfirmed = false;
    this.riepilogoPromo = undefined;
    switch(tipeEsito){
      case 0:
        this.isModalConfirmOpen = false;
        break;
      case 1:
        this.isModalConfirmOpen = false;
        this.redirecEsitoEvent.emit(true);
        break;
      case 2:
        this.isModalConfirmOpen = false;
        location.reload();
        break;
    }
  }
  
  prova(){
    console.log('▶️ prova CHIAMATO');
  }

  openConfirmModal(promo: Promo): void {
console.log('▶️ openConfirmModal CHIAMATO', promo);
    if(this.isVerificato == false){
      this.isModalVerifiedOpen = true;
      return;
    }
    
    const userSession = this.authService.getUserSession();
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

  has2X1Tipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 1) ?? false;
  }

  has3X2Tipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 2) ?? false;
  }

  hasOmaggiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 3) ?? false;
  }

  hasPacchettiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 4) ?? false;
  }

  hasScontiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 5) ?? false;
  }

  hasPerBambiniTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 6) ?? false;
  }

  hasPerFamiglieTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 7) ?? false;
  }

  hasPerCoppieTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 8) ?? false;
  }

  hasVeganiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 9) ?? false;
  }

  hasVegetarianiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 1) ?? false;
  }

  async showAlert(titolo: string, messaggio: string) {
    const alert = await this.alertController.create({
      header: titolo,
      message: messaggio,
      cssClass: 'custom-alert'
    });

    await alert.present();
  }
}