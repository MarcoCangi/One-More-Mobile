import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, AttivitaFiltrate, AttivitaHomePageResponse, FiltriAttivita, Immagini, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { DettaglioComponent } from '../../Attivita/ProfiloAttivita/dettaglio/dettaglio.component';
import { LogoutComponent } from '../../logout/logout.component';
import { DatiStrutturaComponent } from '../../Attivita/RegistraAttivita/dati-struttura/dati-struttura.component';
import { GestionePromoComponent } from '../../Attivita/ProfiloAttivita/gestione-promo/gestione-promo.component';
import { RicercaComponent } from '../../ricerca/ricerca.component';
import { FavoritesComponent } from '../../favorites/favorites.component';
import { CouponComponent } from '../../coupon/coupon.component';
import { UserComponent } from '../../user/user.component';
import { RiepilogoPromoAttivitaComponent } from '../../Attivita/ProfiloAttivita/riepilogo-promo-attivita/riepilogo-promo-attivita.component';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';
import { firstValueFrom, Observable } from 'rxjs';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
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
  @Input() listaCitta: Comuni[] = [];
  attivita: Attivita | undefined;
  attivitaRicercate: Attivita [] | undefined;
  alertButtons = ['Ricarica'];
  latitudine: number = 0;
  longitudine: number = 0;
  @Output() openPageEventNav = new EventEmitter<number>();
  @Output() openPageEventNavUpdPromo = new EventEmitter<void>();
  @Output() updateIdFooter = new EventEmitter<number>();
  @Output() isModalLoginOpenEvent = new EventEmitter<boolean>();

  constructor(
    private attivitaService: GetApiAttivitaService,
    private authService: AuthService,
    private locationService: LocationService,
    private storageService: StorageService
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

          const cacheKeyfiltro_ricerca = `filtro_ricerca`;
          this.storageService.removeItem(cacheKeyfiltro_ricerca);

          const cacheKeytipoRicerca = `tipoRicerca`;
          this.storageService.removeItem(cacheKeytipoRicerca);

          this.loadData();
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

  onAttivitaSelezionata(attivita: Attivita): void {
    this.attivita = attivita;
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

  openPageEventUpd(idPage: number) {
    this.openPageEventNavUpdPromo.emit(); // questo va al padre: NAV
    this.idPage = idPage;
  }

  openPageEventLogin() {
    this.isOpenPageLoginEvent(true);
  }

  setiIdSogggetto(id:number | undefined){
    this.updateIdFooter.emit(id);
  }

  async openPageRicercaPromoEvent(id: number): Promise<void> {
    if (!id) return;
    const filtro = new FiltriAttivita();
    filtro.codTipoPromo = [id];
    filtro.tipoRicercaAttivita = 3;
    await this.ricercaGenerica(filtro);
  }

  async openPageRicercaCittaEvent(citta: string): Promise<void> {
    if (!citta) return;
    const filtro = new FiltriAttivita();
    filtro.citta = citta;
    await this.ricercaGenerica(filtro);
  }

  async openPageRicercaTipoAttEvent(tipoAtt: string): Promise<void> {
    if (!tipoAtt) return;
    const filtro = new FiltriAttivita();
    filtro.codTipoAttivita = tipoAtt;
    await this.ricercaGenerica(filtro);
  }

  private async ricercaGenerica(filtro: FiltriAttivita): Promise<void> {
    this.isLoading = true;
    try {
      const result = await firstValueFrom(await this.attivitaService.apiGetListaAttivitaFiltrate(filtro));
      const cacheKey = `filtro_ricerca`;
      await this.storageService.setItem(cacheKey, filtro);
      this.listaAttivitaRicerca = result;
      this.attivitaService.setListaAttivitaFiltrate(this.listaAttivitaRicerca);
      this.attivitaService.setIsListaAttModalOpen(true);
      this.openPageEvent(2);
    } catch (error) {
      console.error("Errore durante la chiamata API:", error);
    } finally {
      this.isLoading = false;
    }
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

  async getListAttivitaFromArrow(idTypeRicerca: TipoRicercaAttivita) {
    const { latitudine, longitudine } = await this.locationService.getCurrentLocation();
  
    if (!idTypeRicerca) return;
  
    this.isLoading = true;
  
    let apiCall$: Observable<Attivita[]>;
  
    switch (idTypeRicerca) {
      case TipoRicercaAttivita.AttivitaConPromo:
        apiCall$ = await this.attivitaService.apiGetListaAttivitaWhitPromo(latitudine, longitudine, false);
        break;
  
      case TipoRicercaAttivita.AttivitaVicine:
        apiCall$ = await this.attivitaService.apiGetListaAttivitaNear(latitudine, longitudine, false);
        break;
  
      case TipoRicercaAttivita.AttivitaPromoBevande:
        apiCall$ = await this.attivitaService.apiGetListaAttivitaFoodDrinkPromo(latitudine, longitudine, 2, true);
        break;

      case TipoRicercaAttivita.AttivitaPromoCibo:
        apiCall$ = await this.attivitaService.apiGetListaAttivitaFoodDrinkPromo(latitudine, longitudine, 1, true);
        break;
      
      case TipoRicercaAttivita.AttivitaNuove:
      default:
        apiCall$ = await this.attivitaService.apiGetListaAttivitaJustSigned(latitudine, longitudine, false);
        break;
    }
  
    apiCall$.subscribe(
      async (data: Attivita[]) => {
        const cacheKey = `tipoRicerca`;
        await this.storageService.removeItem(cacheKey);
        await this.storageService.setItem(cacheKey, idTypeRicerca);
        const attivitaFiltrate = new AttivitaFiltrate(data, latitudine, longitudine, '');
        this.listaAttivitaRicerca = attivitaFiltrate;
  
        this.attivitaService.setListaAttivitaFiltrate(this.listaAttivitaRicerca);
        this.attivitaService.setIsListaAttModalOpen(true);
  
        this.isLoading = false;
        this.openPageEvent(2);
      },
      (error: any) => {
        console.error("Errore durante la chiamata API:", error);
        this.isLoading = false;
      }
    );
  }
}
