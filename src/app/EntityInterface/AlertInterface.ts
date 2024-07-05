import { AlertTypeEnum } from "../Enums/AlertType";

export interface AlertInterface{
    type:AlertTypeEnum;
    text:string;
}