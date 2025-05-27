import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { InsertPromoReqDto, Promo, TipologiaOfferta } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

@Component({
  selector: 'app-form-promo',
  templateUrl: './form-promo.component.html',
  styleUrls: ['./form-promo.component.scss'],
  providers: [DatePipe]
})
export class FormPromoComponent  implements OnInit {

  @Input() modificaPromo: Promo | null | undefined;
  @Input() idAttivita: number | undefined;
  @Output() closeModal = new EventEmitter<void>();
  @Output() closeModalAndRefresh = new EventEmitter<void>();
  @Output() closeModalAndGoToPage = new EventEmitter<{ idPage: number, idAttivita: number }>();
  isSaved: boolean = false;
  isEsito: boolean = false;
  isConfirmOpen: boolean = false;
  isLoading : boolean = false;
  isLoadingSalvataggio : boolean = false;
  isLimitEnabled: boolean = false;
  isLimitEnabledPerson: boolean = false;
  isOpenAlert: boolean = false;
  errorMessage:string | undefined;
  requestPromo!: InsertPromoReqDto;
  isCheckboxChecked : boolean = false;
  isError: boolean = false;
  isEsitoOk: boolean = false;
  id: number | undefined;
  listaTipologie: TipologiaOfferta[] = [];
  segmentValue: string = 'one';
  segmentSteps = ['one', 'two', 'three', 'four', 'five'];
  daysOfWeek = [
        { value: 1, label: 'MONDAY' },
        { value: 2, label: 'TUESDAY' },
        { value: 3, label: 'WEDNESDAY' },
        { value: 4, label: 'THURSDAY' },
        { value: 5, label: 'FRIDAY' },
        { value: 6, label: 'SATURDAY' },
        { value: 7, label: 'SUNDAY' },
      ];
  
  constructor(
        private promoService : GetApiPromoService,
        private authService : AuthService,
        private attivitaService: GetApiAttivitaService,
        public datePipe: DatePipe,
        private translate: TranslateService,
        private localStorage: StorageService,
        private alertController: AlertController
      ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit() {
    this.isLoading = true;
    this.requestPromo = new InsertPromoReqDto();
    await this.PrevalorizzaReqPromo();
    this.isLoading = false;
  }

  onModalDismiss() {
    this.closeModal.emit();
  }

  onModalDismissWithRefresh() {
    if(this.isSaved){
      this.closeModalAndGoToPage.emit({ idPage: 7, idAttivita: this.idAttivita! });
    }
    else{
      this.closeModalAndRefresh.emit();
    }
  }

  avanti() {
    const currentIndex = this.segmentSteps.indexOf(this.segmentValue);
    if (currentIndex < this.segmentSteps.length - 1) {
      this.segmentValue = this.segmentSteps[currentIndex + 1];
    }
  }
  
  indietro() {
    const currentIndex = this.segmentSteps.indexOf(this.segmentValue);
    if (currentIndex > 0) {
      this.segmentValue = this.segmentSteps[currentIndex - 1];
    }
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Err',
      message: this.errorMessage,
      buttons: ['OK'],
      mode: 'ios'
    });
  
