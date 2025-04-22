import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-form-riepilogo',
  templateUrl: './form-riepilogo.component.html',
  styleUrls: ['./form-riepilogo.component.scss'],
})
export class FormRiepilogoComponent  implements OnInit {

  @Input() attivita! : Attivita;
  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

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
}
