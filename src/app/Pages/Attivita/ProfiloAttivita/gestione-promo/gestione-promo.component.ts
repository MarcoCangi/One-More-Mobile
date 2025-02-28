import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { catchError, lastValueFrom, of, tap, throwError } from 'rxjs';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { DatePipe } from '@angular/common';
import { Attivita, Orari } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GiorniSettimanaPromo, InsertPromoReqDto, Promo, TipologiaOfferta } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-gestione-promo',
  templateUrl: './gestione-promo.component.html',
  styleUrls: ['./gestione-promo.component.scss'],
  providers: [DatePipe]
})
export class GestionePromoComponent  implements OnInit {

    id: number | undefined;
    idAttivita:number | undefined;
    attivita: Attivita | undefined;
    orari: Orari | undefined;
    requestPromo!: InsertPromoReqDto;
    listaAttivita: Attivita[] | undefined;
    isPrincipale = false;
    isConfirmOpen: boolean = false;
    sessioneString!:UserSession | null;
    promo: Promo | undefined;
    listaTipologie: TipologiaOfferta[] = [];
    isLimitEnabled: boolean = false;
    isLoading : boolean | undefined;
    errTitolo:string | undefined;
    errPeriodo:string | undefined;
    errDescrizione:string | undefined;
    errGiorni:string | undefined;
    errOrari:string | undefined;
    errTipologia:string | undefined;
    errNumUtilizzi:string | undefined;
    isError: boolean = false;
    errNumUtilizziPersona:string | undefined;
    alertButtons = ['Chiudi'];
    errorList: string[] = [];

    isLoadingSalvataggio: boolean = false;
    @Input() modificaPromo!: Promo;
    @Output() openPageEvent = new EventEmitter<number>();
    @Output() openPageEventUpd = new EventEmitter<number>();
    
    giorni: GiorniSettimanaPromo | undefined;

    constructor(
      private promoService : GetApiPromoService,
      private authService : AuthService,
      private attivitaService: GetApiAttivitaService,
      public datePipe: DatePipe
    ) {}

    async ngOnInit(): Promise<void> {
      this.isLoading = true;
      this.requestPromo = new InsertPromoReqDto();
      this.requestPromo.days = [];
      this.idAttivita = 0;
      this.giorni = new GiorniSettimanaPromo();
      this.sessioneString = this.authService.getUserSessionFromCookie();
      this.attivita = undefined;
      if (this.sessioneString !== null) {
        if(this.sessioneString.idSoggetto !== null && this.sessioneString.idSoggetto !== undefined && this.sessioneString.idSoggetto > 0)
          this.id = this.sessioneString.idSoggetto;
      }

      if(this.modificaPromo != undefined && this.modificaPromo != null)
      {
        this.requestPromo.idPromo = this.modificaPromo.idPromo;
        this.requestPromo.idAttivita = this.modificaPromo.idAttivita;
        this.idAttivita = this.modificaPromo.idAttivita;
        if(this.modificaPromo.numCouponMax != undefined && this.modificaPromo.numCouponMax > 0){
          this.isLimitEnabled = true;
          this.requestPromo.numCouponMax = this.modificaPromo.numCouponMax;
        }
        if(this.modificaPromo.dataDal){
          this.requestPromo.dataDal = this.modificaPromo.dataDal;
        }
        if(this.modificaPromo.dataAl){
          this.requestPromo.dataAl = this.modificaPromo.dataAl;
        }
        if(this.modificaPromo.titoloPromo){
          this.requestPromo.titoloPromo = this.modificaPromo.titoloPromo;
        }
        if(this.modificaPromo.descPromo){
          this.requestPromo.descPromo = this.modificaPromo.descPromo;
        }
        if(this.modificaPromo.validDays){
          this.requestPromo.validDays = this.modificaPromo.validDays;
        }
        if(this.modificaPromo.isAllDayValidita){
          this.requestPromo.isAllDayValidita = this.modificaPromo.isAllDayValidita;
        }
        if(this.modificaPromo.days != undefined && this.modificaPromo.days.length > 0){
          this.giorni.days = this.modificaPromo.days;
          this.requestPromo.days = this.modificaPromo.days;
        }
        // if(this.modificaPromo.isAllDayValidita){
        //   this.requestPromo.isAllDayValidita = this.modificaPromo.isAllDayValidita;
        // }
        if(this.modificaPromo.orarioValiditaDa && this.modificaPromo.orarioValiditaAl){
          this.requestPromo.orarioValiditaDa = this.modificaPromo.orarioValiditaDa;
          this.requestPromo.orarioValiditaAl = this.modificaPromo.orarioValiditaAl;
        }
        if(this.modificaPromo.numCouponMax){
          this.requestPromo.numCouponMax = this.modificaPromo.numCouponMax;
        }
        if(this.modificaPromo.numUtilizziPerPersonaMax){
          this.requestPromo.numUtilizziPerPersonaMax = this.modificaPromo.numUtilizziPerPersonaMax;
        }
        if(this.modificaPromo.listaTipologie != undefined)
        {
          this.listaTipologie = this.modificaPromo.listaTipologie;
          this.requestPromo.listaTipologie = this.modificaPromo.listaTipologie;
        }
      }
      else if(!this.modificaPromo)
      {
        if (this.id) {
          await this.getListaAttivita(this.id);
        }
      }
      this.isLoading = false;
    }

