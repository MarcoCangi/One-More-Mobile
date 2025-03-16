/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { Geolocation } from '@capacitor/geolocation';
import { MessagingService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/MessagingService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  lblFlag: string = "it";
  isIta: boolean = true;
  faMap = faMap;
  datiAttivita: Attivita | undefined;
  listaAttivitaDDL: TipoAttivita[] = [];
  attivita: Attivita | undefined;
  sessioneString: UserSession | undefined;
  orari: Orari | undefined;
  hasAttivita: string | undefined;
  isSearchSticky = false;
  idSoggetto: number | undefined;
  idPage!: number;
  showSplash = true;
  IsShowSplashVisible : boolean = false;

  constructor(private authService: AuthService, 
              private attivitaService: GetApiAttivitaService,
              private messagingService: MessagingService,
              private translate: TranslateService) { }

  async ngOnInit(): Promise<void> {
    this.checkAndRefreshToken();

    this.authService.language$.subscribe((lang) => {
      this.lblFlag = lang;
      this.isIta = lang === "it";
      this.translate.use(lang);
    });

    await this.requestGeolocationPermission();

    this.IsShowSplashVisible = this.authService.getIsShowedSplash();
    if (this.showSplash && !this.IsShowSplashVisible) {
      setTimeout(() => {
        this.showSplash = false;
        localStorage.setItem('splashShown', 'true');
        this.authService.setIsShowedSplash(true);
      }, 3000);
    } else {
      this.showSplash = false;
    }

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
  }

  setLanguage() {
    const newLang = this.isIta ? "en" : "it";
    this.authService.saveLanguageSession(newLang);
  }

  async requestGeolocationPermission() {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        // Il permesso è stato concesso
        const position = await Geolocation.getCurrentPosition();
      } else {
        console.log('Permesso negato per la geolocalizzazione');
      }
    } catch (error) {
      console.error('Errore durante la richiesta dei permessi di geolocalizzazione:', error);
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
      this.idPage = idPage;
      if(this.idPage != 2)
        this.attivitaService.setFilter(undefined);
  }

  updateIdFooterEvent(id: number | undefined) {
    this.idSoggetto = id;
  }
}
