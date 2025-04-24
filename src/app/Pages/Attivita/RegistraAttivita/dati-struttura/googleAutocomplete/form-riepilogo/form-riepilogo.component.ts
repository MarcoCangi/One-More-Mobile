import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, AttivitaRicerca, Immagini, InsertAttivitaReqDto, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { TranslateService } from '@ngx-translate/core';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { catchError, lastValueFrom, of, tap } from 'rxjs';

@Component({
  selector: 'app-form-riepilogo',
  templateUrl: './form-riepilogo.component.html',
  styleUrls: ['./form-riepilogo.component.scss'],
})
export class FormRiepilogoComponent  implements OnInit {
  
  @Input() attivita! : Attivita;
  @Input() listaComuni : Comuni[] | undefined;
  @Input() listaAttivitaDDL: TipoAttivita[] | undefined;
  @Input() listaAttivitaSelezionate: TipoAttivita[] | undefined;
  @Output() backEvent = new EventEmitter<void>();
  essioneString:UserSession | null | undefined;
  attivitaForImg! : Attivita;
  segmentValue: string = 'one';
  segmentSteps = ['one', 'two', 'three', 'four'];
  listaTipoAttivita: TipoAttivita[] = [];
  IsModified: boolean = false;
  IsModifiedName: boolean = false;
  IsModifiedPhone: boolean = false;
  IsModifiedMail: boolean = false;
  IsModifiedCitta: boolean = false;
  IsModifiedDesc: boolean = false;
  isLoadingSalvataggio: boolean = false;
  isCheckboxChecked: boolean = false;
  countImg = 1;
  isError: boolean = false;
  errorNome:string | undefined;
  errorTel:string | undefined;
  errorCell:string | undefined;
  errorTipologia:string | undefined;
  errorCitta:string | undefined;
  errorEmail:string | undefined;
  errorIndirizzo:string | undefined;
  errorCivico:string | undefined;
  errorCAP:string | undefined;
  errorImg:string | undefined;
  errorDesc:string | undefined;
  errorDescServ:string | undefined;
  errorOrari:string | undefined;
  requestAttivita: InsertAttivitaReqDto | undefined;

  constructor(private attivitaService: GetApiAttivitaService,
              private translate: TranslateService,
              private authService: AuthService,) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit() {
    if(this.attivita && this.attivita.placeId){
      const data = await this.attivitaService.apiGetAttivitaAutocomplete(this.attivita.placeId);
      if (data) {
          this.attivitaForImg = data;
          if(this.attivitaForImg){
            console.log(this.attivitaForImg.listaTipoAttivita);
            this.attivita.immagini = this.attivitaForImg.immagini;
            this.attivita.listaTipoAttivita = this.attivitaForImg.listaTipoAttivita;
            this.listaAttivitaSelezionate = this.attivita.listaTipoAttivita;
          }
      }
    }
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
  }

  chiudi(){
    this.IsModified = false;
    this.IsModifiedName = false;
    this.IsModifiedPhone = false;
    this.IsModifiedMail = false;
    this.IsModifiedCitta = false;
    this.IsModifiedDesc = false;
  }

