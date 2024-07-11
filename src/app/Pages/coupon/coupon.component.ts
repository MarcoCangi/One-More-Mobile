import { Component, Input, OnInit } from '@angular/core';
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
            console.log(this.couponAttivi);
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

  openDetailModal(coupon:CouponListDto) {
    this.couponSelezionato = coupon;
    this.checkCouponValidity();
    console.log(this.couponSelezionato);
    this.isModalDetailOpen = true;
    this.isModalConfirmOpen = false;
  }

  dismissDetailModal() {
    this.isModalDetailOpen = false;
  }

  openConfirmModal(isAdd: boolean) {
    this.isAdd = isAdd;
    this.isModalDetailOpen = false;
    this.isModalConfirmOpen = true;
  }

  dismissConfirmlModal() {
    this.isModalConfirmOpen = false;
  }

  private checkCouponValidity() {
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
        }
      }
    }
  }
}
