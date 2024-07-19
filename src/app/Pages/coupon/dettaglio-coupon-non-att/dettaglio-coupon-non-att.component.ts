import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponListDto } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/CouponListDto.cjs';

@Component({
  selector: 'app-dettaglio-coupon-non-att',
  templateUrl: './dettaglio-coupon-non-att.component.html',
  styleUrls: ['./dettaglio-coupon-non-att.component.scss'],
})
export class DettaglioCouponNonAttComponent  implements OnInit {

  @Input() idSoggetto: number | undefined;
  @Input() coupon: CouponListDto | undefined;
  @Input() isUtilizzabile: boolean | undefined;
  @Output() CloseModalNonDetailEvent = new EventEmitter<void>();
  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    
  }

  CloseModalNonAttDetail(){
    this.CloseModalNonDetailEvent.emit();
  }

}
