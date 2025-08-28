import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, AttivitaRicerca, Immagini, InsertAttivitaReqDto, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { TranslateService } from '@ngx-translate/core';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

@Component({
  selector: 'app-form-riepilogo',
  templateUrl: './form-riepilogo.component.html',
  styleUrls: ['./form-riepilogo.component.scss'],
})
export class FormRiepilogoComponent  implements OnInit {
  
  @Input() attivita! : Attivita;
  @Input() listaComuni : Comuni[] | undefined;
  @Input() listaAttivitaDDL: TipoAttivita[] | undefined;
  @Output() backEvent = new EventEmitter<void>();
  isLoadIMG: boolean = false;
  errorMessages: string | undefined;
  essioneString:UserSession | null | undefined;
  attivitaForImg! : Attivita;
  segmentValue: string = 'one';
  segmentSteps = ['one', 'two', 'three', 'four'];
  listaAttivitaSelezionate: TipoAttivita[] | undefined;
  listaTipoAttivita: TipoAttivita[] = [];
  IsModified: boolean = false;
  IsModifiedName: boolean = false;
  IsModifiedPhone: boolean = false;
  IsModifiedMail: boolean = false;
  IsModifiedCitta: boolean = false;
  IsModifiedDesc: boolean = false;
  IsModifiedOrari: boolean = false;
  IsConfirmed: boolean = false;
  isCheckboxChecked: boolean = false;
  isOpenAlert: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;
  typeConfirmModal: string | undefined;
  requestAttivita: InsertAttivitaReqDto | undefined;

  constructor(private attivitaService: GetApiAttivitaService,
              private translate: TranslateService,
              private alertController: AlertController) { }

  async ngOnInit() {
    if(this.attivita && this.attivita.placeId && !this.attivita.idAttivita){
      this.isLoadIMG = true;
      const data = await this.attivitaService.apiGetAttivitaAutocomplete(this.attivita.placeId);
      if (data) {
          this.attivitaForImg = data;
          if(this.attivitaForImg){
            this.attivita.immagini = this.attivitaForImg.immagini;
            this.attivita.listaTipoAttivita = this.attivitaForImg.listaTipoAttivita;
            this.listaAttivitaSelezionate = this.attivita.listaTipoAttivita;
          }
      }
      this.isLoadIMG = false;
    }
    else if(this.attivita && this.attivita.idAttivita){
      this.listaAttivitaSelezionate = this.attivita.listaTipoAttivita;

      if(this.attivita.isVerificata && !this.attivita.esitoVerifica){
        await this.presentMotivoAlert();
      }

    }
  }

  async setChecked(check: boolean){
    this.isCheckboxChecked = check;
  }
  
  returnList(){
    this.backEvent.emit();
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

  modifica(type:number){
    this.IsModified =true;
    this.IsModifiedName = type === 1;
    this.IsModifiedPhone = type === 2;
    this.IsModifiedMail = type === 3;
    this.IsModifiedCitta = type === 4;
    this.IsModifiedDesc = type ===5;
    this.IsModifiedOrari = type === 6;
  }

  chiudi(){
    this.IsModified = false;
    this.IsModifiedName = false;
    this.IsModifiedPhone = false;
    this.IsModifiedMail = false;
    this.IsModifiedCitta = false;
    this.IsModifiedDesc = false;
  }

  closeConfirmModal(){
    this.IsConfirmed = false;
    this.typeConfirmModal = undefined;
  }

  OpenModal(type: string){
    this.typeConfirmModal = type;
    this.IsConfirmed = true;
  }

  async ControlPreSave( isSaved: boolean){
    this.isLoading = true;
    await this.InitRequestAtt();
    await this.controlValidator(this.requestAttivita);
    if(this.isError){
      this.isLoading = false;
      this.presentErrorAlert();
      this.isOpenAlert = true;
    }
    else{
      if(isSaved){
        this.OpenModal("Save");
      }
      else{
        this.OpenModal("Edit");
      }
      this.isLoading = false;
      this.isOpenAlert = false;
    }
  }

  async DeleteAttivita() {
    this.OpenModal("Delete");
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Err',
      message: this.errorMessages,
      buttons: ['OK'],
      mode: 'ios'
    });
  
