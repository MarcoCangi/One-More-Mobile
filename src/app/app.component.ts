/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, HostListener, OnInit } from '@angular/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
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
  showCookiePanel = true;

  constructor(private authService: AuthService, 
              private attivitaService: GetApiAttivitaService,
              private cookieService: CookieService) { }

  ngOnInit(): void {
    this.checkAndRefreshToken();

    const cookieConsent = this.cookieService.get('cookieConsent');
    if (cookieConsent === 'true') {
      this.enableTrackingServices();
      //this.showCookiePanel = false;
    }

    const splashShown = localStorage.getItem('splashShown');
    if (!splashShown) {
      setTimeout(() => {
        this.showSplash = false;
        localStorage.setItem('splashShown', 'true');
      }, 3000);
    } else {
      this.showSplash = false;
    }

    //GET LISTA DEC TIPO ATTIVITA
    this.attivitaService.getlistaAttivitaDDL().subscribe((listaAttivitaDDL) => {
      if (!listaAttivitaDDL) {
        this.attivitaService.apiGetListaDecAttivita().subscribe((data: TipoAttivita[]) => {
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

  async checkAndRefreshToken(): Promise<void> {
    try {
      const userSession = this.authService.getUserSessionFromCookie();
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

  openPageEvent(idPage: number) {
    this.idPage = idPage;
  }

  updateIdFooterEvent(id: number | undefined) {
    this.idSoggetto = id;
  }
  
  enableTrackingServices() {
    // Abilita qui eventuali servizi che dipendono dal consenso dei cookie
  }

  dismissCookiePanel(){
    this.showCookiePanel = false;
  }
}
