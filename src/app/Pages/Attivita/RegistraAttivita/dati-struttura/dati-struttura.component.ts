import { Component, OnInit} from '@angular/core';
import { FormGroup} from '@angular/forms';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, Immagini, InsertAttivitaReqDto, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiComuniService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-comuni.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dati-struttura',
  templateUrl: './dati-struttura.component.html',
  styleUrls: ['./dati-struttura.component.scss'],
})
export class DatiStrutturaComponent  implements OnInit {
  isAdd : boolean = false;
  listaAttivita: Attivita[] | undefined;
  formGroup: FormGroup | undefined;
  id: number | undefined;
  idAttivita:number | undefined;
  listaComuni: Comuni[] | undefined;
  listaAttivitaDDL: TipoAttivita[] | undefined;
  attivita: Attivita | undefined;
  listaTipoAttivita: TipoAttivita[] = [];
  orari: Orari | undefined;
  requestAttivita: InsertAttivitaReqDto | undefined;
  immagini:Immagini[] | undefined;
  isPrincipale = false;
  countImg = 1;
  sessioneString:UserSession | null | undefined;
  provincia:string | undefined;
  isLoading : boolean | undefined;
  isLoadingDelete : boolean | undefined;
  isLoadingSalvataggio : boolean = false;
  isDetailModalOpen = false;
  isConfirmOpen = false;
  isEliminaModalOpen: boolean = false;
  isEliminazioneOK: boolean = false;
  isSalvataggioOK = false;
  isVerificato: boolean = false;
  isError:boolean = false;
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
  alertButtons = ['Chiudi'];
  isCheckboxChecked = false;
  esitoResendVerification: string | undefined;

  constructor(
    private attivitaService: GetApiAttivitaService,
    private comuniService: GetApiComuniService,
    private authService: AuthService,
    private storageService: StorageService,
    private translate: TranslateService
  ) {
    // translate.setDefaultLang('it');
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.orari = new Orari();
    this.idAttivita = 0;
    this.attivita = undefined;
    await this.InitRequestAtt();
    const user = await this.authService.getCurrentUserFromAuth();
    this.sessioneString = this.authService.getUserSession();
    if((user && user?.emailVerified == true && this.sessioneString?.typeLog == 1) || (this.sessioneString?.typeLog == 2 || this.sessioneString?.typeLog == 3))
       this.isVerificato = true;

    if(this.isVerificato)
    {
      await this.getListaComuni();
      await this.GetListaTipoAttivita();
      
      if (this.sessioneString !== null) {
        if (this.sessioneString.idSoggetto !== null && this.sessioneString.idSoggetto !== undefined && this.sessioneString.idSoggetto > 0) {
          this.id = this.sessioneString.idSoggetto;
        }
      }
  
      if (this.id) {
        await this.getListaAttivita(this.id);
      }
    }
    this.isLoading = false;
  }

  async conferma(){
    this.controlValidator(this.requestAttivita);
    if(!this.isError){
      this.isConfirmOpen = true;
    }
  }

  addNewAtt(){
    this.isAdd = true;
  }

  dismissConferma(){
    this.isConfirmOpen = false;
  }

  openEliminaModal(){
    this.isEliminaModalOpen = true;
  }

  dismissEliminaModal(){
    this.isEliminaModalOpen = false;
  }
  
