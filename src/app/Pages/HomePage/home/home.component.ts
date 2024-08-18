import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, AttivitaFiltrate, AttivitaHomePageResponse, FiltriAttivita, Immagini, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { catchError, firstValueFrom, retry } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  listaElencoConsigli : Attivita[] | undefined;
  listaElencoPromo : Attivita[] | undefined;
  listaElencoPub : Attivita[] | undefined;
  listaElencoRistoranti : Attivita[] | undefined;
  listaElencoFastFood : Attivita[] | undefined;
  filtro: FiltriAttivita | undefined;
  listaAttivitaRicerca: AttivitaFiltrate | undefined;
  position: GeolocationPosition | undefined;
  isLoading : boolean | undefined;
  idSoggetto : number | undefined;
  @Input() idPage!: number;
  @Input() listaTipoAttivita: TipoAttivita[] =[];
  attivita: Attivita | undefined;
  attivitaRicercate: Attivita [] | undefined;
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

          this.loadData()
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
    this.openPageEvent(this.idPage)
  }

  ricercaAttiviaSelezionataEvent(attivitaRequest: Attivita | undefined): void {
    if(attivitaRequest)
        this.attivita = attivitaRequest;
    this.idPage = 3;
    this.openPageEvent(this.idPage)
  }

  attivitaRicercateEvent(attivitaRequest: Attivita[] | undefined): void {
    if(attivitaRequest)
        this.attivitaRicercate = attivitaRequest;
    this.idPage = 2;
    this.openPageEvent(this.idPage)
  }
  

  openPageEvent(idPage:number) {
    this.idPage = idPage;
    this.openPageEventNav.emit(this.idPage);
  }

  setiIdSogggetto(id:number | undefined){
    this.updateIdFooter.emit(id);
  }

  openPageRicercaPromoEvent(idTipoPromo:number) {
    this.RicercaPromo(idTipoPromo);
  }

  async RicercaPromo(id:number): Promise<void> {
    this.filtro = new FiltriAttivita();
    this.filtro.tipoRicerca = 4;

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
      console.log(id);
      this.isLoading = true;
      this.filtro.codTipoPromo?.push(id);
      console.log(this.filtro);
      (await this.attivitaService.apiGetListaAttivitaFiltrate(this.filtro)).subscribe(
        (data: AttivitaFiltrate) => {
          this.listaAttivitaRicerca = data;
        },
        (error: any) => {
          console.error("Errore durante la chiamata API:", error);
        },
        () => {

          if(this.listaAttivitaRicerca)
            this.attivitaService.setListaAttivitaFiltrate(this.listaAttivitaRicerca);
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
    this.filtro.tipoRicerca = 3;

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
          if(this.listaAttivitaRicerca)
            this.attivitaService.setListaAttivitaFiltrate(this.listaAttivitaRicerca);
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
      this.isLoading = true;

      this.listaElencoConsigli = this.attivitaService.getListAttivitaNearHomeSession();
      this.listaElencoPromo = this.attivitaService.getListAttivitaPromoHomeSession();
      if(!this.listaElencoConsigli || !this.listaElencoPromo){
        try {
          const data: AttivitaHomePageResponse = await firstValueFrom(
            this.attivitaService.apiGetListaAttivitaHomePage().pipe(
              retry(2), // Riprova la chiamata fino a 3 volte in caso di errore
              catchError((error) => {
                // Gestione errore
                console.error('Errore durante la chiamata all\'API', error);
                this.isLoading = false;
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
          console.error('Errore irreversibile', error);
        } finally {
          this.isLoading = false;
        }
      }
    }
    this.isLoading = false;
  }

  isOpenPageLoginEvent(isOpen:boolean){
    this.isModalLoginOpenEvent.emit(isOpen);
  }

  async redirectEsitoEvent(typeRedirect:boolean){
    this.openPageEventNav.emit(typeRedirect? 11 : 1);
  }
}
