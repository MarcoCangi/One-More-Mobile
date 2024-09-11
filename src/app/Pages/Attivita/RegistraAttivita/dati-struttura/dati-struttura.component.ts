import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup} from '@angular/forms';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, Immagini, InsertAttivitaReqDto, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiComuniService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-comuni.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dati-struttura',
  templateUrl: './dati-struttura.component.html',
  styleUrls: ['./dati-struttura.component.scss'],
})
export class DatiStrutturaComponent  implements OnInit {
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
  isError:boolean | undefined;
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

  constructor(
    private attivitaService: GetApiAttivitaService,
    private comuniService: GetApiComuniService,
    private authService: AuthService,
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.orari = new Orari();
    this.idAttivita = 0;
    this.attivita = undefined;
    await this.InitRequestAtt();
    const user = this.authService.getCurrentUserFromAuth();
    this.sessioneString = this.authService.getUserSessionFromCookie();
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
    this.listaAttivita = undefined;
  }

  onCheckboxChange(event: any) {
    this.isCheckboxChecked = event.detail.checked;
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
      const sessioneString = this.authService.getUserSessionFromCookie();
  
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
  
          if (this.requestAttivita && this.requestAttivita.listaTipoAttivita && this.attivita && this.attivita.listaTipoAttivita != undefined && this.attivita.listaTipoAttivita.length > 0) {
            this.requestAttivita.listaTipoAttivita.forEach(att => {
              if (att.codTipoAttivita) {
                att.codTipoAttivita = att.codTipoAttivita.toString().padStart(4, '0');
              }
            });
          }
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
      const sessioneString = this.authService.getUserSessionFromCookie();
  
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
    const noSpecialCharsRegex = /^[a-zA-Z0-9.,()!?/@# _-]*$/;
    const noSpecialCharsRegexCitta = /^[a-zA-Z0-9 _-]*$/;

    if(request)
    {
    //CONTROLLO NOME//
    if(request.nome == undefined){
      this.errorNome = "Nome attivita obbligatoria";
      this.isError = true;
    }
    else if(request.nome == ""){
      this.errorNome = "Nome attivita obbligatoria";
      this.isError = true;
    }
    else if(request.nome.length < 2){
      this.errorNome = "Lunghezza minima 2 caratteri";
      this.isError = true;
    }
    else if(request.nome.length > 50){
      this.errorNome = "Lunghezza massima 50 caratteri";
      this.isError = true;
    }
    else if (!noSpecialCharsRegex.test(request.nome)) {
      this.errorNome = "Il nome contiene caratteri non ammessi";
      this.isError = true;
    }

    //CONTROLLO TELEFONO//
    if(request.telefono == undefined){
      this.errorTel = "Numero di telefono obbligatorio";
      this.isError = true;
    }
    else if(request.telefono == ""){
      this.errorTel = "Numero di telefono obbligatorio";
      this.isError = true;
    }
    else if(!telefonoPattern.test(request.telefono)){
      this.errorTel = "Formato del numero di telefono non valido";
      this.isError = true;
    }
    
    //CONTROLLO CELLULARE//
    if(request.cellulare == undefined){
      this.errorCell = "Numero di cellulare obbligatorio";
      this.isError = true;
    }
    else if(request.cellulare == ""){
      this.errorCell = "Numero di cellulare obbligatorio";
      this.isError = true;
    }
    else if(request.cellulare && !telefonoPattern.test(request.cellulare)){
      this.errorCell = "Formato del numero di cellulare non valido";
      this.isError = true;
    }
    
    //CONTROLLO TIPO ATTIVITA//
    if(request.listaTipoAttivita == undefined){
      this.errorTipologia = "Indicare almeno una tipologia";
      this.isError = true;
    }
    else if(request.listaTipoAttivita.length == 0){
      this.errorTipologia = "Indicare almeno una tipologia";
      this.isError = true;
    }

    //CONTROLLO CITTA'//
    if(request.citta == undefined){
      this.errorCitta = "Inserire Città o comune";
      this.isError = true;
    }
    else if(request.citta == ""){
      this.errorCitta = "Inserire Città o comune";
      this.isError = true;
    }
    else if(this.listaComuni && !this.listaComuni.some(comune => comune.descComune === request.citta)){
      this.errorCitta = "Inserire un comune valido";
      this.isError = true;
    }
    else if (!noSpecialCharsRegexCitta.test(request.citta)) {
      this.errorCitta = "Il campo Comune contiene caratteri non ammessi";
      this.isError = true;
    }

    //CONTROLLO EMAIL//
    if(request.email == undefined){
      this.errorEmail = "Mail obbligatoria";
      this.isError = true;
    }
    else if(request.email == ""){
      this.errorEmail = "Mail obbligatoria";
      this.isError = true;
    }
    else if (!emailRegex.test(request.email)) {
      this.errorEmail = "Inserire un'email valida";
      this.isError = true;
    }

    //CONTROLLO INDIRIZZO//
    if(request.indirizzo == undefined){
      this.errorIndirizzo = "Indirizzo obbligatorio";
      this.isError = true;
    }
    else if(request.indirizzo == ""){
      this.errorIndirizzo = "Indirizzo obbligatorio";
      this.isError = true;
    }

    //CONTROLLO CIVICO//
    if(request.civico == undefined){
      this.errorCivico = "Civico obbligatorio";
      this.isError = true;
    }
    else if(request.civico == ""){
      this.errorCivico = "Civico obbligatorio";
      this.isError = true;
    }

    //CONTROLLO CAP//
    if(request.cap == undefined){
      this.errorCAP = "CAP obbligatorio";
      this.isError = true;
    }
    else if(request.cap == ""){
      this.errorCAP = "CAP obbligatorio";
      this.isError = true;
    }

    //CONTROLLO ORARI//
    this.controlOrari(request);

    //CONTROLLO IMMAGINI//
    if(request.immagini == undefined){
      this.errorImg = "Inserire una o più immagini";
      this.isError = true;
    }
    else if(request.immagini.length == 0){
      this.errorImg = "Inserire una o più immagini";
      this.isError = true;
    }
    if(!request.immagini.find(i => i.isImmaginePrincipale)){
      this.errorImg = "Inserire una immagine profilo";
      this.isError = true;
    }

    //CONTROLLO DESCRIZIONE//
    if(request.descrizione == undefined){
      this.errorDesc = "Descrizione attivita obbligatoria";
      this.isError = true;
    }
    else if(request.descrizione == ""){
      this.errorDesc = "Descrizione attivita obbligatoria";
      this.isError = true;
    }
    else if(request.descrizione.length < 100){
      this.errorDesc = "Lunghezza minima descrizione 100 caratteri";
      this.isError = true;
    }
    else if(request.descrizione.length > 2000){
      this.errorDesc = "Lunghezza massima descrizione 2000 caratteri";
      this.isError = true;
    }
    else if (!noSpecialCharsRegex.test(request.descrizione)) {
      this.errorDesc = "La descrizione contiene caratteri non ammessi";
      this.isError = true;
    }

    //CONTROLLO DESCRIZIONE OFFERTE//
    else if(request.descrizione.length > 2000){
      this.errorDesc = "Lunghezza massima descrizione offerta 2000 caratteri";
      this.isError = true;
    }
    else if (!noSpecialCharsRegex.test(request.descrizione)) {
      this.errorDesc = "La descrizione offerta contiene caratteri non ammessi";
      this.isError = true;
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

        const sessioneString = this.authService.getUserSessionFromCookie();

        if(sessioneString && sessioneString.idAttivita)
        {
          sessioneString.idAttivita = 0;
          this.authService.saveUserSessionToCookie(sessioneString);
        }
        this.isEliminazioneOK = true;
      }

      this.isLoadingDelete = false;

    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'attivita:', error);
      this.isLoadingDelete = false;
    }
  }

