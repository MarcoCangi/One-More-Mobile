/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Attivita, AttivitaFiltrate, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {

  @Input() listaTipoAttivita: TipoAttivita[] = [];
  faMap = faMap;
  searchForm: FormGroup | undefined;
  inputControl = new FormControl();
  filteredOptions: Observable<TipoAttivita[]> | null = null;
  showDropdown = true;
  private _filterValue = '';
  selectedOption: TipoAttivita | null = null;
  position: GeolocationPosition | undefined;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  filtro: FiltriAttivita | undefined;
  listaAttivitaRicerca: AttivitaFiltrate | undefined;
  mostraRegistraAttivita : boolean = false;
  mostraLoginButton : boolean = true;
  mostraIcona : boolean = false;
  sessione : string | null | undefined;
  idAttivita : number | undefined;
  isIdAttValorizzato : boolean | undefined;
  isModalLoginOpen = false;
  isModalRegisterOpen = false;
  isHomeOpen = true;
  isReload = false;
  listaElencoConsigli: Attivita[] | undefined;
  listaElencoPromo: Attivita[] | undefined;
  @ViewChild(IonModal) modal: IonModal | undefined;
  @Output() openMappaEvent = new EventEmitter<void>();
  @Output() openPageEvent = new EventEmitter<number>();
  @Output() updateIdFooterEvent = new EventEmitter<number>();
  @Input() idPage!: number;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string | undefined;


  constructor(private authService: AuthService,
              private attivitaService: GetApiAttivitaService,
              private formBuilder: FormBuilder, ) {}

    ngOnInit(): void { 
        this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
        this.mostraLoginButton = !isLoggedIn;
        this.mostraRegistraAttivita = isLoggedIn;
        this.mostraIcona = isLoggedIn;
      });

      if(this.idPage)
        this.openPage(this.idPage);
  
      this.searchForm = this.formBuilder.group({
        nomeLocale: [''],
        citta: [''],
        tipoLocale: ['']
      });
    }

    cancel() {
      if(this.modal)
        this.modal.dismiss(null, 'cancel');
    }

    openLogOut(){
      this.idPage = 4;
      this.openPageEventNav(this.idPage);
      this.openPage(this.idPage);
      this.cancel();
    }

    openProfile(){
      this.idPage = 12;
      this.openPageEventNav(this.idPage);
      this.openPage(this.idPage);
      this.cancel();
    }

    openRegistraAttivita(){
      this.idPage = 5;
      this.openPageEventNav(this.idPage);
      this.openPage(this.idPage);
      this.cancel();
    }

    openNewPromo(){
      this.idPage = 6;
      this.openPageEventNav(this.idPage);
      this.openPage(this.idPage);
      this.cancel();
    }

    openRiepilogoPromoAtt(){
      this.idPage = 7;
      this.openPageEventNav(this.idPage);
      this.openPage(this.idPage);
      this.cancel();
    }

    openPreferiti(){
      this.idPage = 9;
      this.openPageEventNav(this.idPage);
      this.openPage(this.idPage);
      this.cancel();
    }
    
    onWillDismiss(event: Event) {
      const ev = event as CustomEvent<OverlayEventDetail<string>>;
      if (ev.detail.role === 'confirm') {
        this.message = `Hello, ${ev.detail.data}!`;
      }
    }

  idAttivitaIsValorizzato(): boolean { 
    const userSession = this.authService.getUserSessionFromCookie();

    if (userSession && userSession.idAttivita && userSession.idAttivita > 0) {  
 
      return true;  
    }
    return false;
  }

  ShowLogin(){
    if(this.isModalLoginOpen){
        this.isModalRegisterOpen = false;
        this.isModalLoginOpen = false;
        this.isHomeOpen = true;
      }
    else{
      this.isModalRegisterOpen = false;
      this.isHomeOpen = false;
      this.isModalLoginOpen = true;
    }
  }

  closeLogin() {
    this.listaElencoConsigli = this.attivitaService.getListAttivitaNearHomeSession();
    this.listaElencoPromo = this.attivitaService.getListAttivitaPromoHomeSession();
    if(!this.listaElencoConsigli || this.listaElencoPromo)
      window.location.reload();
    
    this.isModalLoginOpen = false;
    this.isHomeOpen = true;
  }

  ShowRegister(){
    if(this.isModalRegisterOpen){
        this.isModalLoginOpen = false;
        this.isModalRegisterOpen = false;
        this.isHomeOpen = true;
      }
      
    else{
      this.isModalLoginOpen = false;
      this.isHomeOpen = false;
      this.isModalRegisterOpen = true;
    }
  }

  closeRegister() {
    this.isModalRegisterOpen = false;
    this.isHomeOpen = true;
  }

  openModal() {
    if (this.modal) {
      this.modal.present();
    }
  }

  openPageEventNav(idPage:number) {
    this.openPage(idPage);
    this.idPage = idPage;
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }
  
  updateIdFooter(id:number | undefined){
    this.updateIdFooterEvent.emit(id);
  }

  isOpenPageLoginEvent(isOpen:boolean){
    if(isOpen){
      this.ShowLogin();
    }
  }
}
