import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, AttivitaRicerca } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { UserService } from 'one-more-frontend-common/projects/one-more-fe-service/src/user-service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent  implements OnInit {

  isLoading : boolean | undefined;
  listaAttivitaFavoriti : AttivitaRicerca [] | undefined;
  idSoggetto: number = 0;
  idAttivitaSelezionata: number | undefined;
  attivita: Attivita | undefined;
  isModalPromoOpen = false;
  isModalConfirmOpen = false;
  isOk: boolean | undefined;
  listaPromo!: Promo[];
  @Output() ricercaAttiviaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() openPageEvent = new EventEmitter<number>();
  @Output() redirectEsitoEvent = new EventEmitter<boolean>();

  constructor(private attivitaService: GetApiAttivitaService,
              private authService : AuthService,
              private userService: UserService,
              private promoService: GetApiPromoService,
              private storageService: StorageService
  ) { }

  ngOnInit() {
    this.isLoading = true

    const userSession = this.authService.getUserSession();
    if (userSession && userSession.idSoggetto && userSession.idSoggetto > 0) {
      this.idSoggetto = userSession.idSoggetto;
    } else {
      this.idSoggetto = 0;
    }
    
    if(this.idSoggetto && this.idSoggetto > 0)
      this.GetAttivita();
  }

  async GetAttivita() {
    this.isLoading = true;
    const cacheKey = `attivita_favoriti_${this.idSoggetto}`;
    const cachedData = await this.storageService.getItem(cacheKey);
    if (cachedData) {
      if (typeof cachedData === 'string') {
        this.listaAttivitaFavoriti = JSON.parse(cachedData);
      } else {
        this.listaAttivitaFavoriti = cachedData;
      }
      this.isLoading = false;
    } else if (!this.listaAttivitaFavoriti || this.listaAttivitaFavoriti.length === 0) {
      try {
        const listaAttivita = await this.attivitaService.apiGetAttivitaFavorite(this.idSoggetto).toPromise();
        if (listaAttivita) {
          this.listaAttivitaFavoriti = listaAttivita;
          await this.storageService.setItem(cacheKey, listaAttivita);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
    }
  }

  async VisualizzaAttivita(idAttivita: number | undefined): Promise<void> {
    this.isLoading = true;

    if (idAttivita) {
        try {
            const data = await this.attivitaService.apiGetAttivitaByIdAttivita(idAttivita);
            this.attivita = data;
            this.ricercaAttiviaSelezionataEvent.emit(this.attivita);
            this.openPage(3);
        } catch (error) {
            console.error('Error fetching activity:', error);
        }
    }
    this.isLoading = false;
  }

  getImmaginePrincipale(attivita: AttivitaRicerca | undefined): string {
    if (attivita && attivita.immagini != undefined) {
      const immaginePrincipale = attivita.immagini.find(img => img.isImmaginePrincipale);
      if (immaginePrincipale) {
        return immaginePrincipale.upload;
      } else {
        return 'URL_IMMAGINE_FALLBACK';
      }
    } else {
      return 'URL_IMMAGINE_FALLBACK';
    }
  }

  async openPromoModal(idAttivita: number | undefined) {
    this.isLoading = true;
    try {
        if (idAttivita && idAttivita > 0 && this.idSoggetto) {
            const promoData = await firstValueFrom(
                this.promoService.apiGetListaPromoByIdAttivitaAndUser(idAttivita, this.idSoggetto)
            );

            if (promoData && promoData.length > 0) {
                this.listaPromo = promoData.filter(item => item.isAttiva === true);
                this.listaPromo.forEach(item => {
                    item.days = this.getDaysArray(item.validDays);
                });
            }
        }
    } catch (error) {
        console.error('Errore nel caricamento delle promozioni:', error);
    } finally {
        this.isLoading = false;
        this.isModalPromoOpen = true;
    }
}

  private getDaysArray(validDays: string | undefined): number[] {
    const days: number[] = [];
    if (validDays) {
      if (validDays.includes('-')) {
        const range = validDays.split('-').map(Number);
        const start = range[0];
        const end = range[1];
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            days.push(i);
          }
        }
      } else {
        const day = parseInt(validDays, 10);
        if (!isNaN(day)) {
          days.push(day);
        }
      }
    }
    return days;
  }

  dismissPromoModal() {
    this.isModalPromoOpen = false;
  }

 async openConfirmModal(id:number | undefined,event:Event) {
    event.stopPropagation()
    this.idAttivitaSelezionata = id;
    this.isModalConfirmOpen = true;
  }

  async dismissConfirmModal() {
    // this.idAttivitaSelezionata = undefined;
    this.isModalConfirmOpen = false;
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }

  async AddRemoveFavorite(): Promise<void> {
    this.isLoading = true;
    
    try {
      const userSession = this.authService.getUserSession();
      
      if (userSession && this.idAttivitaSelezionata && this.idSoggetto) {
        this.isOk = await this.userService.AddRemoveFavorite(this.idSoggetto, this.idAttivitaSelezionata);
        if (this.isOk) {
          const cacheKey = `attivita_favoriti_${this.idSoggetto}`;
          let cachedData: AttivitaRicerca[] = await this.storageService.getItem(cacheKey) || [];
  
          if (cachedData.length > 0) {
            // Rimuove l'attività usando il tipo esplicito
            cachedData = cachedData.filter((attivita: AttivitaRicerca) => attivita.idAttivita !== this.idAttivitaSelezionata);
            await this.storageService.setItem(cacheKey, cachedData);
          }
  
          // Aggiorna la lista locale
          this.listaAttivitaFavoriti = cachedData;
  
          setTimeout(() => {
            this.dismissConfirmModal();
          }, 100);
        }
      }
    } catch (error) {
      console.error('Errore durante AddRemoveFavorite:', error);
    } finally {
      this.isLoading = false;
    }
  }

  redirecEsitoEvent(typeRedirect:boolean){
    setTimeout(() => {
      this.redirectEsitoEvent.emit(typeRedirect);
    }, 100); // 100 millisecondi = 0.1 secondi
    this.isModalPromoOpen = false;
  }

}
