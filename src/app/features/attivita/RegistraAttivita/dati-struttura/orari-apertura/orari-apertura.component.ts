import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Orari } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { asyncValidator } from 'src/app/Utilities/asyncValidator';

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
      lunediMatDa: [this.orari?.lunediMatDa || '', [asyncValidator]],
      lunediMatAl: [this.orari?.lunediMatAl || '', [asyncValidator]],
      lunediPomDa: [this.orari?.lunediPomDa || '', [asyncValidator]],
      lunediPomAl: [this.orari?.lunediPomAl || '', [asyncValidator]],
      martediMatDa: [this.orari?.martediMatDa || '', [asyncValidator]],
      martediMatAl: [this.orari?.martediMatAl || '', [asyncValidator]],
      martediPomDa: [this.orari?.martediPomDa || '', [asyncValidator]],
      martediPomAl: [this.orari?.martediPomAl || '', [asyncValidator]],
      mercolediMatDa: [this.orari?.mercolediMatDa || '', [asyncValidator]],
      mercolediMatAl: [this.orari?.mercolediMatAl || '', [asyncValidator]],
      mercolediPomDa: [this.orari?.mercolediPomDa || '', [asyncValidator]],
      mercolediPomAl: [this.orari?.mercolediPomAl || '', [asyncValidator]],
      giovediMatDa: [this.orari?.giovediMatDa || '', [asyncValidator]],
      giovediMatAl: [this.orari?.giovediMatAl || '', [asyncValidator]],
      giovediPomDa: [this.orari?.giovediPomDa || '', [asyncValidator]],
      giovediPomAl: [this.orari?.giovediPomAl || '', [asyncValidator]],
      venerdiMatDa: [this.orari?.venerdiMatDa || '', [asyncValidator]],
      venerdiMatAl: [this.orari?.venerdiMatAl || '', [asyncValidator]],
      venerdiPomDa: [this.orari?.venerdiPomDa || '', [asyncValidator]],
      venerdiPomAl: [this.orari?.venerdiPomAl || '', [asyncValidator]],
      sabatoMatDa:[this.orari?.sabatoMatDa || '', [asyncValidator]],
      sabatoMatAl:[this.orari?.sabatoMatAl || '', [asyncValidator]],
      sabatoPomDa:[this.orari?.sabatoPomDa || '', [asyncValidator]],
      sabatoPomAl:[this.orari?.sabatoPomAl || '', [asyncValidator]],
      domenicaMatDa:[this.orari?.domenicaMatDa || '', [asyncValidator]],
      domenicaMatAl:[this.orari?.domenicaMatAl || '', [asyncValidator]],
      domenicaPomDa:[this.orari?.domenicaPomDa || '', [asyncValidator]],
      domenicaPomAl:[this.orari?.domenicaPomAl || '', [asyncValidator]],
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
