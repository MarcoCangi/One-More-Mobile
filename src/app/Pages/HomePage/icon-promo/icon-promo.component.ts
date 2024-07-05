import { Component, EventEmitter, Output } from '@angular/core';
import { AttivitaFiltrate, FiltriAttivita } from 'src/app/EntityInterface/Attivita';

@Component({
  selector: 'app-icon-promo',
  templateUrl: './icon-promo.component.html',
  styleUrls: ['./icon-promo.component.scss'],
})
export class IconPromoComponent {

  filtro: FiltriAttivita | undefined;
  listaAttivitaRicerca: AttivitaFiltrate | undefined;
  @Output() openPageRicercaEvent = new EventEmitter<number>();

  constructor() {}

    Ricerca(idTipoRicerca:number){
      this.openPageRicercaEvent.emit(idTipoRicerca);
    }
}