    await alert.present();
  }

  async presentMotivoAlert() {
    const alert = await this.alertController.create({
      header: 'Attenzione',
      message: this.attivita.motivo,
      buttons: ['OK'],
      mode: 'ios'
    });
  
    await alert.present();
  }

  getImmaginePrincipale(): string {
    const immaginePrincipale = this.attivita?.immagini?.find(i => i.isImmaginePrincipale);
    return immaginePrincipale ? immaginePrincipale.upload : 'default-image.jpg';
  }

  getGallery(): any[] {
    if (!this.attivita?.immagini) {
        return [];
    }
    const immaginePrincipale = this.attivita.immagini.find(i => i.isImmaginePrincipale);
    return this.attivita.immagini.filter(i => i !== immaginePrincipale);
  }

  handleNomeChange(nome: string) {
    if(this.attivita){
      this.attivita.nome = nome;
    }
  }

  handleTelefonoChange(newTelefono: string) {
    if(this.attivita)
      this.attivita.telefono = newTelefono;
  }

  handleEmailChange(newMail: string) {
    if(this.attivita)
      this.attivita.email = newMail;
  }

  handleIndirizzoChange(newindirizzo: string) {
    if(this.attivita)
      this.attivita.indirizzo = newindirizzo;
  }

  handleCivicoChange(newCivico: string) {
    if(this.attivita)
      this.attivita.civico = newCivico;
  }

  handleCapChange(newCap: string) {
    if(this.attivita)
      this.attivita.cap = newCap;
  }

  handleCittaChange(newCitta: Comuni) {
    if(this.attivita)
    {
      this.attivita.citta = newCitta.descComune;
      this.attivita.provincia = newCitta.provincia;
    }
  }

  handleDescChange(descrizione: string) {
    if(this.attivita)
      this.attivita.description = descrizione;
  }

  handleImmaginiChange(immagini: Immagini[]) {
      if(this.attivita)
        this.attivita.immagini = immagini;
  }

  handleListaTipoAttivitaChange(attivita: TipoAttivita[]) {
    this.listaTipoAttivita = attivita.map((attivitaSelezionate: TipoAttivita) => ({
    codTipoAttivita: attivitaSelezionate.codTipoAttivita,
    descrizione: attivitaSelezionate.descrizione
  }));
  if(this.attivita){
    this.attivita.listaTipoAttivita = this.listaTipoAttivita;
    this.listaAttivitaSelezionate = this.listaTipoAttivita;
    }
  }

  handleIsOffertaVeganaChange(isVegano: boolean) {
    if(this.attivita)
      this.attivita.isOffertaVegana = isVegano;
  }
  
  handleIsOffertaVegetarianaChange(isVegetariano: boolean) {
    if(this.attivita)
      this.attivita.isOffertaVegetariana = isVegetariano;
  }
  
  handleIsOffertaNoGlutineChange(isNoGlutine: boolean) {
    if(this.attivita)
      this.attivita.isOffertaNoGlutine = isNoGlutine;
  }

  handleOrariChange(newOrari: Orari) {
    if(this.attivita.orari){
      this.attivita.orari.lunediMatDa = JSON.parse(JSON.stringify(newOrari.lunediMatDa));
      this.attivita.orari.lunediMatAl = JSON.parse(JSON.stringify(newOrari.lunediMatAl));
      this.attivita.orari.lunediPomDa = JSON.parse(JSON.stringify(newOrari.lunediPomDa));
      this.attivita.orari.lunediPomAl = JSON.parse(JSON.stringify(newOrari.lunediPomAl));
      this.attivita.orari.martediMatDa = JSON.parse(JSON.stringify(newOrari.martediMatDa));
      this.attivita.orari.martediMatAl = JSON.parse(JSON.stringify(newOrari.martediMatAl));
      this.attivita.orari.martediPomDa = JSON.parse(JSON.stringify(newOrari.martediPomDa));
      this.attivita.orari.martediPomAl = JSON.parse(JSON.stringify(newOrari.martediPomAl));
      this.attivita.orari.mercolediMatDa = JSON.parse(JSON.stringify(newOrari.mercolediMatDa));
      this.attivita.orari.mercolediMatAl = JSON.parse(JSON.stringify(newOrari.mercolediMatAl));
      this.attivita.orari.mercolediPomDa = JSON.parse(JSON.stringify(newOrari.mercolediPomDa));
      this.attivita.orari.mercolediPomAl = JSON.parse(JSON.stringify(newOrari.mercolediPomAl));
      this.attivita.orari.giovediMatDa = JSON.parse(JSON.stringify(newOrari.giovediMatDa));
      this.attivita.orari.giovediMatAl = JSON.parse(JSON.stringify(newOrari.giovediMatAl));
      this.attivita.orari.giovediPomDa = JSON.parse(JSON.stringify(newOrari.giovediPomDa));
      this.attivita.orari.giovediPomAl = JSON.parse(JSON.stringify(newOrari.giovediPomAl));
      this.attivita.orari.venerdiMatDa = JSON.parse(JSON.stringify(newOrari.venerdiMatDa));
      this.attivita.orari.venerdiMatAl = JSON.parse(JSON.stringify(newOrari.venerdiMatAl));
      this.attivita.orari.venerdiPomDa = JSON.parse(JSON.stringify(newOrari.venerdiPomDa));
      this.attivita.orari.venerdiPomAl = JSON.parse(JSON.stringify(newOrari.venerdiPomAl));
      this.attivita.orari.sabatoMatDa = JSON.parse(JSON.stringify(newOrari.sabatoMatDa));
      this.attivita.orari.sabatoMatAl = JSON.parse(JSON.stringify(newOrari.sabatoMatAl));
      this.attivita.orari.sabatoPomDa = JSON.parse(JSON.stringify(newOrari.sabatoPomDa));
      this.attivita.orari.sabatoPomAl = JSON.parse(JSON.stringify(newOrari.sabatoPomAl));
      this.attivita.orari.domenicaMatDa = JSON.parse(JSON.stringify(newOrari.domenicaMatDa));
      this.attivita.orari.domenicaMatAl = JSON.parse(JSON.stringify(newOrari.domenicaMatAl));
      this.attivita.orari.domenicaPomDa = JSON.parse(JSON.stringify(newOrari.domenicaPomDa));
      this.attivita.orari.domenicaPomAl = JSON.parse(JSON.stringify(newOrari.domenicaPomAl));
      
      if(this.requestAttivita && this.requestAttivita.orari)
        this.requestAttivita.orari = this.attivita.orari;
    }
  }

  async InitRequestAtt() {
      this.requestAttivita = new InsertAttivitaReqDto(
        this.attivita?.idAttivita? this.attivita.idAttivita : 0,
        this.attivita?.idSoggetto? this.attivita.idSoggetto : 0,
        this.attivita?.nome? this.attivita.nome : "",
        this.attivita?.indirizzo? this.attivita.indirizzo : "",
        this.attivita?.citta? this.attivita.citta.toUpperCase() : "",
        this.attivita?.provincia? this.attivita.provincia : "",
        this.attivita?.civico? this.attivita.civico : "",
        this.attivita?.cap? this.attivita.cap : "",
        this.attivita?.telefono? this.attivita.telefono : "",
        this.attivita?.email? this.attivita.email : "",
        this.attivita?.description? this.attivita.description : "",
        this.attivita?.isPromoPresente? this.attivita.isPromoPresente : false,
        this.attivita?.isOffertaVegetariana? this.attivita.isOffertaVegetariana : false,
        this.attivita?.isOffertaVegana? this.attivita.isOffertaVegana : false,
        this.attivita?.isOffertaNoGlutine? this.attivita.isOffertaNoGlutine : false,
        this.attivita?.listaTipoAttivita? this.attivita.listaTipoAttivita : [],
        this.attivita?.orari? this.attivita.orari : new Orari(),
        this.attivita?.immagini? this.attivita.immagini : [],
        this.attivita?.isVerificata? this.attivita.isVerificata : false,
        this.attivita?.esitoVerifica? this.attivita.esitoVerifica : false,
        this.attivita?.rating? this.attivita.rating : 0,
        this.attivita?.numberOfRating? this.attivita.numberOfRating : 0,
        this.attivita?.placeId? this.attivita.placeId : "")
  }

  async controlValidator(request: InsertAttivitaReqDto | undefined){
      this.errorMessages = "";
      this.isError = false;
      const telefonoPattern = /^[0-9()+ -]*$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const noSpecialCharsRegex = /^(?!.*(DROP|TABLE|INSERT|DELETE|UPDATE)).*[a-zA-Z0-9À-ÖØ-öø-ÿ.,()!?/@#& _-]*$/i;
      const noSpecialCharsRegexCitta = /^[a-zA-Z0-9 _-]*$/;
      if(request)
      {
      //CONTROLLO NOME//
      if(request.nome == undefined || request.nome == "" || request.nome == null){
        this.translate.get('ERRORS.ACTIVITY_NAME_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if(request.nome.length < 2){
        this.translate.get('ERRORS.MINIMUM_LENGTH_2').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if(request.nome.length > 50){
        this.translate.get('ERRORS.MAX_LENGTH_50').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if (!noSpecialCharsRegex.test(request.nome)) {
        this.translate.get('ERRORS.NAME_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO TELEFONO//
      if(request.telefono == undefined || request.telefono == "" || request.telefono == null){
        this.translate.get('ERRORS.PHONE_NUMBER_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if(!telefonoPattern.test(request.telefono)){
        this.translate.get('ERRORS.INVALID_FORMAT').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
     
      //CONTROLLO TIPO ATTIVITA//
      if(request.listaTipoAttivita == undefined || request.listaTipoAttivita.length == 0 || request.listaTipoAttivita == null){
        this.translate.get('ERRORS.LEAST_ONE_TYPE').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO CITTA'//
      if(request.citta == undefined || request.citta == "" || request.citta == null){
        this.translate.get('ERRORS.CITY_OR_MUNICIPALITY').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if(this.listaComuni && !this.listaComuni.some(comune => comune.descComune === request.citta)){
        this.translate.get('ERRORS.VALID_MUNICIPALITY').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if (!noSpecialCharsRegexCitta.test(request.citta)) {
        this.translate.get('ERRORS.MUNICIPALITY_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO EMAIL//
      if(request.email == undefined || request.email == "" || request.email == null){
        this.translate.get('ERRORS.MAIL_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if (!emailRegex.test(request.email)) {
        this.translate.get('ERRORS.VALID_EMAIL').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO INDIRIZZO//
      if(request.indirizzo == undefined || request.indirizzo == "" || request.indirizzo == null){
        this.translate.get('ERRORS.ADDRESS_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO CIVICO//
      if(request.civico == undefined || request.civico == "" || request.civico == null){
        this.translate.get('ERRORS.CIVIC_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO CAP//
      if(request.cap == undefined || request.cap == "" || request.cap == null){
        this.translate.get('ERRORS.ZIP_CODE_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO ORARI//
      this.controlOrari(request);
  
      //CONTROLLO IMMAGINI//
      if(request.immagini == undefined || request.immagini.length == 0 || request.immagini == null){
        this.translate.get('ERRORS.ONE_OR_MORE_IMAGES').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      if(!request.immagini.find(i => i.isImmaginePrincipale)){
        this.translate.get('ERRORS.PROFILE_IMAGE_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
  
      //CONTROLLO DESCRIZIONE//
      if(request.description == undefined || request.description == "" || request.description == null){
        this.translate.get('ERRORS.DESCR_ACTIVITY_REQUIRED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if(request.description.length < 50){
        this.translate.get('ERRORS.MINIMUM_LENGTH_DESC_50').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if(request.description.length > 2000){
        this.translate.get('ERRORS.MAX_LENGTH_DESC_2000').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      else if (!noSpecialCharsRegex.test(request.description)) {
        this.translate.get('ERRORS.DESCR_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
      }
  }

  async controlOrari (request: InsertAttivitaReqDto) {
    //CONTROLLO ORARI//
    if(request.orari == undefined || 
       !request.orari.lunediMatDa && !request.orari.lunediMatAl &&
       !request.orari.lunediPomDa && !request.orari.lunediPomAl &&
       !request.orari.martediMatDa && !request.orari.martediMatAl &&  
       !request.orari.martediPomDa && !request.orari.martediPomAl && 
       !request.orari.mercolediMatDa && !request.orari.mercolediMatAl &&
       !request.orari.mercolediPomDa && !request.orari.mercolediPomAl &&
       !request.orari.giovediMatDa && !request.orari.giovediMatAl &&
       !request.orari.giovediPomDa && !request.orari.giovediPomAl &&
       !request.orari.venerdiMatDa && !request.orari.venerdiMatAl &&
       !request.orari.venerdiPomDa && !request.orari.venerdiPomAl &&
       !request.orari.sabatoMatDa && !request.orari.sabatoMatAl &&
       !request.orari.sabatoPomDa && !request.orari.sabatoPomAl &&
       !request.orari.domenicaMatDa && !request.orari.domenicaMatAl &&
       !request.orari.domenicaPomDa && !request.orari.domenicaPomAl
    )
      {
        this.translate.get('ERRORS.REFERENCE_TIME').subscribe((translatedText: string) => {
          this.errorMessages = translatedText;
          this.isError = true;
          return
        });
      }
    else  if((request.orari.lunediMatDa && !request.orari.lunediMatAl) ||
             (request.orari.lunediPomDa && !request.orari.lunediPomAl) ||
             (request.orari.martediMatDa && !request.orari.martediMatAl) ||
             (request.orari.martediPomDa && !request.orari.martediPomAl) ||
             (request.orari.mercolediMatDa && !request.orari.mercolediMatAl) ||
             (request.orari.mercolediPomDa && !request.orari.mercolediPomAl) ||
             (request.orari.giovediMatDa && !request.orari.giovediMatAl) ||
             (request.orari.giovediPomDa && !request.orari.giovediPomAl) ||
             (request.orari.venerdiMatDa && !request.orari.venerdiMatAl) ||
             (request.orari.venerdiPomDa && !request.orari.venerdiPomAl) ||
             (request.orari.sabatoMatDa && !request.orari.sabatoMatAl) ||
             (request.orari.sabatoPomDa && !request.orari.sabatoPomAl) ||
             (request.orari.domenicaMatDa && !request.orari.domenicaMatAl) ||
             (request.orari.domenicaPomDa && !request.orari.domenicaPomAl))
            {
              this.translate.get('ERRORS.INSERT_CLOSING_TIME').subscribe((translatedText: string) => {
                this.errorMessages = translatedText;
                this.isError = true;
                return;
              });
            }
   else  if((request.orari.lunediMatAl && !request.orari.lunediMatDa) ||
            (request.orari.lunediPomAl && !request.orari.lunediPomDa) ||
            (request.orari.martediMatAl && !request.orari.martediMatDa) ||
            (request.orari.martediPomAl && !request.orari.martediPomDa) ||
            (request.orari.mercolediMatAl && !request.orari.mercolediMatDa) ||
            (request.orari.mercolediPomAl && !request.orari.mercolediPomDa) ||
            (request.orari.giovediMatAl && !request.orari.giovediMatDa) ||
            (request.orari.giovediPomAl && !request.orari.giovediPomDa) ||
            (request.orari.venerdiMatAl && !request.orari.venerdiMatDa) ||
            (request.orari.venerdiPomAl && !request.orari.venerdiPomDa) ||
            (request.orari.sabatoMatAl && !request.orari.sabatoMatDa) ||
            (request.orari.sabatoPomAl && !request.orari.sabatoPomDa) ||
            (request.orari.domenicaMatAl && !request.orari.domenicaMatDa) ||
            (request.orari.domenicaPomAl && !request.orari.domenicaPomDa))
            {
              this.translate.get('ERRORS.INSERT_OPENING_TIME').subscribe((translatedText: string) => {
                this.errorMessages = translatedText;
                this.isError = true;
                return;
              });
            }

   else  if((request.orari.lunediMatDa && request.orari.lunediMatAl && request.orari.lunediMatDa.trim() > request.orari.lunediMatAl.trim()) ||
            (request.orari.martediMatDa && request.orari.martediMatAl && request.orari.martediMatDa.trim() > request.orari.martediMatAl.trim()) || 
            (request.orari.mercolediMatDa && request.orari.mercolediMatAl && request.orari.mercolediMatDa.trim() > request.orari.mercolediMatAl.trim()) ||
            (request.orari.giovediMatDa && request.orari.giovediMatAl && request.orari.giovediMatDa.trim() > request.orari.giovediMatAl.trim()) ||
            (request.orari.venerdiMatDa && request.orari.venerdiMatAl && request.orari.venerdiMatDa.trim() > request.orari.venerdiMatAl.trim()) ||
            (request.orari.sabatoMatDa && request.orari.sabatoMatAl && request.orari.sabatoMatDa.trim() > request.orari.sabatoMatAl.trim()) ||
            (request.orari.domenicaMatDa && request.orari.domenicaMatAl && request.orari.domenicaMatDa.trim() > request.orari.domenicaMatAl.trim()) )
            {
              this.translate.get('ERRORS.START_NOT_GREATER_END').subscribe((translatedText: string) => {
                this.errorMessages = translatedText;
                this.isError = true;
                return;
              });
            }
  }
  
}