  async prosegui(){
    await this.ControlPromo(this.requestPromo);
    if(this.isError)
      return;
    else
      this.isConfirmOpen = true;
  }

  async salva() {
    this.isConfirmOpen = false;
    await this.ControlPromo(this.requestPromo);
    if(this.isError)
      return;

    const sessioneString = this.authService.getUserSessionFromCookie();
  
    if (sessioneString !== null) {
      
      if (this.idAttivita) {
        this.requestPromo.idAttivita = this.idAttivita;
      }

      if(this.requestPromo.days && this.requestPromo.days.length > 0)
      {
        const sortedDays = this.requestPromo.days.sort((a, b) => a - b);
        this.requestPromo.validDays = sortedDays.join('-');
      }

      const dataDal = this.requestPromo.dataDal ? new Date(this.requestPromo.dataDal) : undefined;
      const dataAl = this.requestPromo.dataAl ? new Date(this.requestPromo.dataAl) : undefined;
          
      if (dataDal) {
        // Imposta le date in UTC
        this.requestPromo.dataDal = new Date(Date.UTC(dataDal.getFullYear(), dataDal.getMonth(), dataDal.getDate(), 0, 0, 0));
      }
      
      if (dataAl) {
        this.requestPromo.dataAl = new Date(Date.UTC(dataAl.getFullYear(), dataAl.getMonth(), dataAl.getDate(), 0, 0, 0));
      }

      this.promoService.apiInsertPromo(this.requestPromo).pipe(
        tap((response: any) => {
          this.openPage(7);
        }),
        catchError((error) => {
          console.error(error.error);
          return of(null);
        })
      ).subscribe();
    }
  }

