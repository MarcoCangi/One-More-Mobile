import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { AttivitaFiltrate, FiltriAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';


@Component({
  selector: 'app-icon-citta',
  templateUrl: './icon-citta.component.html',
  styleUrls: ['./icon-citta.component.scss'],
})
export class IconCittaComponent {

  @Input() listaCitta : string [] | undefined;
  @Output() openPageRicercaEvent = new EventEmitter<string>();

  constructor() {}

    Ricerca(citta:string){
      this.openPageRicercaEvent.emit(citta);
    }

}
