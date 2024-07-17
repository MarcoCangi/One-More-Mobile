import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfermaEliminazionePromoComponent } from './conferma-eliminazione-promo/conferma-eliminazione-promo.component';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-riepilogo-promo-attivita',
  templateUrl: './riepilogo-promo-attivita.component.html',
  styleUrls: ['./riepilogo-promo-attivita.component.scss'],
})
export class RiepilogoPromoAttivitaComponent implements OnInit{

  sessioneString!:UserSession | null;
  listaPromoAttive: Promo[] | undefined;
  listaPromoNonAttive: Promo[] | undefined;
  attivita: Attivita | undefined;
  idAttivita!: number;
  idSoggetto!: number;
  isLoading! : boolean;
  isModifica! : boolean;
  promoSelezionata! : Promo;
  
  panelOpenState = false;

  constructor(
    private promoService : GetApiPromoService,
    private router: Router,
    private dialog: MatDialog,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    
    this.isLoading = true;
    this.idAttivita = 0;
    this.idSoggetto = 0;

    this.sessioneString =  this.authService.getUserSessionFromCookie();

    if (this.sessioneString !== null && this.sessioneString.idAttivita !== null && this.sessioneString.idAttivita !== undefined && this.sessioneString.idAttivita > 0) {

          this.idAttivita = this.sessioneString.idAttivita;
          this.idSoggetto = this.sessioneString.idSoggetto;
    }

    if(this.idAttivita != null && this.idAttivita > 0)
    {
    this.promoService.apiGetListaPromoByIdAttivita(this.idAttivita).subscribe(data=>{
      if(data != undefined ){

        if (data != undefined) {
          data.forEach(item => {
            if (item.validDays) {
              item.days = this.getDaysArray(item.validDays);
            } else {
              item.days = []; 
            }
          });
        }

        this.listaPromoAttive = data.filter(item => item.isAttiva === true);
        this.listaPromoNonAttive = data.filter(item => item.isAttiva === false);
        this.isLoading = false;
        }
      })
    }
  }

  openDialogDisattivaPromo(idPromo: number | undefined): void {
    const dialogRef = this.dialog.open(ConfermaEliminazionePromoComponent, {
      width: '450px',
      height: '450px',
      data: { idPromo: idPromo } // Passaggio dei dati all'interno della dialog
    });
  }

  RedirectGestionePromo(): void {
    this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/GestionePromo']);
    });
  }

  ModificaPromo(promo: Promo): void {
    if (promo) {
      this.promoSelezionata = promo;
      this.isModifica = true;
    }
  }

  private getDaysArray(validDays: string): number[] {
    const days: number[] = [];
    if (validDays.includes('-')) {
      const range = validDays.split('-');
      for (let i = parseInt(range[0]); i <= parseInt(range[1]); i++) {
        days.push(i);
      }
    } else {
      days.push(parseInt(validDays));
    }
    return days;
  }
}
