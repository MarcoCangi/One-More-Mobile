import { DecimalPipe } from "@angular/common";

export interface CtrlAbbonamento{
  CodAbbonamento:string | undefined;
  DescAbbonamento:string | undefined;
  Prezzo:DecimalPipe | undefined;
  MesiPeriodoValidita:number | undefined;
  IsPromo:boolean | undefined;
}