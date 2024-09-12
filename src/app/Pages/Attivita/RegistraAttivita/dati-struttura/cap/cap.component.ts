import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cap',
  templateUrl: './cap.component.html',
  styleUrls: ['./cap.component.scss'],
})
export class CapComponent  implements OnInit {

  @Input() cap:string | undefined;
  @Output() capChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      capFormControl: [this.cap || '']
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.exampleForm.get('capFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitCAPChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitCAPChange(value: string) {
    this.capChange.emit(value);
  }

  // Metodo di accesso rapido al form control
  get capFormControl() {
    return this.exampleForm.get('capFormControl');
  }
}
