import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AttivitaFiltrate, FiltriAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-card-tipo-attivita',
  templateUrl: './card-tipo-attivita.component.html',
  styleUrls: ['./card-tipo-attivita.component.scss'],
})
export class CardTipoAttivitaComponent {

  filtro: FiltriAttivita | undefined;
  listaAttivitaRicerca: AttivitaFiltrate | undefined;
  @Output() openPageRicercaTipoAttEvent = new EventEmitter<string>();

  constructor(private router: Router, 
    private attivitaService: GetApiAttivitaService,
    private dialog: MatDialog) {}

    Ricerca(idTipoRicerca:string){
      this.openPageRicercaTipoAttEvent.emit(idTipoRicerca);
    }
}
