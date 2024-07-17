import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { GetApiComuniService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-comuni.service';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { Attivita, AttivitaSession, Immagini, InsertAttivitaReqDto, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';

@Component({
  selector: 'app-dati-struttura',
  templateUrl: './dati-struttura.component.html',
  styleUrls: ['./dati-struttura.component.scss'],
})
export class DatiStrutturaComponent  implements OnInit {

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
  isDetailModalOpen = false;
  isSalvataggioOK = false;
  isError:boolean | undefined;
  errorNome:string | undefined;
  errorTel:string | undefined;
  errorTipologia:string | undefined;
  errorCitta:string | undefined;
  errorEmail:string | undefined;
  errorIndirizzo:string | undefined;
  errorCivico:string | undefined;
  errorCAP:string | undefined;
  errorImg:string | undefined;
  errorDesc:string | undefined;
  errorDescServ:string | undefined;


  constructor(
    private attivitaService: GetApiAttivitaService,
    private comuniService: GetApiComuniService,
    private authService: AuthService,
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.orari = new Orari();
    this.idAttivita = 0;

    this.sessioneString = this.authService.getUserSessionFromCookie();

    if (this.sessioneString !== null) {

        if(this.sessioneString.idAttivita !== null && this.sessioneString.idAttivita !== undefined && this.sessioneString.idAttivita > 0)
        {
          this.idAttivita = this.sessioneString.idAttivita;
          this.id = this.sessioneString.idSoggetto;
        }
    }

    
      if(this.id != null && this.id > 0)
      {
        //GET ATTIVITA BY ID
        this.attivitaService.apiGetAttivitaByIdSoggetto(this.id).subscribe(data=>{
        if(data != undefined ){
          this.attivita = data;
          if(this.attivita && this.attivita.idAttivita && this.attivita.idSoggetto)
          {
            this.attivitaService.createAttivitaSession(this.attivita.idAttivita, this.attivita.idSoggetto, this.attivita.nome, this.attivita.indirizzo, this.attivita.citta, this.attivita.provincia, this.attivita.civico, this.attivita.cap, this.attivita.latitudine, this.attivita.longitudine, this.attivita.telefono, this.attivita.cellulare, this.attivita.isCellPubblico, this.attivita.email, this.attivita.descrizione, this.attivita.descrizioneOfferta, this.attivita.isPromoPresente, this.attivita.isOffertaVegetariana, this.attivita.isOffertaVegana, this.attivita.isOffertaNoGlutine, this.attivita.listaTipoAttivita, this.attivita.orari, this.attivita.immagini);
          if(this.attivita.orari != undefined){
          this.orari = this.attivita.orari;
          }
          if(this.attivita.listaTipoAttivita != undefined)
            this.listaTipoAttivita = this.attivita.listaTipoAttivita;
        
          if(this.attivita.provincia != undefined && this.attivita.provincia != null)
            this.provincia = this.attivita.provincia;
          }
          }
        })
      }

   //GET LISTA COMUNI
   this.comuniService.apiGetListaComuni().subscribe((data: any) => {
    this.listaComuni =  data.map((item: Comuni) => {
       return {
        descComune : item['descComune'],
        provincia : item['provincia']
       }
    })
   })

   //GET LISTA DEC TIPO ATTIVITA
   this.listaAttivitaDDL = this.attivitaService.GetListaTipoAttivitaSession();
   if(this.listaAttivitaDDL == undefined || this.listaAttivitaDDL.length == 0){
    this.attivitaService.apiGetListaDecAttivita().subscribe((data: TipoAttivita[]) => {
      if(this.listaAttivitaDDL){
       this.listaAttivitaDDL = data.map((item: TipoAttivita) => {
          return {
            codTipoAttivita: item.codTipoAttivita,
            descrizione: item.descrizione
          };
        });
       }
    });
   }
  }
  
  prosegui() {

    this.isLoading = true;
    this.controlValidator(this.requestAttivita);

    if(!this.isError)
    {
      const sessioneString = this.authService.getUserSessionFromCookie();
  
      if (sessioneString) {
        
      if (sessioneString.idAttivita !== null && sessioneString.idAttivita !== undefined && sessioneString.idAttivita > 0 && this.attivita != undefined) {
        this.attivita.idAttivita = sessioneString.idAttivita;
      }
      if(sessioneString.idSoggetto !== null && sessioneString.idSoggetto !== undefined && sessioneString.idSoggetto > 0 && this.attivita != undefined && this.requestAttivita != undefined){
        this.attivita.idSoggetto = sessioneString.idSoggetto;
        this.requestAttivita.idSoggetto = sessioneString.idSoggetto;
      }
      if(this.requestAttivita && this.orari)
        this.requestAttivita.orari = this.orari;
      if(this.requestAttivita && this.requestAttivita.immagini != undefined && this.requestAttivita.immagini.length > 0)
      {
        this.requestAttivita.immagini.forEach(immagine => {
          if(this.isPrincipale == false){
            immagine.isImmaginePrincipale = true;
            this.isPrincipale = true;
          }
          immagine.ordinamento = this.countImg;
          this.countImg = this.countImg+ 1;
        });
      if(this.requestAttivita && this.requestAttivita.listaTipoAttivita && this.attivita && this.attivita.listaTipoAttivita != undefined && this.attivita.listaTipoAttivita.length > 0)
      {
        this.requestAttivita.listaTipoAttivita.forEach(att => {
          if(att.codTipoAttivita)
            att.codTipoAttivita = att.codTipoAttivita.toString().padStart(4, '0');
        });
      }
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
      ).subscribe();
      }
    }
    }
    else
    {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.isLoading = false;
  }

  controlValidator(request: InsertAttivitaReqDto | undefined){

    this.isError = false;
    const telefonoPattern = /^[0-9()+ -]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(request)
    {
    //CONTROLLO NOME//
    if(request.nome == undefined){
      this.errorNome = "Nome attivita obbligatoria";
      this.isError = true;
    }
    else if(request.nome == ""){
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

    //CONTROLLO TELEFONO//
    if(request.telefono == undefined){
      this.errorTel = "Numero di telefono obbligatorio";
      this.isError = true;
    }
    else if(request.telefono == ""){
      this.isError = true;
    }
    else if(!telefonoPattern.test(request.telefono)){
      this.isError = true;
    }

    //CONTROLLO CELLULARE//
    if(request.cellulare && !telefonoPattern.test(request.cellulare)){
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
      this.isError = true;
    }
    else if(this.listaComuni && !this.listaComuni.some(comune => comune.descComune === request.citta)){
      this.errorCitta = "Inserire città o comune valido";
      this.isError = true;
    }

    //CONTROLLO EMAIL//
    if(request.email == undefined){
      this.errorEmail = "Mail obbligatoria";
      this.isError = true;
    }
    else if(request.email == ""){
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
      this.isError = true;
    }

    //CONTROLLO CIVICO//
    if(request.civico == undefined){
      this.errorCivico = "Civico obbligatorio";
      this.isError = true;
    }
    else if(request.civico == ""){
      this.isError = true;
    }

    //CONTROLLO CAP//
    if(request.cap == undefined){
      this.errorCAP = "CAP obbligatorio";
      this.isError = true;
    }
    else if(request.cap == ""){
      this.isError = true;
    }

    //CONTROLLO IMMAGINI//
    if(request.immagini == undefined){
      this.errorImg = "Inserire una o più immagini";
      this.isError = true;
    }
    else if(request.immagini.length == 0){
      this.errorImg = "Inserire una o più immagini";
      this.isError = true;
    }

    if(this.isError)
    {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  mapAttivitaToSession(sessionAttivita : AttivitaSession | null, attivita : Attivita)
  {
    if(sessionAttivita != null)
    {
      sessionAttivita.idAttivita = attivita.idAttivita; 
      sessionAttivita.idSoggetto = attivita.idSoggetto;
      sessionAttivita.nome = attivita.nome;
      sessionAttivita.indirizzo = attivita.indirizzo;
      sessionAttivita.citta = attivita.citta;
      sessionAttivita.provincia = attivita.provincia;
      sessionAttivita.civico = attivita.civico;
      sessionAttivita.cap = attivita.cap;
      sessionAttivita.latitudine = attivita.latitudine;
      sessionAttivita.longitudine = attivita.longitudine;
      sessionAttivita.telefono = attivita.telefono;
      sessionAttivita.cellulare = attivita.cellulare;
      sessionAttivita.isCellPubblico = attivita.isCellPubblico;
      sessionAttivita.email = attivita.email;
      sessionAttivita.descrizione = attivita.descrizione;
      sessionAttivita.descrizioneOfferta = attivita.descrizioneOfferta;
      sessionAttivita.isPromoPresente = attivita.isPromoPresente;
      sessionAttivita.isOffertaVegetariana = attivita.isOffertaVegetariana;
      sessionAttivita.isOffertaVegana = attivita.isOffertaVegana;
      sessionAttivita.isOffertaNoGlutine = attivita.isOffertaNoGlutine;
      sessionAttivita.listaTipoAttivita = attivita.listaTipoAttivita;
      sessionAttivita.orari = attivita.orari;
      sessionAttivita.immagini = attivita.immagini;
    }
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
    this.isDetailModalOpen = false;
  }
}
