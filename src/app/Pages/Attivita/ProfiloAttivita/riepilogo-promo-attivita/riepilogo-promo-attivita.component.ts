import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfermaEliminazionePromoComponent } from './conferma-eliminazione-promo/conferma-eliminazione-promo.component';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-riepilogo-promo-attivita',
  templateUrl: './riepilogo-promo-attivita.component.html',
  styleUrls: ['./riepilogo-promo-attivita.component.scss'],
})
export class RiepilogoPromoAttivitaComponent implements OnInit{

  @Output() openPageEvent = new EventEmitter<number>();
  sessioneString!:UserSession | null;
  listaPromoAttive: Promo[] | undefined;
  listaPromoNonAttive: Promo[] | undefined;
  attivita: Attivita | undefined;
  idAttivita!: number;
  idSoggetto!: number;
  isLoading : boolean = false;
  isModifica! : boolean;
  promoSelezionata! : Promo;
  segmentValue: string = 'default';
  panelOpenState = false;
  listaAttivita: Attivita[] | undefined;

  constructor(
    private promoService : GetApiPromoService,
    private router: Router,
    private dialog: MatDialog,
    private authService : AuthService,
    private attivitaService: GetApiAttivitaService,
  ) {}

  async ngOnInit(): Promise<void> {
    
    this.isLoading = true;
    this.idAttivita = 0;
    this.idSoggetto = 0;
    this.attivita = undefined;
    this.sessioneString =  this.authService.getUserSessionFromCookie();

    if (this.sessioneString !== null && this.sessioneString.idSoggetto !== null && this.sessioneString.idSoggetto !== undefined && this.sessioneString.idSoggetto > 0) 
       this.idSoggetto = this.sessioneString.idSoggetto;

    if (this.idSoggetto) {
      await this.getListaAttivita(this.idSoggetto);
    }
    this.isLoading = false;
  }

  openDialogDisattivaPromo(idPromo: number | undefined): void {
    const dialogRef = this.dialog.open(ConfermaEliminazionePromoComponent, {
      width: '450px',
      height: '450px',
      data: { idPromo: idPromo } // Passaggio dei dati all'interno della dialog
    });
  }

  openPage(){
    this.openPageEvent.emit(6);
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

  onSegmentChange(event: any) {
    this.segmentValue = event.detail.value;
  }

  async getListaAttivita(idSoggetto: number) {
    try {
      const data = await lastValueFrom(this.attivitaService.apiGetAttivitaByIdSoggetto(idSoggetto));
      if (data) {
        this.listaAttivita = data;
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
  }

  async getPromoAttivita(attivita: Attivita) {
    this.isLoading = true;
    if (attivita && attivita.idAttivita) {
        this.idAttivita = attivita.idAttivita;
    }

    if (this.idAttivita != null && this.idAttivita > 0) {
        try {
            const data = await firstValueFrom(this.promoService.apiGetListaPromoByIdAttivita(this.idAttivita));

            if (data != undefined) {
                data.forEach(item => {
                    if (item.validDays) {
                        item.days = this.getDaysArray(item.validDays);
                    } else {
                        item.days = []; 
                    }
                });
                
                this.listaPromoAttive = data.filter(item => item.isAttiva === true);
                this.listaPromoNonAttive = data.filter(item => item.isAttiva === false);
                this.listaAttivita = undefined;
            }
        } catch (error) {
            console.error("Errore durante il recupero delle promozioni:", error);
        }
    }

    this.isLoading = false;
  }
}
