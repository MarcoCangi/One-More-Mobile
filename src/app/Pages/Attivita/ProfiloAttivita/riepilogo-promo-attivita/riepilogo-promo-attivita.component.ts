import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

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
  idAttivita!: number;
  idSoggetto!: number;
  isLoading : boolean = false;
  isModifica! : boolean;
  promoSelezionata : Promo | undefined;
  segmentValue: string = 'default';
  panelOpenState = false;
  listaAttivita: Attivita[] | undefined;
  isConfirmOpen: boolean = false;
  idPromoDisable: number | undefined;
  idAttivitaDisable: number | undefined;
  numCouponRichiesti: number | undefined;

  constructor(
    private promoService : GetApiPromoService,
    private authService : AuthService,
    private attivitaService: GetApiAttivitaService,
    private localStorage: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.listaAttivita = undefined;
    this.isLoading = true;
    this.idAttivita = 0;
    this.idSoggetto = 0;
    this.isModifica = false;
    this.sessioneString =  this.authService.getUserSession();

    if (this.sessioneString !== null && this.sessioneString.idSoggetto !== null && this.sessioneString.idSoggetto !== undefined && this.sessioneString.idSoggetto > 0) 
       this.idSoggetto = this.sessioneString.idSoggetto;

    if (this.idSoggetto) {
      await this.getListaAttivita(this.idSoggetto);
    }

    const cacheKey = 'id_attivitaPromo';
    const cached = await this.localStorage.getItem(cacheKey);
    await this.localStorage.removeItem(cacheKey);
    if(cached) {
      this.idAttivita = cached;
      await this.getPromoAttivita(this.idAttivita);
    }
    this.isLoading = false;
  }

  openDisattivaPromo(idPromo: number | undefined, idAttivita: number | undefined, numCouponRichiesti: number | undefined): void {
    if(idPromo && idAttivita)
    {
      this.idPromoDisable = idPromo;
      this.idAttivitaDisable = idAttivita;
      if(numCouponRichiesti)
        this.numCouponRichiesti = numCouponRichiesti;
      this.isConfirmOpen = true;
    }
  }

  async dismissDisattivaPromo(event: { idPromo: number, isDisattivata: boolean }): Promise<void> {
    this.isLoading = true;
    if (event.idPromo && event.isDisattivata) {
      if (this.idAttivita) {
        await this.getPromoAttivita(this.idAttivita); // Ricarica le due liste
      }
    }
  
    this.idPromoDisable = undefined;
    this.idAttivitaDisable = undefined;
    this.isConfirmOpen = false;
  
    this.isLoading = false;
  }

  openPage(){
    this.isLoading = true;
    this.isModifica = true;
    this.isLoading = false;
  }

  async onModalDismissAndGoToPage(event: { idPage: number, idAttivita: number }) {
    this.isModifica = false;
    this.isLoading = true;
    this.isConfirmOpen = false;
    await this.getPromoAttivita(this.idAttivita);
    const cacheKey = 'id_attivitaPromo';
    await this.localStorage.setItem(cacheKey, event.idAttivita);
    setTimeout(() => {
      this.openPageEvent.emit(event.idPage);
    }, 200);
  }

  async ModificaPromo(promo: Promo, command: number): Promise<void> {

    this.isLoading = true;
    if (promo) {
      this.promoSelezionata = promo;
      if(command === 2){
        this.promoSelezionata.isAttiva = true
        this.promoSelezionata.dataDal = new Date();
      }
      this.isModifica = true;
    }
    this.isLoading = false;
  }

  private getDaysArray(validDays: string): number[] {
     const parts = validDays.split('-');
     const days: number[] = parts.map(x => parseInt(x)).filter(x => !isNaN(x));
     return days;
  }

  onSegmentChange(event: any) {
    this.segmentValue = event.detail.value;
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

  async recoverModificaPromo() {
    this.isLoading = true;
    this.isModifica = false;
    this.promoSelezionata = undefined;
    this.isLoading = false;
  }

  async recoverModificaPromoRefresh() {
    this.isLoading = true;
    this.isModifica = false;
    this.promoSelezionata = undefined;
    setTimeout(async () => {
      await this.getPromoAttivita(this.idAttivita);
    }, 200);
    this.isLoading = false;
  }

  async getPromoAttivita(idAttivita: number) {
    this.isLoading = true;
    if (idAttivita) {
        this.idAttivita = idAttivita;
    }

    if (this.idAttivita != null && this.idAttivita > 0) {
        try {
          const data = await this.promoService.apiGetListaPromoByIdAttivita(this.idAttivita);
          console.log(data);
            if (data != undefined) {
                data.forEach(item => {
                    if (item.validDays) {
                        item.days = this.getDaysArray(item.validDays);
                    } else {
                        item.days = []; 
                    }
                });
                
                this.listaPromoAttive = data.filter(item => item.isAttiva === true);
                console.log(this.listaPromoAttive);
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
