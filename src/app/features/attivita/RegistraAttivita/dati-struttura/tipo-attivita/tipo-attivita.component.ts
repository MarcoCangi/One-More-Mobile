/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-tipo-attivita',
  templateUrl: './tipo-attivita.component.html',
  styleUrls: ['./tipo-attivita.component.scss'],
})
export class TipoAttivitaComponent  implements OnInit {

  listaTipoAttivita: FormControl;
  filtro: string = '';
  listaAttivitaFiltrate: TipoAttivita[] = [];
  selectedAttivita: TipoAttivita[] = [];
  @Input() listaAttivitaDDL: TipoAttivita[] | undefined;
  @Input() listaAttivitaSelezionate: TipoAttivita[] | undefined;
  @Output() listaAttivitaChanged = new EventEmitter<TipoAttivita[]>();

  constructor() {
    this.listaTipoAttivita = new FormControl([]);
  }

  ngOnInit() {
    // inizializza
    this.listaAttivitaFiltrate = this.listaAttivitaDDL ?? [];
  
    this.listaTipoAttivita.valueChanges.subscribe((value: any) => {
      if (this.listaAttivitaDDL) {
        const selectedTipoAttivita = this.listaAttivitaDDL
          .filter(attivita => value.includes(attivita.codTipoAttivita));
          this.selectedAttivita = selectedTipoAttivita;
          this.listaAttivitaChanged.emit(selectedTipoAttivita);
      }
    });
  
    if (this.listaAttivitaSelezionate?.length) {
      const preselected = this.listaAttivitaSelezionate.map(a => a.codTipoAttivita);
      this.listaTipoAttivita.setValue(preselected);
    }
  }
  
  // aggiorna la lista filtrata
  ngDoCheck() {
    if (this.listaAttivitaDDL) {
      this.listaAttivitaFiltrate = this.listaAttivitaDDL.filter(a =>
        a.descrizione.toLowerCase().includes(this.filtro.toLowerCase()));
    }
  }
  
  isSelected(cod: string): boolean {
    return this.listaTipoAttivita.value.includes(cod);
  }
  
  toggleSelection(attivita: TipoAttivita): void {
    const selected = [...this.listaTipoAttivita.value];
    const index = selected.indexOf(attivita.codTipoAttivita);
  
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(attivita.codTipoAttivita);
    }
  
    this.listaTipoAttivita.setValue(selected);
  }

  removeChip(chip: TipoAttivita): void {
    const selected = [...this.listaTipoAttivita.value];
    const index = selected.indexOf(chip.codTipoAttivita);
    if (index >= 0) {
      selected.splice(index, 1);
      this.listaTipoAttivita.setValue(selected);
    }
  }
}
