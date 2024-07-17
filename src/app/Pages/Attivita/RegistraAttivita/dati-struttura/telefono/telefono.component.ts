import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.component.html',
  styleUrls: ['./telefono.component.scss'],
})
export class TelefonoComponent  implements OnInit {

  @Input() telefono: string | undefined;
  @Output() telefonoChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.exampleForm = this.fb.group({
      telefonoFormControl: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]]
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.exampleForm.get('telefonoFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitTelefonoChange(value);
    });

  }

  // Funzione per emettere l'evento di output
  emitTelefonoChange(value: string) {
  this.telefonoChange.emit(value);
  }

  get telefonoFormControl() {
    return this.exampleForm.get('telefonoFormControl');
  }

  hasError(errorCode: string): boolean {
    const control = this.telefonoFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }
}
