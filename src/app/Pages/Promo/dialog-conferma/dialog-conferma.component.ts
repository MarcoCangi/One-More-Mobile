import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { InsertPromoUserAttiva, Promo } from 'src/app/EntityInterface/Promo';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Coupon } from 'src/app/EntityInterface/Coupon';
import { CouponService } from 'src/app/Services/coupon-service';
import { AlertService } from 'src/app/Services/alert-service';

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