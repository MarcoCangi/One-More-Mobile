import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { asyncValidator } from 'src/app/Utilities/asyncValidator';

@Component({
  selector: 'app-civico',
  templateUrl: './civico.component.html',
  styleUrls: ['./civico.component.scss'],
})
export class CivicoComponent  implements OnInit {

  @Input() civico:string | undefined;
  @Output() civicoChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      civicoFormControl: [this.civico || '', [Validators.required], [asyncValidator]]
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.exampleForm.get('civicoFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitCivicoChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitCivicoChange(value: string) {
    this.civicoChange.emit(value);
  }

  // Metodo di accesso rapido al form control
  get civicoFormControl() {
    return this.exampleForm.get('civicoFormControl');
  }

  // Funzione helper per controllare gli errori del form control
  hasError(errorCode: string): boolean {
    const control = this.civicoFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }
}
