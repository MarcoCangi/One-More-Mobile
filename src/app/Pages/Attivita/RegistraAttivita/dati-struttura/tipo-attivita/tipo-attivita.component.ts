import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TipoAttivita } from 'src/app/EntityInterface/Attivita';

@Component({
  selector: 'app-tipo-attivita',
  templateUrl: './tipo-attivita.component.html',
  styleUrls: ['./tipo-attivita.component.scss'],
})
export class TipoAttivitaComponent  implements OnInit {

  listaTipoAttivita: FormControl;

  @Input() listaAttivitaDDL: TipoAttivita[] | undefined;
  @Input() listaAttivitaSelezionate: TipoAttivita[] | undefined;
  @Output() listaAttivitaChanged = new EventEmitter<TipoAttivita[]>();

  constructor() {
    this.listaTipoAttivita = new FormControl([]);
  }

  ngOnInit() {
    this.listaTipoAttivita.valueChanges.subscribe((value: any) => {
      if(this.listaAttivitaDDL) {
        const selectedTipoAttivita = this.listaAttivitaDDL
          .filter(attivitaSelezionata => value.includes(attivitaSelezionata.codTipoAttivita))
          .map(attivitaSelezionata => ({
            codTipoAttivita: attivitaSelezionata.codTipoAttivita,
            descrizione: attivitaSelezionata.descrizione
          }));
        this.listaAttivitaChanged.emit(selectedTipoAttivita);
      }
    });

    if (this.listaAttivitaSelezionate && this.listaAttivitaSelezionate.length > 0) {
      const preselectedValues = this.listaAttivitaSelezionate.map(attivita => attivita.codTipoAttivita);
      this.listaTipoAttivita.setValue(preselectedValues);
    }
  }
}
