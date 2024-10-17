import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, AttivitaFiltrate, AttivitaHomePageResponse, FiltriAttivita, Immagini, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { catchError, firstValueFrom, retry } from 'rxjs';
import { DettaglioComponent } from '../../Attivita/ProfiloAttivita/dettaglio/dettaglio.component';
import { LogoutComponent } from '../logout/logout.component';
import { DatiStrutturaComponent } from '../../Attivita/RegistraAttivita/dati-struttura/dati-struttura.component';
import { GestionePromoComponent } from '../../Attivita/ProfiloAttivita/gestione-promo/gestione-promo.component';
import { RicercaComponent } from '../ricerca/ricerca.component';
import { FavoritesComponent } from '../../favorites/favorites.component';
import { CouponComponent } from '../../coupon/coupon.component';
import { UserComponent } from '../../user/user.component';
import { RiepilogoPromoAttivitaComponent } from '../../Attivita/ProfiloAttivita/riepilogo-promo-attivita/riepilogo-promo-attivita.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {
  
  handleRefresh() {
    setTimeout(() => {
      this.ngOnInit();
    }, 1000);
  }

  currentSlide = 0;
  totalSlides = 2; // Modifica in base al numero di immagini
  @ViewChild(DettaglioComponent) dettaglioComponent!: DettaglioComponent;
  @ViewChild(LogoutComponent) logoutComponent!: LogoutComponent;
  @ViewChild(DatiStrutturaComponent) datiStrutturaComponent!: DatiStrutturaComponent;
  @ViewChild(GestionePromoComponent) gestionePromoComponent!: GestionePromoComponent;
  @ViewChild(RiepilogoPromoAttivitaComponent) riepilogoPromoComponent!: RiepilogoPromoAttivitaComponent;
  @ViewChild(RicercaComponent) ricercaComponent!: RicercaComponent;
  @ViewChild(FavoritesComponent) favoriteComponent!: FavoritesComponent;
  @ViewChild(CouponComponent) couponComponent!: CouponComponent;
  @ViewChild(UserComponent) userComponent!: UserComponent;
  listaElencoConsigli : Attivita[] | undefined;
  listaElencoPromo : Attivita[] | undefined;
  listaElencoPub : Attivita[] | undefined;
  listaElencoRistoranti : Attivita[] | undefined;
  listaElencoFastFood : Attivita[] | undefined;
  filtro: FiltriAttivita | undefined;
  listaAttivitaRicerca: AttivitaFiltrate | undefined;
  position: GeolocationPosition | undefined;
  isLoading : boolean | undefined;
  isCaricamentoOk : boolean | undefined;
  errorMessage: string | undefined;
  idSoggetto : number | undefined;
  @Input() idPage!: number;
  @Input() listaTipoAttivita: TipoAttivita[] =[];
  attivita: Attivita | undefined;
  attivitaRicercate: Attivita [] | undefined;
  alertButtons = ['Ricarica'];
  @Output() openPageEventNav = new EventEmitter<number>();
  @Output() updateIdFooter = new EventEmitter<number>();
  @Output() isModalLoginOpenEvent = new EventEmitter<boolean>();

  constructor(
    private attivitaService: GetApiAttivitaService,
    private authService: AuthService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    const userSession = this.authService.getUserSessionFromCookie();
          if (userSession && userSession.idSoggetto && userSession.idSoggetto > 0) {
            this.idSoggetto = userSession.idSoggetto;
          } else {
            this.idSoggetto = undefined;
          }
          this.setiIdSogggetto(this.idSoggetto);

          this.loadData();
          this.startSlider();
    }

    reloadComponent(): void {
      const id = this.authService.getLastIdPageFromSession();
        if(id && id != undefined && id != 0)
        {
          switch(id){
            case 5:
              this.datiStrutturaComponent.ngOnInit();
              break;
            case 6:
              this.gestionePromoComponent.ngOnInit();
              break;
            case 7:
              this.riepilogoPromoComponent.ngOnInit();
              break;
            case 9:
              this.favoriteComponent.ngOnInit();
              break;
            case 11:
              this.couponComponent.ngOnInit();
              break;
            case 12:
              this.userComponent.ngOnInit();
              break;
          }
          
        }
    }

    startSlider() {
      setInterval(() => {
        this.showNextSlide();
      }, 6000); // Cambia ogni 3 secondi
    }

    showNextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    }

  onAttivitaSelezionata(attivita: Attivita): void {
    this.attivitaService.apiGetListaTop3ImmaginiById(attivita.idAttivita).subscribe((data: Immagini[]) => {
      attivita.immagini = data;
     });
     this.attivitaService.apiGetOrariById(attivita.idAttivita).subscribe((data: Orari) => {
      attivita.orari = data;
     });
    this.attivita = attivita;
    this.idPage = 3;
    this.authService.setLastIdPageInSession(this.idPage);
    this.openPageEvent(this.idPage)
  }

  ricercaAttiviaSelezionataEvent(attivitaRequest: Attivita | undefined): void {
    if(attivitaRequest)
        this.attivita = attivitaRequest;
    this.idPage = 3;
    this.authService.setLastIdPageInSession(this.idPage);
    this.openPageEvent(this.idPage)
  }

  attivitaRicercateEvent(attivitaRequest: Attivita[] | undefined): void {
    if(attivitaRequest)
        this.attivitaRicercate = attivitaRequest;
    this.idPage = 2;
    this.authService.setLastIdPageInSession(this.idPage);
    this.openPageEvent(this.idPage)
  }
  

  openPageEvent(idPage:number) {
    this.idPage = idPage;
    this.openPageEventNav.emit(this.idPage);
  }

  openPageEventLogin() {
    this.isOpenPageLoginEvent(true);
  }

  setiIdSogggetto(id:number | undefined){
    this.updateIdFooter.emit(id);
  }

  openPageRicercaPromoEvent(idTipoPromo:number) {
    this.RicercaPromo(idTipoPromo);
  }

  async RicercaPromo(id:number): Promise<void> {
    this.filtro = new FiltriAttivita();

    const getCurrentPositionPromise = (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };
  
    if (navigator.geolocation) {
      try {
        const position = await getCurrentPositionPromise();
        this.filtro.latitudine = position.coords.latitude;
        this.filtro.longitudine = position.coords.longitude;
      } catch (error) {
        console.log(error);
      }
    }

    if(id)
    {
      this.filtro.codTipoPromo = [];
      this.isLoading = true;
      this.filtro.codTipoPromo?.push(id);
      (await this.attivitaService.apiGetListaAttivitaFiltrate(this.filtro)).subscribe(
        (data: AttivitaFiltrate) => {
          this.listaAttivitaRicerca = data;
        },
        (error: any) => {
          console.error("Errore durante la chiamata API:", error);
        },
        () => {

          if(this.listaAttivitaRicerca){
            this.attivitaService.setListaAttivitaFiltrate(this.listaAttivitaRicerca);
            this.attivitaService.setIsListaAttModalOpen(true);
          }
          this.isLoading = false;
          this.openPageEvent(2);
        }
      );
    }
  }

  openPageRicercaTipoAttEvent(tipoAtt:string) {
    this.RicercaTipoAtt(tipoAtt);
  }

  async RicercaTipoAtt(tipoAtt:string): Promise<void> {
    this.filtro = new FiltriAttivita();

    const getCurrentPositionPromise = (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };
  
    if (navigator.geolocation) {
      try {
        const position = await getCurrentPositionPromise();
        this.filtro.latitudine = position.coords.latitude;
        this.filtro.longitudine = position.coords.longitude;
      } catch (error) {
        console.log(error);
      }
    }

    if(tipoAtt)
    {
      this.isLoading = true;
      this.filtro.codTipoAttivita = tipoAtt;
      (await this.attivitaService.apiGetListaAttivitaFiltrate(this.filtro)).subscribe(
        (data: AttivitaFiltrate) => {
          this.listaAttivitaRicerca = data;
        },
        (error: any) => {
          console.error("Errore durante la chiamata API:", error);
        },
        () => {
          if(this.listaAttivitaRicerca){
            this.attivitaService.setListaAttivitaFiltrate(this.listaAttivitaRicerca);
            this.attivitaService.setIsListaAttModalOpen(true);
          }
          this.isLoading = false;
          this.openPageEvent(2);
        }
      );
    }
  }

  handleLocationError(error: GeolocationPositionError): void {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('Accesso alla geolocalizzazione negato.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Informazioni sulla posizione non disponibili.');
        break;
      case error.TIMEOUT:
        console.error('Richiesta di geolocalizzazione scaduta.');
        break;
    }
    this.isLoading = false;
  }

  async loadData() {
    if (this.idPage == 1 || this.idPage == undefined) {
      if(this.idPage == 1)
        this.authService.setLastIdPageInSession(this.idPage);
      
      this.isCaricamentoOk = false;
      this.isLoading = true;

      
      if(!this.listaElencoConsigli || !this.listaElencoPromo){
        try {
          const data: AttivitaHomePageResponse = await firstValueFrom(
            this.attivitaService.apiGetListaAttivitaHomePage().pipe(
              retry(2), // Riprova la chiamata fino a 3 volte in caso di errore
              catchError((error) => {
                // Gestione errore
                console.error('Errore di connessione', error);
                this.isLoading = false;
                this.errorMessage = 'Errore di connessione, si prega di riprovare';
                throw error; // Propaga l'errore
              })
            )
          );
          this.listaElencoConsigli = data.listUltimeAttReg;
          if(this.listaElencoConsigli)
            this.attivitaService.createListAttivitaNearHomeSession(this.listaElencoConsigli);
          this.listaElencoPromo = data.listAttivitaWithPromo;
          if(this.listaElencoPromo)
            this.attivitaService.createListAttivitaPromoHomeSession(this.listaElencoPromo);
        } catch (error) {
          // Gestisci l'errore in caso di fallimento anche dopo i retry
          console.error('Errore di connessione', error);
          this.errorMessage = 'Errore di connessione, si prega di riprovare';
        } finally {
          this.isLoading = false;
        }
      }
    }
    if(this.listaElencoConsigli && this.listaElencoPromo)
    {
      this.errorMessage ='';
      this.isCaricamentoOk = true;
    }
    this.isLoading = false;
  }

  isOpenPageLoginEvent(isOpen:boolean){
    this.isModalLoginOpenEvent.emit(isOpen);
  }

  async redirectEsitoEvent(typeRedirect:boolean){
    this.openPageEventNav.emit(typeRedirect? 11 : 1);
  }

  getErrorMessage(): string | undefined {
    return this.errorMessage;
  }

  retry(){
    location.reload();
  }
}
