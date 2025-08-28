import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-nome',
  templateUrl: './nome.component.html',
  styleUrls: ['./nome.component.scss'],
})
export class NomeComponent implements OnInit {

  @Input() nome: string | undefined;
  @Output() nomeChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      nomeFormControl: [this.nome || '']
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.exampleForm.get('nomeFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitNomeChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitNomeChange(value: string) {
    this.nomeChange.emit(value);
  }

  // Metodo di accesso rapido al form control
  get nomeFormControl() {
    return this.exampleForm.get('nomeFormControl');
  }
}
