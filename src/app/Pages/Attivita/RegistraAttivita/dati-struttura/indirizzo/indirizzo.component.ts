import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-indirizzo',
  templateUrl: './indirizzo.component.html',
  styleUrls: ['./indirizzo.component.scss'],
})
export class IndirizzoComponent  implements OnInit {

  @Input() indirizzo:string | undefined;
  @Output() indirizzoChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      indirizzoFormControl: [this.indirizzo || '']
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.exampleForm.get('indirizzoFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitIndirizzoChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitIndirizzoChange(value: string) {
    this.indirizzoChange.emit(value);
  }

  // Metodo di accesso rapido al form control
  get indirizzoFormControl() {
    return this.exampleForm.get('indirizzoFormControl');
  }
}
