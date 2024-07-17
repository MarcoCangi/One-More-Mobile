import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent  implements OnInit {

  @Input() email: string | undefined;
  @Output() emailChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      emailFormControl: ['', [Validators.email, Validators.required]]
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.exampleForm.get('emailFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitEmailChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitEmailChange(value: string) {
    this.emailChange.emit(value);
  }

  // Metodo di accesso rapido al form control
  get emailFormControl() {
    return this.exampleForm.get('emailFormControl');
  }

  // Funzione helper per controllare gli errori del form control
  hasError(errorCode: string): boolean {
    const control = this.emailFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }
}
