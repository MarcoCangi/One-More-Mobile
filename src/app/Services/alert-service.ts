import { Injectable } from "@angular/core";
import { AlertInterface } from "../EntityInterface/AlertInterface";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AlertService{
    private alert$= new Subject<AlertInterface>();

    setAlert(alert: AlertInterface): void{
        this.alert$.next(alert);
    }

    getAlert(): Observable<AlertInterface>{
       return this.alert$.asObservable();
    }
}