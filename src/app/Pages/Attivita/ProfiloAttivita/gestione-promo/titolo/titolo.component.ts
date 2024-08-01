import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-titolo',
  templateUrl: './titolo.component.html',
  styleUrls: ['./titolo.component.scss'],
})
export class TitoloComponent implements OnInit {

  @Input() titolo: string | undefined;
  @Output() titoloChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  exampleForm!: FormGroup;

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      titoloFormControl: [this.titolo, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])]
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.exampleForm.get('titoloFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitTitoloChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitTitoloChange(value: string) {
    this.titoloChange.emit(value);
  }

   // Metodo di accesso rapido al form control
   get titoloFormControl() {
    return this.exampleForm.get('titoloFormControl');
  }

  // Funzione helper per controllare gli errori del form control
  hasError(errorCode: string): boolean {
    const control = this.titoloFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }
}