import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Orari } from 'src/app/EntityInterface/Attivita';

@Component({
  selector: 'app-orari-apertura',
  templateUrl: './orari-apertura.component.html',
  styleUrls: ['./orari-apertura.component.scss'],
})
export class OrariAperturaComponent implements OnInit {

  orariForm: FormGroup;

  @Input() orari: Orari | undefined;
  @Output() orariChange: EventEmitter<Orari> = new EventEmitter<Orari>();

  constructor(private fb: FormBuilder) {
    this.orariForm = this.fb.group({
      lunediMatDa: new FormControl(),
      lunediMatAl: new FormControl(),
      lunediPomDa: new FormControl(),
      lunediPomAl: new FormControl(),
      martediMatDa: new FormControl(),
      martediMatAl: new FormControl(),
      martediPomDa: new FormControl(),
      martediPomAl: new FormControl(),
      mercolediMatDa: new FormControl(),
      mercolediMatAl: new FormControl(),
      mercolediPomDa: new FormControl(),
      mercolediPomAl: new FormControl(),
      giovediMatDa: new FormControl(),
      giovediMatAl: new FormControl(),
      giovediPomDa: new FormControl(),
      giovediPomAl: new FormControl(),
      venerdiMatDa: new FormControl(),
      venerdiMatAl: new FormControl(),
      venerdiPomDa: new FormControl(),
      venerdiPomAl: new FormControl(),
      sabatoMatDa: new FormControl(),
      sabatoMatAl: new FormControl(),
      sabatoPomDa: new FormControl(),
      sabatoPomAl: new FormControl(),
      domenicaMatDa: new FormControl(),
      domenicaMatAl: new FormControl(),
      domenicaPomDa: new FormControl(),
      domenicaPomAl: new FormControl(),
    });
  }

  ngOnInit(): void {
    // Inizializza il form con i valori degli orari
    if (this.orari) {
      this.orariForm.patchValue(this.orari);
    }

    // Aggiungi un listener per il cambio di valore nel form control
    this.orariForm.valueChanges.subscribe((value: Orari) => {
      this.emitOrariChange();
    });
  }

  emitOrariChange() {
    this.orariChange.emit(this.orariForm.value);
  }
}