  async modifica() {
    this.isConfirmOpen = false;
    await this.ControlPromo(this.requestPromo);
    if(this.isError)
      return;

    const sessioneString = this.authService.getUserSessionFromCookie();
  
    if (sessioneString !== null) {
      
      if (this.idAttivita) {
        this.requestPromo.idAttivita = this.idAttivita;
      }

      if(this.requestPromo.days && this.requestPromo.days.length > 0)
      {
        const sortedDays = this.requestPromo.days.sort((a, b) => a - b);
        this.requestPromo.validDays = sortedDays.join('-');
      }
      const dataDal = this.requestPromo.dataDal ? new Date(this.requestPromo.dataDal) : undefined;
      const dataAl = this.requestPromo.dataAl ? new Date(this.requestPromo.dataAl) : undefined;
      if (dataDal) {
        // Imposta le date in UTC
        this.requestPromo.dataDal = new Date(Date.UTC(dataDal.getFullYear(), dataDal.getMonth(), dataDal.getDate(), 0, 0, 0));
      }
      
      if (dataAl) {
        this.requestPromo.dataAl = new Date(Date.UTC(dataAl.getFullYear(), dataAl.getMonth(), dataAl.getDate(), 0, 0, 0));
      }
      
      const today = new Date().setHours(0, 0, 0, 0);
      const dataDalCheck = this.requestPromo.dataDal instanceof Date ? this.requestPromo.dataDal : undefined;
      const dataAlCheck = this.requestPromo.dataAl instanceof Date ? this.requestPromo.dataAl : undefined;
      if((dataDalCheck && dataDalCheck.setHours(0, 0, 0, 0) >= today) && (dataAlCheck && dataAlCheck.setHours(0,0,0,0) >= dataDalCheck.setHours(0, 0, 0, 0))){
        this.requestPromo.isAttiva = true;
      }
      else{
        this.requestPromo.isAttiva = false;
      }
      if (dataDal) {
        // Imposta le date in UTC
        this.requestPromo.dataDal = new Date(Date.UTC(dataDal.getFullYear(), dataDal.getMonth(), dataDal.getDate(), 0, 0, 0));
      }
      
      if (dataAl) {
        this.requestPromo.dataAl = new Date(Date.UTC(dataAl.getFullYear(), dataAl.getMonth(), dataAl.getDate(), 0, 0, 0));
      }
      this.promoService.apiUpdatePromo(this.requestPromo).pipe(
        tap((response: any) => {
          this.openPageEventUpd.emit(7);
        }),
        catchError((error) => {
          return throwError(() => error);
          console.error(error.error); 
          return of(null);
        })
      ).subscribe();
    }
  }

  
  handleDataDalChange(dataDal: moment.Moment) {
    this.requestPromo.dataDal = dataDal.toDate();
  }

  handleDataAlChange(dataAl: moment.Moment) {
    this.requestPromo.dataAl = dataAl.toDate();
  }

  handleTitoloChange(titolo: string) {
    this.requestPromo.titoloPromo = titolo;
  }

  handleDescChange(descrizione: string) {
    this.requestPromo.descPromo = descrizione;
  }

  handleAllSettimanaChange(isAllSettimana: boolean) {
    if (isAllSettimana) {
        if (!this.requestPromo.days) {
            this.requestPromo.days = []; 
        }
        if (!this.requestPromo.days.includes(0)) {
            this.requestPromo.days.push(0);
        }
    } 
    else {
        if (this.requestPromo.days && this.requestPromo.days.includes(0)) {
            this.rimuoviNumero(this.requestPromo.days, 0);
        }
    }
  }

