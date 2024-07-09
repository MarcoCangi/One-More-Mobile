import { Immagini } from "./Attivita";
import { TipologiaOfferta } from "./Promo";

export class CouponListDto {
    id : number | undefined;
    idPromo : number | undefined;
    idSoggetto : number | undefined;
    idAttivita: number | undefined;
    titoloPromo: string | undefined;
    displayName:string | undefined;
    descPromo:string | undefined;
    dataDal: Date | undefined;
    dataAl:Date | undefined;
    nome:string = '';
    indirizzo:string | undefined;
    citta:string | undefined;
    civico:string | undefined;
    cap:string | undefined;
    latitudine:number | undefined;
    longitudine:number | undefined;
    idStatus:number | undefined;
    imgPrincipale: Immagini | undefined;
    validDays:string | undefined;
    days: number[] | undefined;
    isAllDayValidita:boolean | undefined;
    orarioValiditaDa:string | undefined;
    orarioValiditaAl:string | undefined;
    tipologieOfferta:TipologiaOfferta[] | undefined;
    timestamp:Date | undefined;
    }