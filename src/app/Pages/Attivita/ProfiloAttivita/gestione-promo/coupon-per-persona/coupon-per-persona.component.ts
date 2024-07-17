import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-coupon-per-persona',
  templateUrl: './coupon-per-persona.component.html',
  styleUrls: ['./coupon-per-persona.component.scss'],
})
export class CouponPerPersonaComponent implements OnInit {

  isLimitEnabled: boolean = false;

  @Input() numMaxPerPersona: number | undefined;

  @Output() numMaxPerPersonaChange: EventEmitter<number> = new EventEmitter<number>();

  numMaxPerPersonaFormControl!: FormControl;

  ngOnInit(): void {
    if ((this.numMaxPerPersona != undefined && this.numMaxPerPersona > 0)) {
      this.isLimitEnabled = true;
    }

    this.numMaxPerPersonaFormControl = new FormControl();

    this.numMaxPerPersonaFormControl.setValue(this.numMaxPerPersona);

    // Aggiungi un listener per il cambio di valore nel form control
    this.numMaxPerPersonaFormControl.valueChanges.subscribe((value: number) => {
      this.emitNumMaxPerPersonaChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitNumMaxPerPersonaChange(value: number) {
    this.numMaxPerPersonaChange.emit(value);
  }
}