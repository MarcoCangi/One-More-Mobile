import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';

@Component({
  selector: 'app-conferma-eliminazione-promo',
  templateUrl: './conferma-eliminazione-promo.component.html',
  styleUrls: ['./conferma-eliminazione-promo.component.scss'],
})
export class ConfermaEliminazionePromoComponent {

  hide = true;
  @Input() idPromo! : number;
  userSession! : UserSession;
  isDisattivata! : boolean;
  isLoading! : boolean;

  constructor(private promoService: GetApiPromoService, 
              private dialog: MatDialog, 
              private location: Location,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) private data: any) {
                if (data && data.idPromo) {
                  this.idPromo = data.idPromo;
              }
            }

  Disattiva(): void {
    this.isLoading = true;
    this.isDisattivata = false;
    if (this.idPromo != null && this.idPromo > 0) {
      this.promoService.apiDeletePromoByIdPromo(this.idPromo).subscribe(
        () => {
          this.isLoading = false;
          this.isDisattivata = true;
        },
        (error) => {
          this.isLoading = false;
          console.error('Errore durante la cancellazione della promo:', error);
        }
      );
    }
  }

  Annulla(): void {
    this.dialog.closeAll();
  }

  Continua(): void {
    this.dialog.closeAll();
    this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/RiepilogoPromoAttivita']);
    });
  }

}