  async prosegui() {
    this.isLoadingSalvataggio = true;
    if(this.isCheckboxChecked)
    {
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
        if (this.requestAttivita && this.orari) {
          this.requestAttivita.orari = this.orari;
        }
        if (this.requestAttivita && this.requestAttivita.immagini != undefined && this.requestAttivita.immagini.length > 0) {
          this.requestAttivita.immagini.forEach(immagine => {
            if (!this.isPrincipale) {
              immagine.isImmaginePrincipale = true;
              this.isPrincipale = true;
            }
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
    this.dismissConferma();
    }
  }

  async modifica() {
    this.isLoadingSalvataggio = true;
    await this.controlValidator(this.requestAttivita);
  
    if (!this.isError) {
      const sessioneString = this.authService.getUserSession();
  
      if (sessioneString) {
        if (sessioneString.idAttivita !== null && sessioneString.idAttivita !== undefined && sessioneString.idAttivita > 0 && this.attivita != undefined) {
          this.attivita.idAttivita = sessioneString.idAttivita;
        }
        if (sessioneString.idSoggetto !== null && sessioneString.idSoggetto !== undefined && sessioneString.idSoggetto > 0 && this.attivita != undefined && this.requestAttivita != undefined) {
          this.attivita.idSoggetto = sessioneString.idSoggetto;
          this.requestAttivita.idSoggetto = sessioneString.idSoggetto;
        }
        if (this.requestAttivita && this.orari) {
          this.requestAttivita.orari = this.orari;
        }
        if (this.requestAttivita && this.requestAttivita.immagini != undefined && this.requestAttivita.immagini.length > 0) {
          this.requestAttivita.immagini.forEach(immagine => {
            if (!this.isPrincipale) {
              immagine.isImmaginePrincipale = true;
              this.isPrincipale = true;
            }
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
          await this.updateAttivita();
        }
      }
    }
  
    this.dismissConferma();
    this.isLoadingSalvataggio = false;
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
    this.controlOrari(request);

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

  async getAttivita(idSoggetto: number, idAttivita:number) {
    this.isLoading = true;

    try {
      const cacheKey = `attivita_${idAttivita}`; // Chiave generica per la cache
  
      const cachedData = await this.storageService.getItem(cacheKey);
      if (cachedData) {
      this.attivita = cachedData;
      if (this.attivita && this.attivita.idAttivita && this.attivita.idSoggetto) {
        this.idAttivita = this.attivita.idAttivita;
        await this.InitRequestAtt();
        if (this.attivita.orari) {
          this.orari = this.attivita.orari;
        }
        if (this.attivita.listaTipoAttivita) {
          this.listaTipoAttivita = this.attivita.listaTipoAttivita;
        }
        if (this.attivita.provincia) {
          this.provincia = this.attivita.provincia;
        }
      }
        this.isLoading = false;
        return;
      }
      
      const data = await lastValueFrom(this.attivitaService.apiGetAttivitaByIdSoggettoAndAtt(idSoggetto, idAttivita));
      if (data) {
        this.attivita = data;
        if (this.attivita && this.attivita.idAttivita && this.attivita.idSoggetto) {
          this.idAttivita = this.attivita.idAttivita;
          await this.InitRequestAtt();
          if (this.attivita.orari) {
            this.orari = this.attivita.orari;
          }
          if (this.attivita.listaTipoAttivita) {
            this.listaTipoAttivita = this.attivita.listaTipoAttivita;
          }
          if (this.attivita.provincia) {
            this.provincia = this.attivita.provincia;
          }
          this.storageService.setItem(cacheKey, this.attivita);
        }
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
    this.isLoading = false;
  }

  async getListaAttivita(idSoggetto: number) {
    const cacheKey = `lista_attivita`; // Chiave generica per la cache
  
    try {
      const cachedData = await this.storageService.getItem(cacheKey);
      if (cachedData) {
        this.listaAttivita = cachedData;
        return;
      }
  
      const data = await lastValueFrom(this.attivitaService.apiGetAttivitaByIdSoggetto(idSoggetto));
      if (data) {
        this.listaAttivita = data;
        await this.storageService.setItem(cacheKey, data);
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
  }
  
  async insertAttivita() {
    if (this.requestAttivita) {
      try {
        const response = await lastValueFrom(
          this.attivitaService.apiInsertAttivita(this.requestAttivita).pipe(
            tap(async (response) => {
              this.authService.setIdAttivitaUserSession(response.idAttivita);
              this.isSalvataggioOK = true;
              this.isDetailModalOpen = true;

              const cacheKey = `lista_attivita`; //svuoto la cache con la vecchia lista delle attività
              this.storageService.removeItem(cacheKey);
            }),
            catchError((error) => {
              console.error(error.error);
              this.isSalvataggioOK = false;
              this.isDetailModalOpen = true;
              return of(null);
            })
          )
        );
      } catch (error) {
        console.error('Errore durante l\'inserimento dell\'attività:', error);
      }
    }
  }
  
  async updateAttivita() {
    if (this.requestAttivita) {
      try {
        const response = await lastValueFrom(
          this.attivitaService.apiUpdateAttivita(this.requestAttivita).pipe(
            tap(() => {
              const cacheKey = `lista_attivita`;
              const cacheKeyAtt = `attivita_${this.requestAttivita?.idAttivita}`; // Chiave generica per la cache
              this.storageService.removeItem(cacheKey); //svuoto la cache con la vecchia lista delle attività
              this.storageService.removeItem(cacheKeyAtt); //rimuovo dalla cache l'attività modificata
              this.isSalvataggioOK = true;
              this.isDetailModalOpen = true;
            }),
            catchError((error) => {
              console.error(error.error);
              this.isSalvataggioOK = false;
              this.isDetailModalOpen = true;
              return of(null);
            })
          )
        );
      } catch (error) {
        console.error('Errore durante la modifica dell\'attività:', error);
      }
    }
  }

  async eliminaAttivita() {
    this.isLoadingDelete = true;
    try {

      const utente = this.authService.getUser(); // Ottieni l'utente attuale

      await this.attivitaService.deleteSession();
      
      // Chiama l'API per eliminare l'account
      if(this.attivita && this.attivita.idAttivita && utente?.idSoggetto)
      {
        await this.attivitaService.apiDeleteAttivita(this.attivita?.idAttivita, utente?.idSoggetto).toPromise();
        
        const sessioneString = this.authService.getUserSession();

        if(sessioneString && sessioneString.idAttivita)
        {
          sessioneString.idAttivita = 0;
          this.authService.saveUserSession(sessioneString);
        }
        this.isEliminazioneOK = true;
        const cacheKey = `lista_attivita`;
        const cacheKeyAtt = `attivita_${this.requestAttivita?.idAttivita}`; // Chiave generica per la cache
        this.storageService.removeItem(cacheKey); //svuoto la cache con la vecchia lista delle attività
        this.storageService.removeItem(cacheKeyAtt) //rimuovo dalla cache l'attività modificata
      }

      this.isLoadingDelete = false;

    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'attivita:', error);
      this.isLoadingDelete = false;
    }
  }

  async getListaComuni() {
    try {
        this.listaComuni = await firstValueFrom(this.comuniService.apiGetListaComuni());
    } catch (error) {
        console.error('Errore durante il recupero della lista comuni:', error);
    }
  }

  async GetListaTipoAttivita() {
    this.listaAttivitaDDL = this.attivitaService.GetListaTipoAttivitaSession();
    if (!this.listaAttivitaDDL || this.listaAttivitaDDL.length === 0) {
        try {
            const data = await firstValueFrom(await this.attivitaService.apiGetListaDecAttivita());
            if (data) {
                this.listaAttivitaDDL = data.map((item: TipoAttivita) => {
                    return {
                        codTipoAttivita: item.codTipoAttivita,
                        descrizione: item.descrizione
                    };
                });
            }
        } catch (error) {
            console.error('Errore nel recupero dei dati:', error);
        }
    }
  }
  


  handleNomeChange(newNome: string) {
  this.errorNome = "";
  if(this.requestAttivita)
    this.requestAttivita.nome = newNome;
  }
  
  handleCittaChange(newCitta: Comuni) {
    this.errorCitta="";
    if(this.requestAttivita)
    {
      this.requestAttivita.citta = newCitta.descComune;
      this.requestAttivita.provincia = newCitta.provincia;
      this.provincia = this.requestAttivita.provincia;
    }
  }
  
  handleTelefonoChange(newTelefono: string) {
    this.errorTel="";
    if(this.requestAttivita)
      this.requestAttivita.telefono = newTelefono;
  }

  handleListaTipoAttivitaChange(attivita: TipoAttivita[]) {
    this.errorTipologia="";
    this.listaTipoAttivita = attivita.map((attivitaSelezionate: TipoAttivita) => ({
    codTipoAttivita: attivitaSelezionate.codTipoAttivita,
    descrizione: attivitaSelezionate.descrizione
  }));
  if(this.requestAttivita)
    this.requestAttivita.listaTipoAttivita = this.listaTipoAttivita;
  }

  handleIsOffertaVeganaChange(isVegano: boolean) {
    if(this.requestAttivita)
      this.requestAttivita.isOffertaVegana = isVegano;
  }
  
  handleIsOffertaVegetarianaChange(isVegetariano: boolean) {
    if(this.requestAttivita)
      this.requestAttivita.isOffertaVegetariana = isVegetariano;
  }
  
  handleIsOffertaNoGlutineChange(isNoGlutine: boolean) {
    if(this.requestAttivita)
      this.requestAttivita.isOffertaNoGlutine = isNoGlutine;
  }
  
  handleEmailChange(newEmail: string) {
    this.errorEmail="";
    if(this.requestAttivita)
      this.requestAttivita.email = newEmail;
  }
  
  handleIndirizzoChange(newIndirizzo: string) {
    this.errorIndirizzo = "";
    if(this.requestAttivita)
      this.requestAttivita.indirizzo = newIndirizzo;
  }
  
  handleCivicoChange(newCivico: string) {
    this.errorCivico = "";
    if(this.requestAttivita)
      this.requestAttivita.civico = newCivico;
  }
  
  handleOrariChange(newOrari: Orari) {
    if(this.orari){
      this.orari.lunediMatDa = JSON.parse(JSON.stringify(newOrari.lunediMatDa));
      this.orari.lunediMatAl = JSON.parse(JSON.stringify(newOrari.lunediMatAl));
      this.orari.lunediPomDa = JSON.parse(JSON.stringify(newOrari.lunediPomDa));
      this.orari.lunediPomAl = JSON.parse(JSON.stringify(newOrari.lunediPomAl));
      this.orari.martediMatDa = JSON.parse(JSON.stringify(newOrari.martediMatDa));
      this.orari.martediMatAl = JSON.parse(JSON.stringify(newOrari.martediMatAl));
      this.orari.martediPomDa = JSON.parse(JSON.stringify(newOrari.martediPomDa));
      this.orari.martediPomAl = JSON.parse(JSON.stringify(newOrari.martediPomAl));
      this.orari.mercolediMatDa = JSON.parse(JSON.stringify(newOrari.mercolediMatDa));
      this.orari.mercolediMatAl = JSON.parse(JSON.stringify(newOrari.mercolediMatAl));
      this.orari.mercolediPomDa = JSON.parse(JSON.stringify(newOrari.mercolediPomDa));
      this.orari.mercolediPomAl = JSON.parse(JSON.stringify(newOrari.mercolediPomAl));
      this.orari.giovediMatDa = JSON.parse(JSON.stringify(newOrari.giovediMatDa));
      this.orari.giovediMatAl = JSON.parse(JSON.stringify(newOrari.giovediMatAl));
      this.orari.giovediPomDa = JSON.parse(JSON.stringify(newOrari.giovediPomDa));
      this.orari.giovediPomAl = JSON.parse(JSON.stringify(newOrari.giovediPomAl));
      this.orari.venerdiMatDa = JSON.parse(JSON.stringify(newOrari.venerdiMatDa));
      this.orari.venerdiMatAl = JSON.parse(JSON.stringify(newOrari.venerdiMatAl));
      this.orari.venerdiPomDa = JSON.parse(JSON.stringify(newOrari.venerdiPomDa));
      this.orari.venerdiPomAl = JSON.parse(JSON.stringify(newOrari.venerdiPomAl));
      this.orari.sabatoMatDa = JSON.parse(JSON.stringify(newOrari.sabatoMatDa));
      this.orari.sabatoMatAl = JSON.parse(JSON.stringify(newOrari.sabatoMatAl));
      this.orari.sabatoPomDa = JSON.parse(JSON.stringify(newOrari.sabatoPomDa));
      this.orari.sabatoPomAl = JSON.parse(JSON.stringify(newOrari.sabatoPomAl));
      this.orari.domenicaMatDa = JSON.parse(JSON.stringify(newOrari.domenicaMatDa));
      this.orari.domenicaMatAl = JSON.parse(JSON.stringify(newOrari.domenicaMatAl));
      this.orari.domenicaPomDa = JSON.parse(JSON.stringify(newOrari.domenicaPomDa));
      this.orari.domenicaPomAl = JSON.parse(JSON.stringify(newOrari.domenicaPomAl));
      
      if(this.requestAttivita && this.requestAttivita.orari)
        this.requestAttivita.orari = this.orari;
    }
  }
  
  handleCapChange(newCap: string) {
    this.errorCAP = "";
    if(this.requestAttivita)
      this.requestAttivita.cap = newCap;
  }
  
  handleImmaginiChange(immagini: Immagini[]) {
    this.errorImg = "";
    if(this.requestAttivita)
      this.requestAttivita.immagini = immagini;
  }
  
  handleDescChange(descrizione: string) {
    this.errorDesc = "";
    if(this.requestAttivita)
      this.requestAttivita.description = descrizione;
  }

  dismissDetailModal() {
    location.reload();
    this.isDetailModalOpen = false;
  }

  reloadHome(){
    location.reload();
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
          this.errorOrari = translatedText;
          this.isError = true;
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
                this.errorOrari = translatedText;
                this.isError = true;
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
                this.errorOrari = translatedText;
                this.isError = true;
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
                this.errorOrari = translatedText;
                this.isError = true;
              });
            }
  }

  getErrorMessage(): string {
    let errorMessage = '';
  
    if (this.errorNome) {
      errorMessage += `•${this.errorNome}\n`;
    }
    if (this.errorTel) {
      errorMessage += `•${this.errorTel}\n`;
    }
    if (this.errorCell) {
      errorMessage += `•${this.errorCell}\n`;
    }
    if (this.errorTipologia) {
      errorMessage += `•${this.errorTipologia}\n`;
    }
    if (this.errorCitta) {
      errorMessage += `•${this.errorCitta}\n`;
    }
    if (this.errorEmail) {
      errorMessage += `•${this.errorEmail}\n`;
    }
    if (this.errorIndirizzo) {
      errorMessage += `•${this.errorIndirizzo}\n`;
    }
    if (this.errorCivico) {
      errorMessage += `•${this.errorCivico}\n`;
    }
    if (this.errorCAP) {
      errorMessage += `•${this.errorCAP}\n`;
    }
    if (this.errorImg) {
      errorMessage += `•${this.errorImg}\n`;
    }
    if (this.errorDesc) {
      errorMessage += `•${this.errorDesc}\n`;
    }
    if (this.errorDescServ) {
      errorMessage += `•${this.errorDescServ}\n`;
    }
    if (this.errorOrari) {
      errorMessage += `•${this.errorOrari}\n`;
    }
  
    return errorMessage.trim();
  }

  async resendVerificationEmail(){
    this.esitoResendVerification = await this.authService.resendVerificationEmail();
  }
}