  async prosegui() {
    this.isLoadingSalvataggio = true;
    if(this.isCheckboxChecked)
    {
    
    await this.InitRequestAtt();

    await this.controlValidator(this.requestAttivita);
    
    if (!this.isError) {
      const sessioneString = this.authService.getUserSession();
  
      if (sessioneString) {
        if (sessioneString.idAttivita !== null && sessioneString.idAttivita !== undefined && sessioneString.idAttivita > 0 && this.requestAttivita != undefined) {
          this.requestAttivita.idAttivita = sessioneString.idAttivita;
        }
        if (sessioneString.idAttivita !== null && sessioneString.idAttivita !== undefined && sessioneString.idAttivita > 0 && this.attivita != undefined) {
          this.attivita.idAttivita = sessioneString.idAttivita;
        }
        if (sessioneString.idSoggetto !== null && sessioneString.idSoggetto !== undefined && sessioneString.idSoggetto > 0 && this.requestAttivita != undefined) { 
          this.requestAttivita.idSoggetto = sessioneString.idSoggetto;
        }
        if (sessioneString.idSoggetto !== null && sessioneString.idSoggetto !== undefined && sessioneString.idSoggetto > 0 && this.attivita != undefined) { 
          this.attivita.idSoggetto = sessioneString.idSoggetto;
        }
        if (this.requestAttivita && this.requestAttivita.immagini != undefined && this.requestAttivita.immagini.length > 0) {
            this.requestAttivita.immagini.forEach(immagine => {
            immagine.ordinamento = this.countImg;
            this.countImg = this.countImg + 1;
          });
        }
          if (this.requestAttivita && this.requestAttivita.listaTipoAttivita && this.attivita && this.attivita.listaTipoAttivita != undefined && this.attivita.listaTipoAttivita.length > 0) {
            this.requestAttivita.listaTipoAttivita.forEach(att => {
              if (att.codTipoAttivita) {
                att.codTipoAttivita = att.codTipoAttivita.toString().padStart(4, '0');
              }
            });
          }
        
        if (this.requestAttivita) {
          await this.insertAttivita();
        }
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    this.isLoadingSalvataggio = false;
    //this.dismissConferma();
    }
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

  async insertAttivita() {
      if (this.requestAttivita) {
        try {
          const response = await lastValueFrom(
            this.attivitaService.apiInsertAttivita(this.requestAttivita).pipe(
              tap(async (response) => {
                this.authService.setIdAttivitaUserSession(response.idAttivita);
                // this.isSalvataggioOK = true;
                // this.isDetailModalOpen = true;
  
                const cacheKey = `lista_attivita`; //svuoto la cache con la vecchia lista delle attività
                //this.storageService.removeItem(cacheKey);
              }),
              catchError((error) => {
                console.error(error.error);
                // this.isSalvataggioOK = false;
                // this.isDetailModalOpen = true;
                return of(null);
              })
            )
          );
        } catch (error) {
          console.error('Errore durante l\'inserimento dell\'attività:', error);
        }
      }
    }

  async InitRequestAtt() {
      this.requestAttivita = new InsertAttivitaReqDto(
        this.attivita?.idAttivita? this.attivita.idAttivita : 0,
        this.attivita?.idSoggetto? this.attivita.idSoggetto : 0,
        this.attivita?.nome? this.attivita.nome : "",
        this.attivita?.indirizzo? this.attivita.indirizzo : "",
        this.attivita?.citta? this.attivita.citta : "",
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

      this.isError = false;
      const telefonoPattern = /^[0-9()+ -]*$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const noSpecialCharsRegex = /^(?!.*(DROP|TABLE|INSERT|DELETE|UPDATE)).*[a-zA-Z0-9À-ÖØ-öø-ÿ.,()!?/@#& _-]*$/i;
      const noSpecialCharsRegexCitta = /^[a-zA-Z0-9 _-]*$/;
  
      if(request)
      {
      //CONTROLLO NOME//
      if(request.nome == undefined || request.nome == ""){
        this.translate.get('ERRORS.ACTIVITY_NAME_REQUIRED').subscribe((translatedText: string) => {
          this.errorNome = translatedText;
          this.isError = true;
        });
      }
      else if(request.nome.length < 2){
        this.translate.get('ERRORS.MINIMUM_LENGTH_2').subscribe((translatedText: string) => {
          this.errorNome = translatedText;
          this.isError = true;
        });
      }
      else if(request.nome.length > 50){
        this.translate.get('ERRORS.MAX_LENGTH_50').subscribe((translatedText: string) => {
          this.errorNome = translatedText;
          this.isError = true;
        });
      }
      else if (!noSpecialCharsRegex.test(request.nome)) {
        this.translate.get('ERRORS.NAME_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
          this.errorNome = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO TELEFONO//
      if(request.telefono == undefined || request.telefono == ""){
        this.translate.get('ERRORS.PHONE_NUMBER_REQUIRED').subscribe((translatedText: string) => {
          this.errorTel = translatedText;
          this.isError = true;
        });
      }
      else if(!telefonoPattern.test(request.telefono)){
        this.translate.get('ERRORS.INVALID_FORMAT').subscribe((translatedText: string) => {
          this.errorTel = translatedText;
          this.isError = true;
        });
      }
     
      //CONTROLLO TIPO ATTIVITA//
      if(request.listaTipoAttivita == undefined || request.listaTipoAttivita.length == 0){
        this.translate.get('ERRORS.LEAST_ONE_TYPE').subscribe((translatedText: string) => {
          this.errorTipologia = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO CITTA'//
      if(request.citta == undefined || request.citta == ""){
        this.translate.get('ERRORS.CITY_OR_MUNICIPALITY').subscribe((translatedText: string) => {
          this.errorCitta = translatedText;
          this.isError = true;
        });
      }
      else if(this.listaComuni && !this.listaComuni.some(comune => comune.descComune === request.citta)){
        this.translate.get('ERRORS.VALID_MUNICIPALITY').subscribe((translatedText: string) => {
          this.errorCitta = translatedText;
          this.isError = true;
        });
      }
      else if (!noSpecialCharsRegexCitta.test(request.citta)) {
        this.translate.get('ERRORS.MUNICIPALITY_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
          this.errorCitta = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO EMAIL//
      if(request.email == undefined || request.email == ""){
        this.translate.get('ERRORS.MAIL_REQUIRED').subscribe((translatedText: string) => {
          this.errorEmail = translatedText;
          this.isError = true;
        });
      }
      else if (!emailRegex.test(request.email)) {
        this.translate.get('ERRORS.VALID_EMAIL').subscribe((translatedText: string) => {
          this.errorEmail = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO INDIRIZZO//
      if(request.indirizzo == undefined || request.indirizzo == ""){
        this.translate.get('ERRORS.ADDRESS_REQUIRED').subscribe((translatedText: string) => {
          this.errorIndirizzo = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO CIVICO//
      if(request.civico == undefined || request.civico == ""){
        this.translate.get('ERRORS.CIVIC_REQUIRED').subscribe((translatedText: string) => {
          this.errorCivico = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO CAP//
      if(request.cap == undefined || request.cap == ""){
        this.translate.get('ERRORS.ZIP_CODE_REQUIRED').subscribe((translatedText: string) => {
          this.errorCAP = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO ORARI//
      //this.controlOrari(request);
  
      //CONTROLLO IMMAGINI//
      if(request.immagini == undefined || request.immagini.length == 0){
        this.translate.get('ERRORS.ONE_OR_MORE_IMAGES').subscribe((translatedText: string) => {
          this.errorImg = translatedText;
          this.isError = true;
        });
      }
      if(!request.immagini.find(i => i.isImmaginePrincipale)){
        this.translate.get('ERRORS.PROFILE_IMAGE_REQUIRED').subscribe((translatedText: string) => {
          this.errorImg = translatedText;
          this.isError = true;
        });
      }
  
      //CONTROLLO DESCRIZIONE//
      if(request.description == undefined || request.description == ""){
        this.translate.get('ERRORS.DESCR_ACTIVITY_REQUIRED').subscribe((translatedText: string) => {
          this.errorDesc = translatedText;
          this.isError = true;
        });
      }
      else if(request.description.length < 100){
        this.translate.get('ERRORS.MINIMUM_LENGTH_DESC_100').subscribe((translatedText: string) => {
          this.errorDesc = translatedText;
          this.isError = true;
        });
      }
      else if(request.description.length > 2000){
        this.translate.get('ERRORS.MAX_LENGTH_DESC_2000').subscribe((translatedText: string) => {
          this.errorDesc = translatedText;
          this.isError = true;
        });
      }
      else if (!noSpecialCharsRegex.test(request.description)) {
        this.translate.get('ERRORS.DESCR_CHAR_NOT_ALLOWED').subscribe((translatedText: string) => {
          this.errorDesc = translatedText;
          this.isError = true;
        });
      }
      }
  }
  
}