    await alert.present();
  }

  async prosegui(isSalvataggio: boolean) {
    this.isLoading = true;
    await this.ControlPromo(this.requestPromo);
    if(this.isError){
      this.presentErrorAlert();
    }
    else{
      this.isSaved = isSalvataggio;
      this.isConfirmOpen = true;
    }
    this.isLoading = false;
  }

  async salva() {
      this.isLoading = true;
      await this.ControlPromo(this.requestPromo);

      if(this.isError)
        return;
  
      const sessioneString = this.authService.getUserSession();

      this.setEsito(true)
    
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

        await this.localStorage.removeItem(`attivita_promo`);

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

        if(this.isSaved){
          try {
            await this.promoService.apiInsertPromo(this.requestPromo);
            this.setEsito(true);
          } catch (error: any) {
            this.setEsito(false);
            this.isLoading = false;
          }
        }
        else{
          try {
            await this.promoService.apiUpdatePromo(this.requestPromo);
            this.setEsito(true);
          } catch (error: any) {
            this.setEsito(false);
            this.isLoading = false;
          }
        }
      }
      else{
        this.setEsito(false);
      }
    this.isLoading = false;
  }

  setEsito(isOk: boolean){
    this.isEsito = true;
    this.isEsitoOk = isOk;
  }

  onCheckboxChange(event: any) {
    const isChecked = event.detail.checked;
    this.isCheckboxChecked = isChecked;
  }

  async PrevalorizzaReqPromo(){
    if(this.idAttivita)
      this.requestPromo.idAttivita = this.idAttivita;
    
    if(this.modificaPromo != undefined && this.modificaPromo != null){
      this.requestPromo.idPromo = this.modificaPromo.idPromo;
      this.requestPromo.idAttivita = this.modificaPromo.idAttivita;
      this.idAttivita = this.modificaPromo.idAttivita;
      if(this.modificaPromo.numCouponMax != undefined && this.modificaPromo.numCouponMax > 0){
        this.isLimitEnabled = true;
        this.requestPromo.numCouponMax = this.modificaPromo.numCouponMax;
      }
      if(this.modificaPromo.numUtilizziPerPersonaMax != undefined && this.modificaPromo.numUtilizziPerPersonaMax > 0){
        this.isLimitEnabledPerson = true;
        this.requestPromo.numUtilizziPerPersonaMax = this.modificaPromo.numUtilizziPerPersonaMax;
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
        if (this.requestPromo.days) {
          this.requestPromo.days = this.modificaPromo.days;
        }
        this.requestPromo.days = this.modificaPromo.days;
      }
      if(this.modificaPromo.orarioValiditaDa && this.modificaPromo.orarioValiditaAl){
        this.requestPromo.orarioValiditaDa = this.modificaPromo.orarioValiditaDa;
        this.requestPromo.orarioValiditaAl = this.modificaPromo.orarioValiditaAl;
      }
      if(this.modificaPromo.listaTipologie != undefined)
      {
        this.listaTipologie = this.modificaPromo.listaTipologie;
        this.requestPromo.listaTipologie = this.modificaPromo.listaTipologie;
      }
      if(this.modificaPromo.descTipoConsumazione != undefined && this.modificaPromo.descTipoConsumazione != '')
      {
        this.requestPromo.descTipoConsumazione = this.modificaPromo.descTipoConsumazione;
      }
      if(this.modificaPromo.descrizioniPeriodi != undefined && this.modificaPromo.descrizioniPeriodi != '')
      {
        this.requestPromo.descrizioniPeriodi = this.modificaPromo.descrizioniPeriodi;
      }
      if(this.modificaPromo.periodo != undefined && this.modificaPromo.periodo != '')
      {
        this.requestPromo.periodo = this.modificaPromo.periodo;
      }
      if(this.modificaPromo.codTipoConsumazione != undefined && this.modificaPromo.codTipoConsumazione > 0)
      {
        this.requestPromo.codTipoConsumazione = this.modificaPromo.codTipoConsumazione;
      }
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

  handleFoodDrinkChange(isFoodDrink: boolean) {
    if (isFoodDrink) {
          this.requestPromo.codTipoConsumazione = 3; 
    }
  }

  handleFoodChange(isFood: boolean) {
    if (isFood) {
          this.requestPromo.codTipoConsumazione = 1; 
    }
  }

  handleDrinkChange(isDrink: boolean) {
    if (isDrink) {
          this.requestPromo.codTipoConsumazione = 2; 
    }
  }

  handleAnyTimeChange(isAnyTime: boolean) {
    if (isAnyTime) {
        if (!this.requestPromo.periodo?.includes('8')) {
        this.aggiungiPeriodo('8');
      }
    } else {
      this.rimuoviPeriodo('8');
    }
  }

  handleLateNightChange(isLateNight: boolean) {
    if (isLateNight) {
      if (!this.requestPromo.periodo?.includes('7')) {
        this.aggiungiPeriodo('7');
      }
    } else {
      this.rimuoviPeriodo('7');
    }
  }

  handleDinnerChange(isDinner: boolean) {
    if (isDinner) {
      if (!this.requestPromo.periodo?.includes('6')) {
        this.aggiungiPeriodo('6');
      }
    } else {
      this.rimuoviPeriodo('6');
    }
  }

  handleHappyHourChange(isHappyHour: boolean) {
    if (isHappyHour) {
      if (!this.requestPromo.periodo?.includes('5')) {
        this.aggiungiPeriodo('5');
      }
    } else {
      this.rimuoviPeriodo('5');
    }
  }

  handleAfternoonTeaChange(isAfternoonTea: boolean) {
    if (isAfternoonTea) {
      if (!this.requestPromo.periodo?.includes('4')) {
        this.aggiungiPeriodo('4');
      }
    } else {
      this.rimuoviPeriodo('4');
    }
  }

  handleLunchChange(isLunch: boolean) {
    if (isLunch) {
      if (!this.requestPromo.periodo?.includes('3')) {
        this.aggiungiPeriodo('3');
      }
    } else {
      this.rimuoviPeriodo('3');
    }
  }

  handleBrunchChange(isBrunch: boolean) {
    if (isBrunch) {
      if (!this.requestPromo.periodo?.includes('2')) {
        this.aggiungiPeriodo('2');
      }
    } else {
      this.rimuoviPeriodo('2');
    }
  }

  handleBreakfastChange(isBreakfast: boolean) {
    if (isBreakfast) {
      if (!this.requestPromo.periodo?.includes('1')) {
        this.aggiungiPeriodo('1');
      }
    } else {
      this.rimuoviPeriodo('1');
    }
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
    this.errorMessage = '';
    this.isError = false;
    const today = new Date().setHours(0, 0, 0, 0);
    const noSpecialCharsRegex = /^(?!.*\b(DROP|TABLE|INSERT|DELETE|UPDATE|SELECT|SCRIPT|IFRAME|ONERROR|ONLOAD)\b)(?!.*[<>]).{1,200}$/i;
    const onlyNumbersRegex = /^[0-9]+$/;

    //TITOLO
    if(!promo.titoloPromo || promo.titoloPromo == ''){
      this.translate.get('ERRORS.TITLE_REQUIRED').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if(promo.titoloPromo && promo.titoloPromo.length > 50){
      this.translate.get('ERRORS.TITLE_MAX_LENGTH').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if(promo.titoloPromo && promo.titoloPromo.length < 5){
      this.translate.get('ERRORS.TITLE_MIN_LENGTH').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if (!noSpecialCharsRegex.test(promo.titoloPromo)) {
      this.translate.get('ERRORS.TITLE_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if (onlyNumbersRegex.test(promo.titoloPromo) && !/[a-zA-Z]/.test(promo.titoloPromo)) {
      this.translate.get('ERRORS.TITLE_NOT_ONLY_NUMBERS').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }

    //PERIODO
    if(promo.dataDal == undefined || promo.dataDal == null){
      this.translate.get('ERRORS.START_DATE_REQUIRED').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if(promo.dataAl == undefined || promo.dataAl == null){
      this.translate.get('ERRORS.END_DATE_REQUIRED').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else{
      const dataDal = promo.dataDal instanceof Date ? promo.dataDal : new Date(promo.dataDal);
      const dataAl = promo.dataAl instanceof Date ? promo.dataAl : new Date(promo.dataAl);
      if(dataDal.setHours(0, 0, 0, 0) < today){
        this.translate.get('ERRORS.START_DATE_LESS_TODAY').subscribe((translatedText: string) => {
          this.errorMessage = translatedText;
          this.isError = true;
          return;
        });
      }
      else if(dataAl.setHours(0, 0, 0, 0) < today){
        this.translate.get('ERRORS.END_DATE_LESS_TODAY').subscribe((translatedText: string) => {
          this.errorMessage = translatedText;
          this.isError = true;
          return;
        });
      }
      else if(dataAl.setHours(0, 0, 0, 0) < dataDal.setHours(0, 0, 0, 0)){
        this.translate.get('ERRORS.END_DATE_LESS_START').subscribe((translatedText: string) => {
          this.errorMessage = translatedText;
          this.isError = true;
          return;
        });
      }
    }
    
    //DESCRIZIONE
    if(!promo.descPromo || promo.descPromo == ''){
      this.translate.get('ERRORS.DESCRIPTION_REQUIRED').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if(promo.descPromo.length > 150){
      this.translate.get('ERRORS.DESCRIPTION_MAX_LENGTH_150').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if(promo.descPromo.length < 5){
      this.translate.get('ERRORS.DESCRIPTION_MIN_LENGTH_5').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if (!noSpecialCharsRegex.test(promo.descPromo)) {
      this.translate.get('ERRORS.DESCR_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if (onlyNumbersRegex.test(promo.descPromo) && !/[a-zA-Z]/.test(promo.descPromo)) {
      this.translate.get('ERRORS.DESCRIPTION_NOT_ONLY_NUMBERS').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }

    //GIORNI
    if(promo.days == undefined || promo.days == null || promo.days.length == 0){
        this.translate.get('ERRORS.DAYS_OF_WEEK').subscribe((translatedText: string) => {
          this.errorMessage = translatedText;
          this.isError = true;
          return;
        });
    }

    //ORARI
    if(!promo.isAllDayValidita && !promo.orarioValiditaDa && !promo.orarioValiditaAl){
       this.translate.get('ERRORS.TIME_OF_DAY').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if(!promo.isAllDayValidita && (!promo.orarioValiditaAl && promo.orarioValiditaDa)){
         this.translate.get('ERRORS.START_TIME_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessage = translatedText;
          this.isError = true;
          return;
        });
    }
    else if(!promo.isAllDayValidita && (promo.orarioValiditaAl && !promo.orarioValiditaDa)){
          this.translate.get('ERRORS.END_TIME_REQUIRED').subscribe((translatedText: string) => {
            this.errorMessage = translatedText;
            this.isError = true;
            return;
          });
    }

    //TIPOLOGIE
    if(!promo.listaTipologie || promo.listaTipologie.length == 0){
     this.translate.get('ERRORS.TYPES_OF_OFFER_REQUIRED').subscribe((translatedText: string) => {
      this.errorMessage = translatedText;
      this.isError = true;
      return;
    });
    }
    else if(promo.listaTipologie.length > 5){
      this.translate.get('ERRORS.MAXIMUM_TYPES').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }

    //NUM COUPON MAX
    if(promo.numCouponMax !== null && promo.numCouponMax !== undefined && promo.numCouponMax < 1) {
      this.translate.get('ERRORS.MUST_GREATER_0').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
    }
    else if(promo.numCouponMax && promo.numCouponMax > 9999){
      this.translate.get('ERRORS.MAX_COUPONS_9999').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
     }

    //NUM COUPON MAX PER PERSONA
    if(promo.numUtilizziPerPersonaMax !== null && promo.numUtilizziPerPersonaMax !== undefined && promo.numUtilizziPerPersonaMax < 1){
      this.translate.get('ERRORS.MUST_GREATER_0').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
     }
    else if(promo.numUtilizziPerPersonaMax && promo.numUtilizziPerPersonaMax > 9999){
      this.translate.get('ERRORS.MAX_COUPONS_9999_PER_PERSON').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
     }

     //PERIODO DELLA GIORNATA(COLAZIONE, PRANZO ECC...)
     if(!promo.periodo || promo.periodo == ''){
      this.translate.get('PERIODTYPEREQUIRED').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
     }
     if(promo.periodo){
        const periodiSelezionati = promo.periodo.split(',').filter(p => p.trim() !== '');
      if (periodiSelezionati.length > 3) {
        this.translate.get('MAXPERIODS').subscribe((translatedText: string) => {
          this.errorMessage = translatedText;
          this.isError = true;
          return;
        });
        return;
      }
     }
    if((promo.codTipoConsumazione && promo.codTipoConsumazione == 0) || !promo.codTipoConsumazione){
      this.translate.get('ERRORS.TYPEPROMOFOODORDRINK').subscribe((translatedText: string) => {
        this.errorMessage = translatedText;
        this.isError = true;
        return;
      });
     }
  }

  rimuoviNumero(array: number[], numero: number): void {
    const indice: number = array.indexOf(numero);
    if (indice !== -1) {
        array.splice(indice, 1);
    }
  }

  rimuoviPeriodo(periodo: string): void {
    if (this.requestPromo.periodo && this.requestPromo.periodo !== '') {
      const periodi = this.requestPromo.periodo
        .split(',')
        .map(p => p.trim())
        .filter(p => p !== periodo); // rimuove quello selezionato

      this.requestPromo.periodo = periodi.join(',');
    }
  }

  aggiungiPeriodo(periodo: string): void {
    const lista = this.requestPromo.periodo?.split(',').filter(p => p) || [];

    if (!lista.includes(periodo)) {
      lista.push(periodo);
      this.requestPromo.periodo = lista.join(',');
    }
  }

}
