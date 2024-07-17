import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cellulare',
  templateUrl: './cellulare.component.html',
  styleUrls: ['./cellulare.component.scss'],
})
export class CellulareComponent  implements OnInit {

  @Input() cellulare: string | undefined;
  @Input() isPubblico: boolean | undefined;
  @Output() cellulareChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() isCellPubblicoChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  exampleForm!: FormGroup;
  cellPubblicoFormControl!:FormControl;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      cellFormControl: ['', [Validators.compose([Validators.pattern('[- +()0-9]+')])]]
    });

    this.exampleForm.get('cellFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitCellChange(value);
    });

    this.cellPubblicoFormControl = new FormControl();
    // Aggiungi un listener per il cambio di valore nel form control
    this.cellPubblicoFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitIsCellPubblicoChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitCellChange(value: string) {
    this.cellulareChange.emit(value);
  }

  emitIsCellPubblicoChange(value: boolean) {
    this.isCellPubblicoChange.emit(value);
  }

  // Metodo di accesso rapido al form control
  get cellFormControl() {
    return this.exampleForm.get('cellFormControl');
  }

  // Funzione helper per controllare gli errori del form control
  hasError(errorCode: string): boolean {
    const control = this.cellFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }
}
