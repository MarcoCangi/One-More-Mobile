import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { catchError, lastValueFrom, of, tap, throwError } from 'rxjs';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { DatePipe } from '@angular/common';
import { Attivita, Orari } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GiorniSettimanaPromo, InsertPromoReqDto, Promo, TipologiaOfferta } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

@Component({
  selector: 'app-gestione-promo',
  templateUrl: './gestione-promo.component.html',
  styleUrls: ['./gestione-promo.component.scss'],
  providers: [DatePipe]
})
export class GestionePromoComponent  implements OnInit {

    id: number | undefined;
    idAttivita:number | undefined;
    attivita: Attivita | undefined;
    orari: Orari | undefined;
    requestPromo!: InsertPromoReqDto;
    listaAttivita: Attivita[] | undefined;
    isPrincipale = false;
    
    sessioneString!:UserSession | null;
    promo: Promo | undefined;
    listaTipologie: TipologiaOfferta[] = [];
    isLimitEnabled: boolean = false;
    isLimitEnabledPerson: boolean = false;
    isLoading : boolean | undefined;
    isEsitoOpen: boolean = false;
    
    alertButtons = ['Chiudi'];
    errorList: string[] = [];
    isEsitoOK : boolean = false;
    isSaved : boolean = false;
    isAddPromo: boolean = false;
    isModidifica: boolean = false;
    
    @Output() openPageEvent = new EventEmitter<number>();

    constructor(
      private promoService : GetApiPromoService,
      private authService : AuthService,
      private attivitaService: GetApiAttivitaService,
      public datePipe: DatePipe,
      private translate: TranslateService,
      private localStorage: StorageService
    ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.requestPromo = new InsertPromoReqDto();
    this.requestPromo.days = [];
    this.sessioneString = this.authService.getUserSession();
    this.attivita = undefined;
    if (this.sessioneString !== null) {
      if(this.sessioneString.idSoggetto !== null && this.sessioneString.idSoggetto !== undefined && this.sessioneString.idSoggetto > 0)
        this.id = this.sessioneString.idSoggetto;
    }
    if (this.id) {
      await this.getListaAttivita(this.id);
    }
    this.isLoading = false;
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }

  async getListaAttivita(idSoggetto: number) {
    try {
      const cacheKey = 'lista_attivita';
      const cacheTTL = 6000; // 1h
      const cached = await this.localStorage.getItem(cacheKey);
      if (cached) {
        this.listaAttivita = cached;
        return;
      }
  
      const data = await lastValueFrom(this.attivitaService.apiGetAttivitaByIdSoggetto(idSoggetto));
      if (data) {
        this.listaAttivita = data;
        await this.localStorage.setItem(cacheKey, data, cacheTTL);
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
  }

  addPromo(attivita: Attivita){
    if(attivita)
    {
      this.idAttivita = attivita.idAttivita;
      this.isAddPromo = true;
    }
  }

  onModalDismiss() {
    this.isAddPromo = false;
  }

  async onModalDismissAndGoToPage(event: { idPage: number, idAttivita: number }) {
    this.isAddPromo = false;
    this.isLoading = true;
    const cacheKey = 'id_attivitaPromo';
    await this.localStorage.setItem(cacheKey, event.idAttivita);
    setTimeout(() => {
      this.openPageEvent.emit(event.idPage);
    }, 200);
  }
}
