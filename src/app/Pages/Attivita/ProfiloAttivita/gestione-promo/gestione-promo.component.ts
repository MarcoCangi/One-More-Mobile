import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Router } from '@angular/router';
import { Attivita, Orari } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GiorniSettimanaPromo, InsertPromoReqDto, Promo, TipologiaOfferta } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';

@Component({
  selector: 'app-gestione-promo',
  templateUrl: './gestione-promo.component.html',
  styleUrls: ['./gestione-promo.component.scss'],
})
export class GestionePromoComponent  implements OnInit {

    id: number | undefined;
    idAttivita:number | undefined;
    attivita: Attivita | undefined;
    orari: Orari | undefined;
    requestPromo!: InsertPromoReqDto;
    
    isPrincipale = false;
    sessioneString!:UserSession | null;
    promo: Promo | undefined;
    listaTipologie: TipologiaOfferta[] = [];
    isLimitEnabled: boolean = false;
    isLoading : boolean | undefined;
    msgErr:string | undefined;
    @Input() modificaPromo!: Promo;
    @Output() openPageEvent = new EventEmitter<number>();
    
    giorni: GiorniSettimanaPromo | undefined;

    constructor(
      private promoService : GetApiPromoService,
      private router: Router,
      private fb: FormBuilder,
      private authService : AuthService
    ) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.requestPromo = new InsertPromoReqDto();
      this.requestPromo.days = [];
      this.idAttivita = 0;
      this.giorni = new GiorniSettimanaPromo();

      if(this.modificaPromo != undefined && this.modificaPromo != null)
      {
        this.requestPromo.idPromo = this.modificaPromo.idPromo;
        if(this.modificaPromo.numCouponMax != undefined && this.modificaPromo.numCouponMax > 0)
          this.isLimitEnabled = true;
    
        if(this.modificaPromo.days != undefined && this.modificaPromo.days.length > 0)
        {
          this.giorni.days = this.modificaPromo.days;
        }
    
        if(this.modificaPromo.listaTipologie != undefined)
        {
          this.listaTipologie = this.modificaPromo.listaTipologie;
        }
      }
    
      this.sessioneString = this.authService.getUserSessionFromCookie();
    