  handleLunediChange(isLunedi: boolean) {
    if (isLunedi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(1)) {
          this.requestPromo.days.push(1);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(1)) {
          this.rimuoviNumero(this.requestPromo.days, 1);
      }
    }
  }

  handleMartediChange(isMartedi: boolean) {
    if (isMartedi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(2)) {
          this.requestPromo.days.push(2);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(2)) {
          this.rimuoviNumero(this.requestPromo.days, 2);
      }
    }
  }

  handleMercolediChange(isMercoledi: boolean) {
    if (isMercoledi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(3)) {
          this.requestPromo.days.push(3);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(3)) {
          this.rimuoviNumero(this.requestPromo.days, 3);
      }
    }
  }

  handleGiovediChange(isGiovedi: boolean) {
    if (isGiovedi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(4)) {
          this.requestPromo.days.push(4);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(4)) {
          this.rimuoviNumero(this.requestPromo.days, 4);
      }
    }
  }

  handleVenerdiChange(isVenerdi: boolean) {
    if (isVenerdi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(5)) {
          this.requestPromo.days.push(5);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(5)) {
          this.rimuoviNumero(this.requestPromo.days, 5);
      }
    }
  }

  handleSabatoChange(isSabato: boolean) {
    if (isSabato) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(6)) {
          this.requestPromo.days.push(6);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(6)) {
          this.rimuoviNumero(this.requestPromo.days, 6);
      }
    }
  }

  handleDomenicaChange(isDomenica: boolean) {
    if (isDomenica) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(7)) {
          this.requestPromo.days.push(7);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(7)) {
          this.rimuoviNumero(this.requestPromo.days, 7);
      }
    }
  }

  handleIsAllDayValiditaChange(isAllDay: boolean) {
    this.requestPromo.isAllDayValidita = isAllDay;
  }

  handleOrarioValiditaDaChange(orario: string) {
    this.requestPromo.orarioValiditaDa = orario;
  }

  handleorarioValiditaAlChange(orario: string) {
    this.requestPromo.orarioValiditaAl = orario;
  }

  handleListaTipologieChange(tipologie: TipologiaOfferta[]) {
    this.requestPromo.listaTipologie = tipologie;
  }

  handleNumMaxChange(num: number) {
    this.requestPromo.numCouponMax = num;
  }

  handleNumMaxPerPersonaChange(num: number) {
    this.requestPromo.numUtilizziPerPersonaMax = num;
  }

  async ControlPromo(promo: InsertPromoReqDto){
    this.errTitolo = '';
    this.errPeriodo = '';
    this.errDescrizione = '';
    this.errGiorni = '';
    this.errOrari = '';
    this.errTipologia = '';
    this.errNumUtilizzi = ''; 
    this.errNumUtilizziPersona = '';
    this.isError = false;
    const today = new Date().setHours(0, 0, 0, 0);
    const noSpecialCharsRegex = /^(?!.*(DROP|TABLE|INSERT|DELETE|UPDATE)).*[a-zA-Z0-9À-ÖØ-öø-ÿ.,()!?/@#& _-]*$/i;
    const onlyNumbersRegex = /^[0-9]+$/;

    //TITOLO
    if(!promo.titoloPromo || promo.titoloPromo == ''){
      this.errTitolo = 'Titolo obbligatorio'
      this.isError = true;
    }
    else if(promo.titoloPromo && promo.titoloPromo.length > 50){
      this.errTitolo = 'La lunghezza massima per il titolo è di 50 caratteri'
      this.isError = true;
    }
    else if(promo.titoloPromo && promo.titoloPromo.length < 5){
      this.errTitolo = 'La lunghezza minima per il titolo è di 5 caratteri'
      this.isError = true;
    }
    else if (!noSpecialCharsRegex.test(promo.titoloPromo)) {
      this.errTitolo = "Il titolo contiene caratteri non ammessi";
      this.isError = true;
    }
    else if (onlyNumbersRegex.test(promo.titoloPromo) && !/[a-zA-Z]/.test(promo.titoloPromo)) {
      this.errTitolo = 'Il titolo non può contenere solo numeri';
      this.isError = true;
    }

    //PERIODO
    if(promo.dataDal == undefined || promo.dataDal == null){
      this.errPeriodo = 'Inserire una data inizio validità'
      this.isError = true;
    }
    else if(promo.dataAl == undefined || promo.dataAl == null){
      this.errPeriodo = 'Inserire una data di fine validità'
      this.isError = true;
    }
    else{
      const dataDal = promo.dataDal instanceof Date ? promo.dataDal : new Date(promo.dataDal);
      const dataAl = promo.dataAl instanceof Date ? promo.dataAl : new Date(promo.dataAl);
      if(dataDal.setHours(0, 0, 0, 0) < today){
        this.errPeriodo = 'La data di inizio validità non può essere inferiore ad oggi'
        this.isError = true;
      }
      else if(dataAl.setHours(0, 0, 0, 0) < today){
        this.errPeriodo = 'La data di fine validità non può essere inferiore alla data di oggi'
        this.isError = true;
      }
      else if(dataAl.setHours(0, 0, 0, 0) < dataDal.setHours(0, 0, 0, 0)){
        this.errPeriodo = 'La data di fine validità non può essere inferiore alla data inizio'
        this.isError = true;
      }
    }
    
    //DESCRIZIONE
    if(!promo.descPromo || promo.descPromo == ''){
      this.errDescrizione = 'Inserire una breve descrizione';
      this.isError = true;
    }
    else if(promo.descPromo.length > 200){
      this.errDescrizione = 'La lunghezza massima per la descrizione è di 200 caratteri';
      this.isError = true;
    }
    else if(promo.descPromo.length < 5){
      this.errDescrizione = 'La lunghezza minima per la descrizione è di 5 caratteri'
      this.isError = true;
    }
    else if (!noSpecialCharsRegex.test(promo.descPromo)) {
      this.errDescrizione = "Il nome contiene caratteri non ammessi";
      this.isError = true;
    }
    else if (onlyNumbersRegex.test(promo.descPromo) && !/[a-zA-Z]/.test(promo.descPromo)) {
      this.errDescrizione = 'Il titolo non può contenere solo numeri';
      this.isError = true;
    }

    //GIORNI
    if(promo.days == undefined || promo.days == null || promo.days.length == 0){
        this.errGiorni = "Indicare i giorni della settimana";
        this.isError = true;
    }

    //ORARI
    if(!promo.isAllDayValidita && !promo.orarioValiditaDa && !promo.orarioValiditaAl){
       this.errOrari = "Indicare il periodo della giornata";
       this.isError = true;
    }
    else if(!promo.isAllDayValidita && (!promo.orarioValiditaAl && promo.orarioValiditaDa)){
         this.errOrari = "Indicare l'orario di inizio validità";
         this.isError = true;
    }
    else if(!promo.isAllDayValidita && (promo.orarioValiditaAl && !promo.orarioValiditaDa)){
          this.errOrari = "Indicare l'orario di fine validità";
          this.isError = true;
    }

    //TIPOLOGIE
    if(!promo.listaTipologie){
     this.errTipologia = "Indicare una o più tipologie di offerta";
     this.isError = true;
    }
    else if(promo.listaTipologie.length > 5){
      this.errTipologia = "È possibile inserire un massimo di 5 tipologie";
      this.isError = true;
    }

    //NUM COUPON MAX
    if(promo.numCouponMax !== null && promo.numCouponMax !== undefined && promo.numCouponMax < 1) {
      this.errNumUtilizzi = "Deve essere maggiore di 0";
      this.isError = true;
    }
    else if(promo.numCouponMax && promo.numCouponMax > 9999){
      this.errNumUtilizzi = "Non è possibile inserire oltre 9999 coupon massimi";
      this.isError = true;
     }

    //NUM COUPON MAX PER PERSONA
    if(promo.numUtilizziPerPersonaMax !== null && promo.numUtilizziPerPersonaMax !== undefined && promo.numUtilizziPerPersonaMax < 1){
      this.errNumUtilizziPersona = "Deve essere maggiore di 0";
      this.isError = true;
     }
    else if(promo.numUtilizziPerPersonaMax && promo.numUtilizziPerPersonaMax > 9999){
      this.errNumUtilizziPersona = "Non è possibile inserire oltre 9999 coupon massimi per persona";
      this.isError = true;
     }
  }

  rimuoviNumero(array: number[], numero: number): void {
    const indice: number = array.indexOf(numero);
    if (indice !== -1) {
        array.splice(indice, 1);
    }
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }

  async getListaAttivita(idSoggetto: number) {
    try {
      const data = await lastValueFrom(this.attivitaService.apiGetAttivitaByIdSoggetto(idSoggetto));
      if (data) {
        this.listaAttivita = data;
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
  }

  addPromo(attivita: Attivita){
    if(attivita)
    {
      this.requestPromo = new InsertPromoReqDto()  
      this.attivita = attivita;
      this.idAttivita = this.attivita?.idAttivita;
    }
  }

  dismissConferma(){
    this.isConfirmOpen = false;
  }

  getErrorMessage(): string {
    const errorList: string[] = [];
  
    if (this.errTitolo) {
      errorList.push(`• ${this.errTitolo}`);
    }
    if (this.errDescrizione) {
      errorList.push(`• ${this.errDescrizione}`);
    }
    if (this.errPeriodo) {
      errorList.push(`• ${this.errPeriodo}`);
    }
    if (this.errGiorni) {
      errorList.push(`• ${this.errGiorni}`);
    }
    if (this.errOrari) {
      errorList.push(`• ${this.errOrari}`);
    }
    if (this.errTipologia) {
      errorList.push(`• ${this.errTipologia}`);
    }
    if (this.errNumUtilizzi) {
      errorList.push(`• ${this.errNumUtilizzi}`);
    }
    if (this.errNumUtilizziPersona) {
      errorList.push(`• ${this.errNumUtilizziPersona}`);
    }
  
    // Costruisci un elenco HTML
    return `<ul>${errorList.map(error => `<li>${error}</li>`).join('')}</ul>`;
  }  
}