  async getAttivita(idSoggetto: number, idAttivita:number) {
    this.isLoading = true;
    try {
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
        }
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
    this.isLoading = false;
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

  async insertAttivita() {
    if (this.requestAttivita) {
      try {
        const response = await lastValueFrom(
          this.attivitaService.apiInsertAttivita(this.requestAttivita).pipe(
            tap((response) => {
              this.authService.setIdAttivitaUserSession(response.idAttivita);
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
            const data = await firstValueFrom(this.attivitaService.apiGetListaDecAttivita());
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
  
  getImmaginePrincipale(): string {
    const immaginePrincipale = this.requestAttivita?.immagini?.find(i => i.isImmaginePrincipale);
    return immaginePrincipale ? immaginePrincipale.upload : 'default-image.jpg';
  }

  getGallery(): any[] {
    if (!this.requestAttivita?.immagini) {
        return [];
    }
    const immaginePrincipale = this.requestAttivita.immagini.find(i => i.isImmaginePrincipale);
    return this.requestAttivita.immagini.filter(i => i !== immaginePrincipale);
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
  
  handleCellulareChange(newCellulare: string) {
  if(this.requestAttivita)
    this.requestAttivita.cellulare = newCellulare;
  }
  
  handleIsCellPubblicoeChange(isPubblico: boolean) {
    if(this.requestAttivita)
      this.requestAttivita.isCellPubblico = isPubblico;
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
      this.requestAttivita.descrizione = descrizione;
  }
  
  handleDescOffertaChange(descrizioneOfferta: string) {
    this.errorDescServ = "";
    if(this.requestAttivita)
      this.requestAttivita.descrizioneOfferta = descrizioneOfferta;
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
      this.attivita?.cellulare? this.attivita.cellulare : "",
      this.attivita?.isCellPubblico? this.attivita.isCellPubblico : false,
      this.attivita?.email? this.attivita.email : "",
      this.attivita?.descrizione? this.attivita.descrizione : "",
      this.attivita?.descrizioneOfferta? this.attivita.descrizioneOfferta : "",
      this.attivita?.isPromoPresente? this.attivita.isPromoPresente : false,
      this.attivita?.isOffertaVegetariana? this.attivita.isOffertaVegetariana : false,
      this.attivita?.isOffertaVegana? this.attivita.isOffertaVegana : false,
      this.attivita?.isOffertaNoGlutine? this.attivita.isOffertaNoGlutine : false,
      this.attivita?.listaTipoAttivita? this.attivita.listaTipoAttivita : [],
      this.attivita?.orari? this.attivita.orari : new Orari(),
      this.attivita?.immagini? this.attivita.immagini : [],
      this.attivita?.isVerificata? this.attivita.isVerificata : false,
      this.attivita?.esitoVerifica? this.attivita.esitoVerifica : false)
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
        this.errorOrari = "Inserire almeno un orario di riferimento";
        this.isError = true;
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
              this.errorOrari = "Dove è stato inserito un orario di apertura, inserire anche uno di chiusura";
              this.isError = true;
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
              this.errorOrari = "Dove è stato inserito un orario di chiusura, inserire anche uno di apertura";
              this.isError = true;
            }

   else  if((request.orari.lunediMatDa && request.orari.lunediMatAl && request.orari.lunediMatDa.trim() > request.orari.lunediMatAl.trim()) ||
            (request.orari.martediMatDa && request.orari.martediMatAl && request.orari.martediMatDa.trim() > request.orari.martediMatAl.trim()) || 
            (request.orari.mercolediMatDa && request.orari.mercolediMatAl && request.orari.mercolediMatDa.trim() > request.orari.mercolediMatAl.trim()) ||
            (request.orari.giovediMatDa && request.orari.giovediMatAl && request.orari.giovediMatDa.trim() > request.orari.giovediMatAl.trim()) ||
            (request.orari.venerdiMatDa && request.orari.venerdiMatAl && request.orari.venerdiMatDa.trim() > request.orari.venerdiMatAl.trim()) ||
            (request.orari.sabatoMatDa && request.orari.sabatoMatAl && request.orari.sabatoMatDa.trim() > request.orari.sabatoMatAl.trim()) ||
            (request.orari.domenicaMatDa && request.orari.domenicaMatAl && request.orari.domenicaMatDa.trim() > request.orari.domenicaMatAl.trim()) )
            {
              this.errorOrari = "L'orario di inizio non può essere maggiore dell'orario di fine";
              this.isError = true;
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

}