      if (this.sessioneString !== null) {
    
          if(this.sessioneString.idAttivita !== null && this.sessioneString.idAttivita !== undefined && this.sessioneString.idAttivita > 0)
          {
            this.idAttivita = this.sessioneString.idAttivita;
            this.id = this.sessioneString.idSoggetto;
          }
      }
      this.isLoading = false;
    }

  salva() {
    this.msgErr = "";
    this.ControlPromo(this.requestPromo);
    if(this.msgErr)
      return;

    const sessioneString = this.authService.getUserSessionFromCookie();
  
    if (sessioneString !== null) {
      
      if (sessioneString.idAttivita !== null && sessioneString.idAttivita !== undefined && sessioneString.idAttivita > 0) {
        this.requestPromo.idAttivita = sessioneString.idAttivita;
      }

      if(this.requestPromo.days && this.requestPromo.days.length > 0)
      {
        const sortedDays = this.requestPromo.days.sort((a, b) => a - b);
        this.requestPromo.validDays = sortedDays.join('-');
      }

      this.promoService.apiInsertPromo(this.requestPromo).pipe(
        tap((response: any) => {
          this.openPage(7);
        }),
        catchError((error) => {
          console.error(error.error);
          return of(null);
        })
      ).subscribe();
    }
  }

  modifica() {
    
    const sessioneString = this.authService.getUserSessionFromCookie();
  
    if (sessioneString !== null) {
      
      if (sessioneString.idAttivita !== null && sessioneString.idAttivita !== undefined && sessioneString.idAttivita > 0) {
        this.requestPromo.idAttivita = sessioneString.idAttivita;
      }

      this.promoService.apiUpdatePromo(this.requestPromo).pipe(
        tap((response: any) => {
          this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
            this.openPage(7);
          });
        }),
        catchError((error) => {
          console.error(error.error);
          return of(null);
        })
      ).subscribe();
    }
  }
  
  handleDataDalChange(dataDal: moment.Moment) {
    this.requestPromo.dataDal = dataDal.toDate();
  }

  handleDataAlChange(dataAl: moment.Moment) {
    this.requestPromo.dataAl = dataAl.toDate();
  }

  handleTitoloChange(titolo: string) {
    this.requestPromo.titoloPromo = titolo;
  }

  handleDescChange(descrizione: string) {
    this.requestPromo.descPromo = descrizione;
  }

  handleAllSettimanaChange(isAllSettimana: boolean) {
    if (isAllSettimana) {
        if (!this.requestPromo.days) {
            this.requestPromo.days = []; 
        }
        if (!this.requestPromo.days.includes(0)) {
            this.requestPromo.days.push(0);
        }
    } 
    else {
        if (this.requestPromo.days && this.requestPromo.days.includes(0)) {
            this.rimuoviNumero(this.requestPromo.days, 0);
        }
    }
  }

  handleLunediChange(isLunedi: boolean) {
    if (isLunedi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(1)) {
          this.requestPromo.days.push(1);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(1)) {
          this.rimuoviNumero(this.requestPromo.days, 1);
      }
    }
  }

  handleMartediChange(isMartedi: boolean) {
    if (isMartedi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(2)) {
          this.requestPromo.days.push(2);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(2)) {
          this.rimuoviNumero(this.requestPromo.days, 2);
      }
    }
  }

  handleMercolediChange(isMercoledi: boolean) {
    if (isMercoledi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(3)) {
          this.requestPromo.days.push(3);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(3)) {
          this.rimuoviNumero(this.requestPromo.days, 3);
      }
    }
  }

  handleGiovediChange(isGiovedi: boolean) {
    if (isGiovedi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(4)) {
          this.requestPromo.days.push(4);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(4)) {
          this.rimuoviNumero(this.requestPromo.days, 4);
      }
    }
  }

  handleVenerdiChange(isVenerdi: boolean) {
    if (isVenerdi) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(5)) {
          this.requestPromo.days.push(5);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(5)) {
          this.rimuoviNumero(this.requestPromo.days, 5);
      }
    }
  }

  handleSabatoChange(isSabato: boolean) {
    if (isSabato) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(6)) {
          this.requestPromo.days.push(6);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(6)) {
          this.rimuoviNumero(this.requestPromo.days, 6);
      }
    }
  }

  handleDomenicaChange(isDomenica: boolean) {
    if (isDomenica) {
      if (!this.requestPromo.days) {
          this.requestPromo.days = []; 
      }
      if (!this.requestPromo.days.includes(7)) {
          this.requestPromo.days.push(7);
      }
  } 
  else {
      if (this.requestPromo.days && this.requestPromo.days.includes(7)) {
          this.rimuoviNumero(this.requestPromo.days, 7);
      }
    }
  }

  handleIsAllDayValiditaChange(isAllDay: boolean) {
    this.requestPromo.isAllDayValidita = isAllDay;
  }

  handleOrarioValiditaDaChange(orario: string) {
    this.requestPromo.orarioValiditaDa = orario;
  }

  handleorarioValiditaAlChange(orario: string) {
    this.requestPromo.orarioValiditaAl = orario;
  }

  handleListaTipologieChange(tipologie: TipologiaOfferta[]) {
    this.requestPromo.listaTipologie = tipologie;
  }

  handleNumMaxChange(num: number) {
    this.requestPromo.numCouponMax = num;
  }

  handleNumMaxPerPersonaChange(num: number) {
    this.requestPromo.numUtilizziPerPersonaMax = num;
  }

  ControlPromo(promo: InsertPromoReqDto){
    const today = new Date().setHours(0, 0, 0, 0);

    if(promo.titoloPromo == undefined || promo.titoloPromo == null){
      this.msgErr = 'Titolo della Promo obbligatoria'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.titoloPromo.length > 50){
      this.msgErr = 'La lunghezza massima per il titolo della promo è di 50 caratteri'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.titoloPromo.length < 5){
      this.msgErr = 'La lunghezza minima per il titolo della promo è di 5 caratteri'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.dataDal == undefined || promo.dataDal == null){
      this.msgErr = 'Inserire una data inizio validità'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.dataDal.setHours(0, 0, 0, 0) < today){
      this.msgErr = 'La data di inizio validità non può essere inferiore ad oggi'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.dataAl == undefined || promo.dataAl == null){
      this.msgErr = 'Inserire una data di fine validità'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.dataAl.setHours(0, 0, 0, 0) < promo.dataDal.setHours(0, 0, 0, 0)){
      this.msgErr = 'La data di fine validità non può essere inferiore alla data inizio'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.dataAl.setHours(0, 0, 0, 0) < today){
      this.msgErr = 'La data di fine validità non può essere inferiore alla data di oggi'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.descPromo == undefined || promo.descPromo == null){
      this.msgErr = 'Inserire una breve descrizione';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.descPromo.length > 200){
      this.msgErr = 'La lunghezza massima per la descrizione della promo è di 200 caratteri';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.descPromo.length < 5){
      this.msgErr = 'La lunghezza minima per la descrizione della promo è di 5 caratteri'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if(promo.days == undefined || promo.days == null || promo.days.length == 0){
        this.msgErr = "Indicare per quali giorni della settimana è disponibile l'offerta";
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    // if(promo.days != undefined && promo.days.length > 1 && promo.days.includes(0))
    // {
    // }
     if((promo.isAllDayValidita == undefined || promo.isAllDayValidita == false) && 
        (promo.orarioValiditaDa == undefined || promo.orarioValiditaDa == null) &&
        (promo.orarioValiditaAl == undefined || promo.orarioValiditaAl == null)){
          this.msgErr = "Indicare il periodo della giornata";
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
       }
      if((promo.isAllDayValidita == undefined || promo.isAllDayValidita == false) &&
         ((promo.orarioValiditaDa == undefined || promo.orarioValiditaDa == null) &&
         (promo.orarioValiditaAl != undefined && promo.orarioValiditaAl != null))){
          this.msgErr = "Indicare l'orario di inizio validità";
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
       }
       if((promo.isAllDayValidita == undefined || promo.isAllDayValidita == false) &&
         ((promo.orarioValiditaAl == undefined || promo.orarioValiditaAl == null) &&
         (promo.orarioValiditaDa != undefined && promo.orarioValiditaDa != null))){
          this.msgErr = "Indicare l'orario di fine validità";
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
       }
       if(promo.listaTipologie == undefined || promo.listaTipologie.length == 0){
        this.msgErr = "Indicare una o più tipologie di offerta";
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
     }
  }

  rimuoviNumero(array: number[], numero: number): void {
    const indice: number = array.indexOf(numero);
    if (indice !== -1) {
        array.splice(indice, 1);
    }
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }
}
