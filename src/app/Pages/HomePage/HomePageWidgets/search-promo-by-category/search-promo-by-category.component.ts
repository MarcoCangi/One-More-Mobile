import { Component, EventEmitter, Output } from '@angular/core';
import { AttivitaFiltrate, FiltriAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-search-promo-by-category',
  templateUrl: './search-promo-by-category.component.html',
  styleUrls: ['./search-promo-by-category.component.scss'],
})
export class SearchPromoByCategoryComponent {

  filtro: FiltriAttivita | undefined;
  listaAttivitaRicerca: AttivitaFiltrate | undefined;
  @Output() openPageRicercaEvent = new EventEmitter<number>();

  constructor() {}

    Ricerca(idTipoRicerca:number){
      this.openPageRicercaEvent.emit(idTipoRicerca);
    }
}
