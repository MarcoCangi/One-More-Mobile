
export class Attivita {
  idAttivita:number | undefined;
  idSoggetto:number | undefined;
  nome:string = '';
  indirizzo:string | undefined;
  citta:string | undefined;
  provincia:string | undefined;
  civico:string | undefined;
  cap:string | undefined;
  latitudine:number | undefined;
  longitudine:number | undefined;
  telefono:string | undefined;
  cellulare:string | undefined;
  isCellPubblico:boolean | undefined;
  email:string | undefined;
  descrizione:string | undefined;
  descrizioneOfferta:string | undefined;
  isPromoPresente:boolean | undefined;
  isOffertaVegetariana:boolean | undefined;
  isOffertaVegana:boolean | undefined;
  isOffertaNoGlutine:boolean | undefined;
  listaTipoAttivita:TipoAttivita[] | undefined;
  orari:Orari | undefined;
  immagini:Immagini[] | undefined;
  
}

export class AttivitaRicerca {
  idAttivita:number | undefined;
  nome:string = '';
  indirizzo:string | undefined;
  citta:string | undefined;
  provincia:string | undefined;
  civico:string | undefined;
  cap:string | undefined;
  latitudine:number | undefined;
  longitudine:number | undefined;
  isPromoPresente:boolean | undefined;
  listaTipoAttivita:TipoAttivita[] | undefined;
  immagini:Immagini[] | undefined;
}

export class InsertAttivitaReqDto {
  idSoggetto:number | undefined;
  nome:string | undefined;
  indirizzo:string | undefined;
  citta:string | undefined;
  provincia:string | undefined;
  civico:string | undefined;
  cap:string | undefined;
  telefono:string | undefined;
  cellulare:string | undefined;
  isCellPubblico:boolean | undefined;
  email:string | undefined;
  descrizione:string | undefined;
  descrizioneOfferta:string | undefined;
  isPromoPresente:boolean | undefined;
  isOffertaVegetariana:boolean | undefined;
  isOffertaVegana:boolean | undefined;
  isOffertaNoGlutine:boolean | undefined;
  listaTipoAttivita:TipoAttivita[] | undefined;
  orari:Orari | undefined;
  immagini:Immagini[] | undefined;
}

export class TipoAttivita {
  codTipoAttivita:string | undefined;
  descrizione:string | undefined;
}

export class Orari {
  lunediMatDa:string | undefined;
  lunediMatAl:string | undefined;
  lunediPomDa:string | undefined;
  lunediPomAl:string | undefined;
  martediMatDa:string | undefined;
  martediMatAl:string | undefined;
  martediPomDa:string | undefined;
  martediPomAl:string | undefined;
  mercolediMatDa:string | undefined;
  mercolediMatAl:string | undefined;
  mercolediPomDa:string | undefined;
  mercolediPomAl:string | undefined;
  giovediMatDa:string | undefined;
  giovediMatAl:string | undefined;
  giovediPomDa:string | undefined;
  giovediPomAl:string | undefined;
  venerdiMatDa:string | undefined;
  venerdiMatAl:string | undefined;
  venerdiPomDa:string | undefined;
  venerdiPomAl:string | undefined;
  sabatoMatDa:string | undefined;
  sabatoMatAl:string | undefined;
  sabatoPomDa:string | undefined;
  sabatoPomAl:string | undefined;
  domenicaMatDa:string | undefined;
  domenicaMatAl:string | undefined;
  domenicaPomDa:string | undefined;
  domenicaPomAl:string | undefined;

  constructor()
  {
  this.lunediMatDa = '';
  this.lunediMatAl = '';
  this.lunediPomDa = '';
  this.lunediPomAl = '';
  this.martediMatDa = '';
  this.martediMatAl = '';
  this.martediPomDa = '';
  this.martediPomAl = '';
  this.mercolediMatDa = '';
  this.mercolediMatAl = '';
  this.mercolediPomDa = '';
  this.mercolediPomAl = '';
  this.giovediMatDa = '';
  this.giovediMatAl = '';
  this.giovediPomDa = '';
  this.giovediPomAl = '';
  this.venerdiMatDa = '';
  this.venerdiMatAl = '';
  this.venerdiPomDa = '';
  this.venerdiPomAl = '';
  this.sabatoMatDa = '';
  this.sabatoMatAl = '';
  this.sabatoPomDa = '';
  this.sabatoPomAl = '';
  this.domenicaMatDa = '';
  this.domenicaMatAl = '';
  this.domenicaPomDa = '';
  this.domenicaPomAl = '';
  }
}

export class Descrizione{
  descrizioneLocale : string | undefined;
  menu : string | undefined;
}

export class Immagini{
  idImmagine : number | undefined;
  idAttivita! : number;
  nomeUpload! : string;
  upload! : string;
  isImmaginePrincipale! : boolean;
  ordinamento! : number;
}

export class AttivitaHomePageResponse
{
    listUltimeAttReg : Attivita [] | undefined;
    listAttivitaWithPromo : Attivita [] | undefined;
}

export class AttivitaSession {
  constructor(
    public idAttivita:number | undefined,
    public idSoggetto:number | undefined,
    public nome:string,
    public indirizzo:string | undefined,
    public citta:string | undefined,
    public provincia:string | undefined,
    public civico:string | undefined,
    public cap:string | undefined,
    public latitudine:number | undefined,
    public longitudine:number | undefined,
    public telefono:string | undefined,
    public cellulare:string | undefined,
    public isCellPubblico:boolean | undefined,
    public email:string | undefined,
    public descrizione:string | undefined,
    public descrizioneOfferta:string | undefined,
    public isPromoPresente:boolean | undefined,
    public isOffertaVegetariana:boolean | undefined,
    public isOffertaVegana:boolean | undefined,
    public isOffertaNoGlutine:boolean | undefined,
    public listaTipoAttivita:TipoAttivita[] | undefined,
    public orari:Orari | undefined,
    public immagini:Immagini[] | undefined
  ){}
}

export class FiltriAttivita {
  tipoRicerca: number | undefined;
  latitudine: number | undefined;
  longitudine: number | undefined;
  isPromoPresente: boolean | undefined;
  citta: string | undefined;
  provincia: string | undefined;
  nome: string | undefined;
  indirizzo: string | undefined;
  dataFinePromo: Date | undefined;
  isLunedi: boolean | undefined;
  isMartedi: boolean | undefined;
  isMercoledi: boolean | undefined;
  isGiovedi: boolean | undefined;
  isVenerdi: boolean | undefined;
  isSabato: boolean | undefined;
  isDomenica: boolean | undefined;
  isAllDayValidita: boolean | undefined;
  orarioValiditaDa: string | undefined;
  orarioValiditaAl: string | undefined;
  codTipoAttivita: string | undefined;
  codTipoPromo: number | undefined;
}

export class AttivitaFiltrate
{
    listaAttivita: Attivita [] | undefined;
    latitudine:number | undefined;
    longitudine:number | undefined;
    errore:string | undefined;
}

