import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AttivitaFiltrate, FiltriAttivita, TipoAttivita } from 'src/app/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'src/app/Services/get-api-attivita.service';
import { MatDialog } from '@angular/material/dialog';

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
