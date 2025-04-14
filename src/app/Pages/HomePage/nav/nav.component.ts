import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Attivita, AttivitaFiltrate, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { HomeComponent } from '../home/home.component';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service'; 

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() listaTipoAttivita: TipoAttivita[] = [];
  @Input() idPage!: number;
  @Output() openMappaEvent = new EventEmitter<void>();
  @Output() openPageEvent = new EventEmitter<number>();
  @Output() updateIdFooterEvent = new EventEmitter<number>();

  @ViewChild(HomeComponent) childComponent!: HomeComponent;
  @ViewChild(IonModal) modal: IonModal | undefined;

  faMap = faMap;
  lblFlag: string = 'it';
  isIta = true;
  isHomeOpen = true;
  isModalLoginOpen = false;
  isModalRegisterOpen = false;
  mostraLoginButton = true;
  mostraRegistraAttivita = false;
  mostraIcona = false;

  searchForm: FormGroup | undefined;
  inputControl = new FormControl();
  filteredOptions: Observable<TipoAttivita[]> | null = null;
  selectedOption: TipoAttivita | null = null;

  message = '';
  listaElencoNuove: Attivita[] | undefined;
  listaElencoPromo: Attivita[] | undefined;
  listaElencoVicine: Attivita[] | undefined;
  filtro: FiltriAttivita | undefined;
  listaAttivitaRicerca: AttivitaFiltrate | undefined;

  constructor(
    private authService: AuthService,
    private attivitaService: GetApiAttivitaService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.authService.language$.subscribe((lang) => {
      this.lblFlag = lang;
      this.isIta = lang === 'it';
      this.translate.use(lang);
    });

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.mostraLoginButton = !isLoggedIn;
      this.mostraRegistraAttivita = isLoggedIn;
      this.mostraIcona = isLoggedIn;
    });

    if (this.idPage) this.openPage(this.idPage);

    this.searchForm = this.formBuilder.group({
      nomeLocale: [''],
      citta: [''],
      tipoLocale: [''],
    });
  }

  cancel() {
    if (this.modal) this.modal.dismiss(null, 'cancel');
  }

  callChildMethod() {
    if (this.childComponent) {
      this.childComponent.reloadComponent();
    }
  }

  // ✅ Metodo riutilizzabile per aprire una pagina e richiamare il figlio
  goToPage(idPage: number) {
    this.idPage = idPage;
      const id = this.authService.getLastIdPageFromSession();
      if (this.idPage == id) {
        this.openPageEventNav(this.idPage);
        this.callChildMethod();
      } else {
        this.authService.setLastIdPageInSession(this.idPage);
        this.openPageEventNav(this.idPage);
      }
      this.cancel();
  }

  openPageEventNav(idPage: number) {
    this.openPage(idPage);
    this.idPage = idPage;
  }

  openPage(idPage: number) {
    this.openPageEvent.emit(idPage);
  }

  updateIdFooter(id: number | undefined) {
    this.updateIdFooterEvent.emit(id);
  }

  isOpenPageLoginEvent(isOpen: boolean) {
    if (isOpen) {
      this.ShowLogin();
    }
  }

  ShowLogin() {
    this.isModalRegisterOpen = false;
    this.isModalLoginOpen = true;
    this.isHomeOpen = false;
  }

  ShowRegister() {
    this.isModalLoginOpen = false;
    this.isModalRegisterOpen = true;
    this.isHomeOpen = false;
  }

  closeLogin() {
    this.listaElencoNuove = this.attivitaService.getListAttivitaNewSession();
    this.listaElencoPromo = this.attivitaService.getListAttivitaPromoHomeSession();
    this.listaElencoVicine = this.attivitaService.getListAttivitaVicineHomeSession();

    if (!this.listaElencoNuove || !this.listaElencoPromo || !this.listaElencoVicine) {
      window.location.reload();
    }

    this.isModalLoginOpen = false;
    this.isHomeOpen = true;
  }

  closeRegister() {
    this.isModalRegisterOpen = false;
    this.isHomeOpen = true;
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  idAttivitaIsValorizzato(): boolean {
    const userSession = this.authService.getUserSession();
    return !!(userSession && userSession.idAttivita && userSession.idAttivita > 0);
  }

  setLanguage() {
    const newLang = this.isIta ? 'en' : 'it';
    this.authService.saveLanguageSession(newLang);
    window.location.reload();
  }

  openModal() {
    if (this.modal) this.modal.present();
  }
}
