import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Attivita } from 'src/app/EntityInterface/Attivita';
import { Promo } from 'src/app/EntityInterface/Promo';
import { GetApiAttivitaService } from 'src/app/Services/get-api-attivita.service';
import { GetApiPromoService } from 'src/app/Services/get-api-promo.service';
import { AuthService } from './../../../../Services/Auth/auth.service';
import { ConfermaEliminazionePromoComponent } from './conferma-eliminazione-promo/conferma-eliminazione-promo.component';
import { UserSession } from 'src/app/EntityInterface/Utente';


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
    private attivitaService: GetApiAttivitaService,
    private promoService : GetApiPromoService,
    private router: Router,
    private dialog: MatDialog,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    
    this.isLoading = true;
    this.attivita = new Attivita();
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
