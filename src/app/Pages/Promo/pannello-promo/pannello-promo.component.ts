import { Component, Input, OnInit } from '@angular/core';
import { InsertPromoUserAttiva, Promo } from 'src/app/EntityInterface/Promo';
import { GetApiPromoService } from '../../../Services/get-api-promo.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../HomePage/login/login.component';
import { DialogConfermaComponent } from '../../Promo/dialog-conferma/dialog-conferma.component';
import { Coupon } from 'src/app/EntityInterface/Coupon';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/Services/dialog-service';
import { CouponService } from 'src/app/Services/coupon-service';

@Component({
  selector: 'app-pannello-promo',
  templateUrl: './pannello-promo.component.html',
  styleUrls: ['./pannello-promo.component.scss'],
})
export class PannelloPromoComponent implements OnInit {
  
  @Input() listaPromo!: Promo[];
  id!: number;
  requestPromo!: InsertPromoUserAttiva;
  Coupon!: Coupon;
  riepilogoPromo!: Promo;
  idSoggetto!: number;
  isPromoPresente: boolean | undefined;
  
  constructor( 
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private couponService: CouponService,
    private toastr: ToastrService
  ) {}
  
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
  }
  
  Prenota(promo: Promo): void {
    this.requestPromo = new InsertPromoUserAttiva();
    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && userSession.idSoggetto) {
      this.requestPromo.idSoggetto = userSession.idSoggetto;
      this.requestPromo.idPromo = promo.idPromo;
      this.riepilogoPromo = promo;

      this.Coupon = new Coupon();
      this.Coupon.IdPromo = promo.idPromo;
      this.Coupon.IdSoggetto = userSession.idSoggetto;

      this.dialogService.openConfirmDialog("Sei sicuro di voler riscattare questo coupon?")
        .afterClosed().subscribe(res => {
          if (res) {
            this.couponService.AddCoupon(this.Coupon).subscribe();
            this.toastr.success("Ottimo hai riscattato il coupon 😊");
          }
        });
    } else {
      this.openDialogLogin();
    }
  }
  
  openDialogLogin(): void {
      this.dialog.open(LoginComponent, {
        width: '450px',
        height:'450px'
      });
  }

  openDialogConferma(requestPromo: Coupon, riepilogo: Promo): void {
      this.dialog.open(DialogConfermaComponent, {
        width: '650px',
        height:'450px',
        data: {
          coupon: requestPromo,
          riepilogo: riepilogo
        }
      });
  }
  }