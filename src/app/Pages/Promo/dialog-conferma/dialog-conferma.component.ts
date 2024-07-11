import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { CouponService } from 'one-more-frontend-common/projects/one-more-fe-service/src/coupon-service';
import { Coupon } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Coupon';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { AlertService } from 'one-more-frontend-common/projects/one-more-fe-service/src/alert-service';

@Component({
  selector: 'app-dialog-conferma',
  templateUrl: './dialog-conferma.component.html',
  styleUrls: ['./dialog-conferma.component.scss'],
})
export class DialogConfermaComponent implements OnInit {
  coupon: Coupon | undefined;
  riepilogoPromo: Promo | undefined;
  isError: boolean | undefined;
  descErrore: string | undefined;
  isLoading: boolean | undefined;

  constructor(private couponService: CouponService,
    public dialogRef: MatDialogRef<DialogConfermaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.isError = false;
    this.coupon = this.data.coupon;
    this.riepilogoPromo = this.data.riepilogo;
  }
}