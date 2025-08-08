import { AfterViewInit, ElementRef, ViewChild } from '@angular/core'; // aggiungi sopra
import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { Geolocation } from '@capacitor/geolocation';
import { MessagingService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/MessagingService';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { GetApiComuniService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-comuni.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  lblFlag: string = "it";
  isIta: boolean = true;
  faMap = faMap;
  datiAttivita: Attivita | undefined;
  listaAttivitaDDL: TipoAttivita[] = [];
  listaCitta: Comuni[] = [];
  attivita: Attivita | undefined;
  sessioneString: UserSession | undefined;
  orari: Orari | undefined;
  hasAttivita: string | undefined;
  isSearchSticky = false;
  idSoggetto: number | undefined;
  idPage!: number;
  showSplash = true;
  keyboardOpen: boolean = false;
  private initialHeight: number = window.innerHeight;
  @ViewChild('splashVideo', { static: false }) splashVideoRef!: ElementRef<HTMLVideoElement>;
  showOverlay = true; // nuova proprietà per mostrare l'overlay iniziale

  constructor(private authService: AuthService, 
              private attivitaService: GetApiAttivitaService,
              private comuniService: GetApiComuniService,
              private messagingService: MessagingService,
              private translate: TranslateService,
              private locationService: LocationService,
              private storageService: StorageService) { }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      const height = window.innerHeight;
      // Se si è ridotta di almeno 150px, supponiamo che la tastiera sia aperta
      this.keyboardOpen = height < this.initialHeight - 150;
    });
  }

  async ngOnInit(): Promise<void> {

    setTimeout(() => {
      if (this.showSplash) {
        this.SetIsSShowSplashEnded();
      }
    }, 7000);

    this.checkAndRefreshToken();

    this.authService.language$.subscribe((lang) => {
      this.lblFlag = lang;
      this.isIta = lang === "it";
      this.translate.use(lang);
    });

    await this.locationService.getCurrentLocation();

    this.checkIsAddAtt();

    //GET LISTA DEC TIPO ATTIVITA
    this.attivitaService.getlistaAttivitaDDL().subscribe(async (listaAttivitaDDL) => {
      if (!listaAttivitaDDL) {
        (await this.attivitaService.apiGetListaDecAttivita()).subscribe((data: TipoAttivita[]) => {
          this.listaAttivitaDDL = data.map((item: TipoAttivita) => {
            return {
              codTipoAttivita: item.codTipoAttivita,
              descrizione: item.descrizione
            };
          });
          this.attivitaService.setlistaAttivitaDDL(this.listaAttivitaDDL);
        });
      } else {
        this.listaAttivitaDDL = listaAttivitaDDL;
      }
    });

    //GET LISTA COMUNI
    this.comuniService.apiGetListaComuni().subscribe(async (listaCitta) => {
      if (!listaCitta) {
        (await this.comuniService.apiGetListaComuni()).subscribe((data: Comuni[]) => {
          this.listaCitta = data.map((item: Comuni) => {
            return {
              CodCatastale: item.CodCatastale,
              descComune: item.descComune,
              provincia: item.provincia,  
              isinseribile: item.isinseribile
            };
          });
          this.comuniService.setlistaComuni(this.listaCitta);
        });
      } else {
        this.listaCitta = listaCitta;
      }
    });

    // Osserva quando cambia la classe del body (per intercettare la tastiera)
  const observer = new MutationObserver(() => {
    this.keyboardOpen = document.body.classList.contains('keyboard-open');
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  async setLanguage() {
    const newLang = this.isIta ? "en" : "it";
    await this.authService.saveLanguageSession(newLang);
  }

  SetIsSShowSplashEnded(){
    this.showSplash = false;
    this.authService.setIsShowedSplash(); // segna che lo splash è stato già mostrato
  }

  onVideoReady() {
    console.log("✅ Video pronto a partire");
    this.showOverlay = false;

    const video = this.splashVideoRef?.nativeElement;
    if (video) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("🎥 Video avviato correttamente");
          })
          .catch((err) => {
            console.warn("⚠️ Autoplay bloccato, fallback dopo 4s:", err);
          });
      }
    }
  }

  async checkAndRefreshToken(): Promise<void> {
    try {
      const userSession = this.authService.getUserSession();
      if (userSession && userSession.uid) {
        const isTokenValid = await this.authService.refreshToken(userSession);
        if (!isTokenValid) {
          this.authService.deleteUserSession();
          this.attivitaService.deleteSession();
        }
      } else {
        this.authService.deleteUserSession();
        this.attivitaService.deleteSession();
      }
    } catch (error) {
      console.error('Errore durante la verifica e l\'aggiornamento del token:', error);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    this.checkScroll();
  }

  checkScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Imposta lo stato "sticky" in base alla posizione dello scroll
    this.isSearchSticky = scrollPosition > 50; // Puoi regolare il valore di 50 in base alla tua esigenza
  }

  async openPageEvent(idPage: number) {
    
    if (idPage === 1) {
      // Se siamo già sulla Home e viene ricliccato, forziamo il reload
      this.reloadHomePage();
    } else {
      this.idPage = idPage;
      if(this.idPage != 2)
        this.attivitaService.setFilter(undefined);
    }
  }

  async checkIsAddAtt(){
    const isAttUpdateOrSaved = await this.storageService.getItem(`isSavedUpdateAtt`);
    if(isAttUpdateOrSaved == true){
      await this.openPageEvent(5);
    }
  }

  reloadHomePage() {
    // Rimuovi eventuali filtri o stato temporaneo
    this.attivitaService.setFilter(undefined);
  
    // Ricarica i dati iniziali della Home (puoi richiamare metodi specifici se vuoi un refresh parziale)
    // Oppure, se preferisci, forzare un reload dell'intera route (dipende da come è fatta la Home)
    location.reload(); // Ricarica la pagina intera senza passare dallo splash (perché è già stato settato a true)
  }

  updateIdFooterEvent(id: number | undefined) {
    this.idSoggetto = id;
  }
}
