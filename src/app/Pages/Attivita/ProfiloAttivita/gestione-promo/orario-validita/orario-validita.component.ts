import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';;

@Component({
  selector: 'app-orario-validita',
  templateUrl: './orario-validita.component.html',
  styleUrls: ['./orario-validita.component.scss'],
})
export class OrarioValiditaComponent  implements OnInit {

  @Input() isAllDayValidita:boolean | undefined;
  @Input() orarioValiditaDa:string | undefined;
  @Input() orarioValiditaAl:string | undefined;

  @Output() isAllDayValiditaChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() orarioValiditaDaChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() orarioValiditaAlChange: EventEmitter<string> = new EventEmitter<string>();

  isAllDayValiditaFormControl!:FormControl;
  orarioValiditaDaFormControl!:FormControl;
  orarioValiditaAlFormControl!:FormControl;

  ngOnInit(): void {
    this.isAllDayValiditaFormControl = new FormControl({ value: false, disabled: false });
    this.orarioValiditaDaFormControl = new FormControl({ value: '', disabled: false });
    this.orarioValiditaAlFormControl = new FormControl({ value: '', disabled: false });

    this.isAllDayValiditaFormControl.setValue(this.isAllDayValidita);
    this.orarioValiditaDaFormControl.setValue(this.orarioValiditaDa);
    this.orarioValiditaAlFormControl.setValue(this.orarioValiditaAl);

    // Aggiungi un listener per il cambio di valore nel form control
    this.isAllDayValiditaFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitIsAllDayValiditaChange(value);

      if (value) {
        // Se 'Tutto il giorno' è selezionato, svuota i valori dei FormControl e disabilita
        this.orarioValiditaDaFormControl.setValue('');
        this.orarioValiditaAlFormControl.setValue('');
        this.orarioValiditaDaFormControl.disable();
        this.orarioValiditaAlFormControl.disable();
      } else {
        // Altrimenti, abilita i FormControl
        this.orarioValiditaDaFormControl.enable();
        this.orarioValiditaAlFormControl.enable();
      }
    });

    this.orarioValiditaDaFormControl.valueChanges.subscribe((value: string) => {
      this.emitOrarioValiditaDaChange(value);
    });

    this.orarioValiditaAlFormControl.valueChanges.subscribe((value: string) => {
      this.emitOrarioValiditaAlChange(value);
    });
  }

  emitIsAllDayValiditaChange(value: boolean) {
    this.isAllDayValiditaChange.emit(value);
  }

  emitOrarioValiditaDaChange(value: string) {
    this.orarioValiditaDaChange.emit(value);
  }

  emitOrarioValiditaAlChange(value: string) {
    this.orarioValiditaAlChange.emit(value);
  }
}
