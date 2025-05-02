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
  @Output() SalvaEvent = new EventEmitter<boolean>()
  @Output() EliminaEvent = new EventEmitter<void>()
  requestAttivita: InsertAttivitaReqDto | undefined;
  isCheckboxChecked = false;
  isConfirmOpen: boolean = false;

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

  async conferma(){
      this.isConfirmOpen = true;
  }

  onCheckboxChange(event: any) {
    const isChecked = event.detail.checked;
    this.isCheckboxChecked = isChecked;
    this.isCheckedEvent.emit(isChecked);
  }

  async Salva(isSaved: boolean) {
    this.SalvaEvent.emit(isSaved);
  }

  async Elimina() {
    this.EliminaEvent.emit();
  }

}
