import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, Immagini, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';


@Component({
  selector: 'app-form-riepilogo',
  templateUrl: './form-riepilogo.component.html',
  styleUrls: ['./form-riepilogo.component.scss'],
})
export class FormRiepilogoComponent  implements OnInit {
  
  @Input() attivita! : Attivita;
  @Input() listaComuni : Comuni[] | undefined;
  @Input() listaAttivitaDDL: TipoAttivita[] | undefined;
  @Output() backEvent = new EventEmitter<void>();
  segmentValue: string = 'one';
  segmentSteps = ['one', 'two', 'three', 'four'];
  listaTipoAttivita: TipoAttivita[] = [];
  IsModified: boolean = false;
  IsModifiedName: boolean = false;
  IsModifiedPhone: boolean = false;
  IsModifiedMail: boolean = false;
  IsModifiedCitta: boolean = false;
  IsModifiedDesc: boolean = false;
  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  returnList(){
    this.backEvent.emit();
  }

  avanti() {
    const currentIndex = this.segmentSteps.indexOf(this.segmentValue);
    if (currentIndex < this.segmentSteps.length - 1) {
      this.segmentValue = this.segmentSteps[currentIndex + 1];
    }
  }
  
  indietro() {
    const currentIndex = this.segmentSteps.indexOf(this.segmentValue);
    if (currentIndex > 0) {
      this.segmentValue = this.segmentSteps[currentIndex - 1];
    }
  }

  modifica(type:number){
    this.IsModified =true;
    this.IsModifiedName = type === 1;
    this.IsModifiedPhone = type === 2;
    this.IsModifiedMail = type === 3;
    this.IsModifiedCitta = type === 4;
    this.IsModifiedDesc = type ===5;
  }

  chiudi(){
    this.IsModified = false;
    this.IsModifiedName = false;
    this.IsModifiedPhone = false;
    this.IsModifiedMail = false;
    this.IsModifiedCitta = false;
    this.IsModifiedDesc = false;
  }

  getImmaginePrincipale(): string {
    const immaginePrincipale = this.attivita?.immagini?.find(i => i.isImmaginePrincipale);
    return immaginePrincipale ? immaginePrincipale.upload : 'default-image.jpg';
  }

  getGallery(): any[] {
    if (!this.attivita?.immagini) {
        return [];
    }
    const immaginePrincipale = this.attivita.immagini.find(i => i.isImmaginePrincipale);
    return this.attivita.immagini.filter(i => i !== immaginePrincipale);
  }

  handleNomeChange(nome: string) {
    if(this.attivita){
      this.attivita.nome = nome;
    }
  }

  handleTelefonoChange(newTelefono: string) {
    if(this.attivita)
      this.attivita.telefono = newTelefono;
  }

  handleEmailChange(newMail: string) {
    if(this.attivita)
      this.attivita.email = newMail;
  }

  handleIndirizzoChange(newindirizzo: string) {
    if(this.attivita)
      this.attivita.indirizzo = newindirizzo;
  }

  handleCivicoChange(newCivico: string) {
    if(this.attivita)
      this.attivita.civico = newCivico;
  }

  handleCapChange(newCap: string) {
    if(this.attivita)
      this.attivita.cap = newCap;
  }

  handleCittaChange(newCitta: Comuni) {
    if(this.attivita)
    {
      this.attivita.citta = newCitta.descComune;
      this.attivita.provincia = newCitta.provincia;
    }
  }

  handleDescChange(descrizione: string) {
    if(this.attivita)
      this.attivita.description = descrizione;
  }

  handleImmaginiChange(immagini: Immagini[]) {
      if(this.attivita)
        this.attivita.immagini = immagini;
  }

  handleListaTipoAttivitaChange(attivita: TipoAttivita[]) {
    this.listaTipoAttivita = attivita.map((attivitaSelezionate: TipoAttivita) => ({
    codTipoAttivita: attivitaSelezionate.codTipoAttivita,
    descrizione: attivitaSelezionate.descrizione
  }));
  if(this.attivita)
    this.attivita.listaTipoAttivita = this.listaTipoAttivita;
  }
}
