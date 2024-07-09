import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponListDto } from 'src/app/EntityInterface/CouponListDto';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent  implements OnInit {
  
  @Input() idSoggetto: number | undefined;
  @Input() coupon: CouponListDto | undefined;
  @Input() isUtilizzabile: boolean | undefined;
  @Input() isAdd: boolean | undefined;
  @Output() CloseModalConfirmEvent = new EventEmitter<void>();
  
  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  CloseModalConfirm(){
    this.CloseModalConfirmEvent.emit();
  }
}
