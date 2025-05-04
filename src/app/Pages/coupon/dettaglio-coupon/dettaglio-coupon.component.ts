import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponListDto } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/CouponListDto.cjs';

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
    
  }

  CloseModalDetail(){
    this.CloseModalDetailEvent.emit();
  }
  
}
