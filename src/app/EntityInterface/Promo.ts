import { DecimalPipe } from "@angular/common";

export class Promo {
idPromo:number | undefined;
idAttivita:number | undefined;
descPromo:string | undefined;
dataInserimento:Date | undefined;
dataDal:Date | undefined;
dataAl:Date | undefined;
validDays:string | undefined;
days:number[] | undefined;
isAllDayValidita:boolean | undefined;
orarioValiditaDa:string | undefined;
orarioValiditaAl:string | undefined;
listaTipologie:TipologiaOfferta[] | undefined;
numUtilizziPerPersonaMax:number | undefined;
numCouponRichiesti:number | undefined;
numCouponUtilizzati:number | undefined;
numCouponRimanenti:number | undefined;
numCouponAnnullati:number | undefined;
numCouponMax:number | undefined;
isAttiva:boolean | undefined;
titoloPromo:string | undefined;
isAbilitataForUser:boolean | undefined;
motivazioneDisabilitata: string | undefined;
}

export class InsertPromoReqDto {
idPromo:number | undefined;
idAttivita:number | undefined;
descPromo:string | undefined;
dataDal:Date | undefined;
dataAl:Date | undefined;
validDays:string | undefined;
days:number[] | undefined;
isAllDayValidita:boolean | undefined;
orarioValiditaDa:string | undefined;
orarioValiditaAl:string | undefined;
listaTipologie:TipologiaOfferta[] | undefined;
numUtilizziPerPersonaMax:number | undefined;
isRinnovoUtilizzo:boolean | undefined;
numCouponMax:number | undefined;
isAttiva:boolean | undefined;
titoloPromo:string | undefined;    
}

export class GiorniSettimanaPromo{
  days:number[] | undefined;
}

export class TipologiaOfferta{
codTipologia:number | undefined;
descrizione:string | undefined;
}

export class InsertPromoUserAttiva{
idPromo: number | undefined;
idSoggetto: number | undefined;
dataAcquisizione:Date | undefined;
}

export class PromoUserAttive
{
idPromo: number | undefined;
idAttivita: number | undefined;
idSoggetto: number | undefined;
titoloPromo: string | undefined;
descPromo:string | undefined;
dataDal: Date | undefined;
dataAl: Date | undefined;
ValidDays:string | undefined;
days:number[] | undefined;
isAllDayValidita:boolean | undefined;
orarioValiditaDa:string | undefined;
orarioValiditaAl:string | undefined;
isAttiva:boolean | undefined;
dataAcquisizione:Date | undefined;
listaTipologie: TipologiaOfferta[] | undefined;
}

export class PromoUserUtilizzate
{
idPromo: number | undefined;
idSoggetto: number | undefined;
dataAcquisizione:Date | undefined;
titoloPromo: string | undefined;
descPromo: string | undefined;
}

export class PromoUser
{
listaPromoAttive: PromoUserAttive[] | undefined;
listaPromoUtilizzate: PromoUserUtilizzate[] | undefined;
}

export class PromoUserAnnullate
{
idPromo: number | undefined;
idAttivita: number | undefined;
dataAcquisizione: Date | undefined;
dataAnnullamento: Date | undefined;
codAnnullamento: string | undefined;
descMotivazione: string | undefined;
}
