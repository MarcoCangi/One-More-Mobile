import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, AttivitaFiltrate, AttivitaHomePageResponse, FiltriAttivita, Immagini, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { DettaglioComponent } from '../../Attivita/ProfiloAttivita/dettaglio/dettaglio.component';
import { LogoutComponent } from '../logout/logout.component';
import { DatiStrutturaComponent } from '../../Attivita/RegistraAttivita/dati-struttura/dati-struttura.component';
import { GestionePromoComponent } from '../../Attivita/ProfiloAttivita/gestione-promo/gestione-promo.component';
import { RicercaComponent } from '../ricerca/ricerca.component';
import { FavoritesComponent } from '../../favorites/favorites.component';
import { CouponComponent } from '../../coupon/coupon.component';
import { UserComponent } from '../../user/user.component';
import { RiepilogoPromoAttivitaComponent } from '../../Attivita/ProfiloAttivita/riepilogo-promo-attivita/riepilogo-promo-attivita.component';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';
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
  listaElencoNuove : Attivita[] | undefined;
  listaElencoPromo : Attivita[] | undefined;
  listaElencoVicini : Attivita[] | undefined;
  listCitta : string[] | undefined;
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
  latitudine: number = 0;
  longitudine: number = 0;
  @Output() openPageEventNav = new EventEmitter<number>();
  @Output() updateIdFooter = new EventEmitter<number>();
  @Output() isModalLoginOpenEvent = new EventEmitter<boolean>();

  constructor(
    private attivitaService: GetApiAttivitaService,
    private authService: AuthService,
    private locationService: LocationService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    const userSession = this.authService.getUserSession();
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
    // this.attivitaService.apiGetListaTop3ImmaginiById(attivita.idAttivita).subscribe((data: Immagini[]) => {
    //   attivita.immagini = data;
    //  });
    //  this.attivitaService.apiGetOrariById(attivita.idAttivita).subscribe((data: Orari) => {
    //   attivita.orari = data;
    //  });
    //  this.attivitaService.apiGetAttivitaByIdAttivita(attivita.idAttivita).subscribe((data: Attivita) => {
    //   attivita = data;
    //   console.log(this.attivita);
    //  });
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

  openPageRicercaCittaEvent(citta:string) {
    this.RicercaCitta(citta);
  }

  openPageRicercaTipoAttEvent(tipoAtt:string) {
    this.RicercaTipoAtt(tipoAtt);
  }

  async RicercaPromo(id:number): Promise<void> {
    this.filtro = new FiltriAttivita();

    const { latitudine, longitudine } = await this.locationService.getCurrentLocation();
    this.filtro.latitudine = latitudine;
    this.filtro.longitudine = longitudine;

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

  async RicercaCitta(citta:string): Promise<void> {
    this.filtro = new FiltriAttivita();

    if(citta)
    {
      this.filtro.citta = citta;
      this.isLoading = true;
      
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

  async RicercaTipoAtt(tipoAtt:string): Promise<void> {
    this.filtro = new FiltriAttivita();

    const { latitudine, longitudine } = await this.locationService.getCurrentLocation();
    this.filtro.latitudine = latitudine;
    this.filtro.longitudine = longitudine;

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
      
      const { latitudine, longitudine } = await this.locationService.getCurrentLocation();
      this.latitudine = latitudine;
      this.longitudine = longitudine;
      }
    
    this.isCaricamentoOk = true;
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

  async getListAttivita(idTypeRicerca:TipoRicercaAttivita){
    this.filtro = new FiltriAttivita();

    const { latitudine, longitudine } = await this.locationService.getCurrentLocation();
    this.filtro.latitudine = latitudine;
    this.filtro.longitudine = longitudine;
    this.filtro.tipoRicercaAttivita = idTypeRicerca;
    if(idTypeRicerca)
    {
      this.isLoading = true;
      this.filtro.isHomePage = true;
      this.filtro.typeFilterHomePage = idTypeRicerca;
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
}
