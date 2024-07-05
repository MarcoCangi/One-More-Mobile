import { DecimalPipe } from "@angular/common";

export class Soggetto {
  idSoggetto:number | undefined;
  nome:string | undefined;
  cognome:string | undefined;
  codFiscale:string | undefined;
  dataNascita:Date | undefined;
  telefono:string | undefined;
  cellulare:string | undefined;
  email:string | undefined;
  indirizzo:string | undefined;
  isPromoAttiva:boolean | undefined;
}

export class InsertSoggettoReqDto {
  idSoggetto:number | undefined;
  nome:string | undefined;
  cognome:string | undefined;
  dataNascita:Date | undefined;
  cellulare:string | undefined;
  email:string | undefined;
}

