import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, AttivitaRicerca } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { UserService } from 'one-more-frontend-common/projects/one-more-fe-service/src/user-service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent  implements OnInit {

  isLoading : boolean | undefined;
  listaAttivitaFavoriti : AttivitaRicerca [] | undefined;
  idSoggetto: number | undefined;
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
              private promoService: GetApiPromoService
  ) { }

  ngOnInit() {
    this.isLoading = true

    const userSession = this.authService.getUserSessionFromCookie();
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
  
    if ((!this.listaAttivitaFavoriti || this.listaAttivitaFavoriti.length === 0) && typeof this.idSoggetto === 'number') {
      try {
        const listaAttivita = await this.attivitaService.apiGetAttivitaFavorite(this.idSoggetto).toPromise();
        if (listaAttivita) {
          this.listaAttivitaFavoriti = listaAttivita;
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
            const data = await this.attivitaService.apiGetAttivitaByIdAttivita(idAttivita).toPromise();
            this.attivita = data;
            console.log(this.attivita?.isPromoPresente);
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
    if (idAttivita && idAttivita > 0 && this.idSoggetto) {
      const promoData = await this.promoService.apiGetListaPromoByIdAttivitaAndUser(idAttivita, this.idSoggetto).toPromise();
        if (promoData) {
          this.listaPromo = promoData.filter(item => item.isAttiva === true);
          if (this.listaPromo) {
            this.listaPromo.forEach(item => {
              item.days = this.getDaysArray(item.validDays);
            });
          }
        }
    }
    this.isLoading = false;
    this.isModalPromoOpen = true;
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
    console.log(id);
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
    console.log('prova1');
    this.isLoading = true;
    try {
      const userSession = this.authService.getUserSessionFromCookie();
      console.log('prova2');
      if (userSession && this.idAttivitaSelezionata && this.idSoggetto) {
        this.isOk = await this.userService.AddRemoveFavorite(this.idSoggetto, this.idAttivitaSelezionata);
        if (this.isOk && this.listaAttivitaFavoriti) {
          this.listaAttivitaFavoriti = this.listaAttivitaFavoriti.filter(
            attivita => attivita.idAttivita !== this.idAttivitaSelezionata 
          );
          setTimeout(() => {
            this.dismissConfirmModal();
          }, 100); // 100 millisecondi = 0.1 secondi
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
