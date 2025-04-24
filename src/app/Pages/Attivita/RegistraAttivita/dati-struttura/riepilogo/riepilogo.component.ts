import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, InsertAttivitaReqDto } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.scss'],
})
export class RiepilogoComponent  implements OnInit {

  @Input() attivita! : Attivita;
  @Output() isCheckedEvent = new EventEmitter<boolean>()
  @Output() SalvaEvent = new EventEmitter<void>()
  requestAttivita: InsertAttivitaReqDto | undefined;
  isCheckboxChecked = false;

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

  onCheckboxChange(event: any) {
    const isChecked = event.detail.checked;
    this.isCheckedEvent.emit(isChecked);
  }

  Salva(){
    this.SalvaEvent.emit();
  }

}
