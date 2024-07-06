/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { Attivita, AttivitaRicerca, Orari, TipoAttivita } from './EntityInterface/Attivita';
import { AuthService } from './Services/Auth/auth.service';
import { GetApiAttivitaService } from './Services/get-api-attivita.service';
import { UserSession } from './EntityInterface/Utente';

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

  constructor(private authService: AuthService, private attivitaService: GetApiAttivitaService) { }

  ngOnInit(): void {
    this.checkAndRefreshToken();

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

}
