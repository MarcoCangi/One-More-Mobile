import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponService } from 'one-more-frontend-common/projects/one-more-fe-service/src/coupon-service';
import { StatusCoupon } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Coupon';
import { CouponListDto } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/CouponListDto.cjs';

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
  updateStatus: StatusCoupon | undefined;
  isConfirmed = false;
  isLoading = false;
  isEsito = false;
  typeUtilizzo!: number;

  constructor(private couponService: CouponService
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  CloseModalConfirm(){
    this.CloseModalConfirmEvent.emit();
  }

  async Confirm(idSatus: number){
    this.isLoading == true;
    this.typeUtilizzo = idSatus;

    if(this.coupon && this.updateStatus) {
      if(this.coupon.id )
        this.updateStatus.idCoupon = this.coupon.id;
      if(this.idSoggetto)
        this.updateStatus.idSoggetto = this.idSoggetto;

        this.updateStatus.idStatus = idSatus;
    } 
    else {
      this.isLoading = false;
      this.isConfirmed = false;
      return;
    }
    try {
      if(this.updateStatus) {
        await this.couponService.UpdateCoupon(this.updateStatus).toPromise();
        this.isConfirmed = true;
      }
      else {
        this.isConfirmed = false;
      }
    } catch (error) {
      this.isConfirmed = false;
    }
    this.isLoading = false;
  }

  async Retry(){
    this.isLoading == true;

    if(this.coupon && this.typeUtilizzo && this.idSoggetto) {
      this.updateStatus = new StatusCoupon(this.coupon.id,this.typeUtilizzo, this.idSoggetto)
      console.log(this.updateStatus);
    } 
    else {
      this.isLoading = false;
      this.isConfirmed = false;
      return;
    }
    try {
      if(this.updateStatus) {
        await this.couponService.UpdateCoupon(this.updateStatus).toPromise();
        this.isConfirmed = true;
      }
      else {
        this.isConfirmed = false;
      }
    } catch (error) {
      this.isConfirmed = false;
    }
    this.isLoading = false;
  }

  Chiudi(){
    this.CloseModalConfirm();
  }
}
