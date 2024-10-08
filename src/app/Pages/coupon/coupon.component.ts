import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponService } from 'one-more-frontend-common/projects/one-more-fe-service/src/coupon-service';
import { CouponListDto } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/CouponListDto.cjs';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
})
export class CouponComponent  implements OnInit {

  @Input() idSoggetto: number | undefined;
  listCoupon: CouponListDto [] | undefined; 
  couponAttivi: CouponListDto [] | undefined;
  couponAnnullati: CouponListDto [] | undefined;
  couponScaduti: CouponListDto [] | undefined;
  couponUtilizzati: CouponListDto [] | undefined;
  couponSelezionato: CouponListDto | undefined;
  isModalDetailOpen = false;
  isModalDetailNonAttOpen = false;
  isModalConfirmOpen = false;
  isUtilizzabile = true;
  isAdd: boolean | undefined;
  segmentValue: string = 'default';
  subSegmentValue: string = 'utilizzati';
  isLoading : boolean | undefined;
  @Output() openPageEventLogin = new EventEmitter<void>();

  constructor( private couponService: CouponService) { }

  async ngOnInit() {
    this.isLoading = true;
    if(this.idSoggetto)
      await this.getCoupon();
    else
      await this.openPageLogin();
    this.isLoading = false;
  }

  async getCoupon(){
    if(this.idSoggetto)
    {
      try {
        const listaCoupon = await this.couponService.ListCoupon(this.idSoggetto).toPromise();
        if (listaCoupon) {
          this.listCoupon = listaCoupon;
          if(this.listCoupon){
            this.couponAttivi = this.listCoupon.filter(coupon => coupon.idStatus === 1).sort((a, b) => {
              const dateA = new Date(a.dataAl);
              dateA.setHours(0, 0, 0, 0); // Impost
              const dateB = new Date(b.dataAl);
              return dateA.getTime() - dateB.getTime();
          });
            this.couponUtilizzati = this.listCoupon.filter(coupon => coupon.idStatus === 2).sort((a, b) => {
              const dateA = new Date(a.timestamp);
              dateA.setHours(0, 0, 0, 0); // Impost
              const dateB = new Date(b.timestamp);
              return dateA.getTime() - dateB.getTime();
          });
            this.couponAnnullati = this.listCoupon.filter(coupon => coupon.idStatus === 3 || coupon.idStatus === 4).sort((a, b) => {
              const dateA = new Date(a.timestamp);
              dateA.setHours(0, 0, 0, 0); // Impost
              const dateB = new Date(b.timestamp);
              return dateA.getTime() - dateB.getTime();
          });
            this.couponScaduti = this.listCoupon.filter(coupon => coupon.idStatus === 5).sort((a, b) => {
              const dateA = new Date(a.timestamp);
              dateA.setHours(0, 0, 0, 0); // Impost
              const dateB = new Date(b.timestamp);
              return dateA.getTime() - dateB.getTime();
          });
          }
        }
      } catch (error) {
        console.error('Error fetching coupons', error);
      }
    }
  }

  onSegmentChange(event: any) {
    this.segmentValue = event.detail.value;
  }

  onSubSegmentChange(event: any) {
    this.subSegmentValue = event.detail.value;
  }

  async openDetailModal(coupon: CouponListDto) {
    this.couponSelezionato = coupon;
    if(this.couponSelezionato){
      this.couponSelezionato.days = this.getDaysArray(this.couponSelezionato.validDays)
    }
    await this.checkCouponValidity();
    this.isModalDetailOpen = true;
    this.isModalConfirmOpen = false;
  }

  dismissDetailModal() {
    this.isModalDetailOpen = false;
  }

  async openConfirmModal(isAdd: boolean, coupon: CouponListDto) {
    this.isLoading = true;
    this.couponSelezionato = coupon;
    if(this.couponSelezionato){
      this.couponSelezionato.days = this.getDaysArray(this.couponSelezionato.validDays)
    }
    await this.checkCouponValidity();
    
    this.isAdd = isAdd;
    this.isLoading = false;
    this.isModalDetailOpen = false;
    setTimeout(() => {
      this.isModalConfirmOpen = true;
    }, 100);
    
  }

  dismissConfirmlModal() {
    this.isModalConfirmOpen = false;
  }

  async openDetailNonAttModal(coupon: CouponListDto) {
    this.couponSelezionato = coupon;
    if(this.couponSelezionato){
       this.couponSelezionato.days = this.getDaysArray(this.couponSelezionato.validDays)
    }
    this.isModalDetailNonAttOpen = true;
  }

  dismissDetailNonAttModal() {
    this.isModalDetailNonAttOpen = false;
  }

  dismissConfirmlModalWithEsito() {
    this.isLoading = true;
    this.isModalConfirmOpen = false;
    this.getCoupon();
    this.isLoading = false;
  }

  private async checkCouponValidity() {
    this.isUtilizzabile = true;
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // current time in minutes since midnight
    if (this.couponSelezionato) {
      if (this.couponSelezionato.days && this.couponSelezionato.days.length > 0 && !this.couponSelezionato.days.includes(0)) {
        if (!this.couponSelezionato.days.includes(currentDay)) {
          this.isUtilizzabile = false;
          return;
        }
      }
  
      if (!this.couponSelezionato.isAllDayValidita && this.couponSelezionato.orarioValiditaDa && this.couponSelezionato.orarioValiditaAl) {
        const [startHour, startMinute] = this.couponSelezionato.orarioValiditaDa.split(':').map(Number);
        const [endHour, endMinute] = this.couponSelezionato.orarioValiditaAl.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
  
        if (currentTime < startTime || currentTime > endTime) {
          this.isUtilizzabile = false;
          return;
        }
      }
    }
  }

  private getDaysArray(validDays: string | undefined): number[] {
    const days: number[] = [];
    if (validDays) {
      if (validDays.includes('-')) {
        const range = validDays.split('-').map(Number);
        const start = range[0];
        const end = range[1];
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            days.push(i);
          }
        }
      } else {
        const day = parseInt(validDays, 10);
        if (!isNaN(day)) {
          days.push(day);
        }
      }
    }
    return days;
  }

  async openPageLogin(){
    setTimeout(() => {
      this.openPageEventLogin.emit();
    }, 100);
  }
}


