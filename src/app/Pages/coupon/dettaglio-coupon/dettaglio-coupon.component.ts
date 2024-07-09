import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { CouponListDto } from 'src/app/EntityInterface/CouponListDto';

@Component({
  selector: 'app-dettaglio-coupon',
  templateUrl: './dettaglio-coupon.component.html',
  styleUrls: ['./dettaglio-coupon.component.scss'],
})
export class DettaglioCouponComponent  implements OnInit {

  @Input() idSoggetto: number | undefined;
  @Input() coupon: CouponListDto | undefined;
  @Input() isUtilizzabile: boolean | undefined;
  @Output() CloseModalDetailEvent = new EventEmitter<void>();
  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    if(this.coupon){
      this.coupon.days = this.getDaysArray(this.coupon.validDays)
    }
  }

  CloseModalDetail(){
    this.CloseModalDetailEvent.emit();
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
