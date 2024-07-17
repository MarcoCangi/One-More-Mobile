import { Component, Input, OnInit } from '@angular/core';
import { CouponListDto, } from 'src/app/EntityInterface/CouponListDto';
import { CouponService } from 'src/app/Services/coupon-service';

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
  isModalConfirmOpen = false;
  isUtilizzabile = true;
  isAdd: boolean | undefined;
  segmentValue: string = 'default';
  subSegmentValue: string = 'utilizzati';
  isLoading : boolean | undefined;

  constructor( private couponService: CouponService) { }

  async ngOnInit() {
    this.isLoading = true;
    if (this.idSoggetto) {
      try {
        const listaCoupon = await this.couponService.ListCoupon(this.idSoggetto).toPromise();
        if (listaCoupon) {
          this.listCoupon = listaCoupon;
          if(this.listCoupon){
            this.couponAttivi = this.listCoupon.filter(coupon => coupon.idStatus === 1);
            this.couponUtilizzati = this.listCoupon
            this.couponAnnullati = this.listCoupon
            this.couponScaduti = this.listCoupon
          }
        }
      } catch (error) {
        console.error('Error fetching coupons', error);
      }
    }
    this.isLoading = false;
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

  openConfirmModal(isAdd: boolean, coupon: CouponListDto) {
    this.couponSelezionato = coupon;
    this.isAdd = isAdd;
    this.isModalDetailOpen = false;
    this.isModalConfirmOpen = true;
  }

  dismissConfirmlModal() {
    this.isModalConfirmOpen = false;
  }

  private async checkCouponValidity() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // current time in minutes since midnight
    if (this.couponSelezionato) {
      console.log(this.couponSelezionato.days)
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
}


