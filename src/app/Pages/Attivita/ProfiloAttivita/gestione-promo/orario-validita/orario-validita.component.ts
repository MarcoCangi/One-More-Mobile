import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';;

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

  constructor(private fb: FormBuilder) {}

  exampleForm!:FormGroup;

  ngOnInit(): void {

    this.exampleForm = this.fb.group({
      isAllDayValiditaFormControl: [''],
      orarioValiditaDaFormControl: [''],
      orarioValiditaAlFormControl: ['']
    });

    this.exampleForm.get('isAllDayValiditaFormControl')!.valueChanges.subscribe((value: boolean) => {
      this.emitIsAllDayValiditaChange(value);
    });

    this.exampleForm.get('orarioValiditaDaFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitOrarioValiditaDaChange(value);
    });

    this.exampleForm.get('orarioValiditaAlFormControl')!.valueChanges.subscribe((value: string) => {
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

  get isAllDayValiditaFormControl() {
    return this.exampleForm.get('isAllDayValiditaFormControl');
  }

  get orarioValiditaDaFormControl() {
    return this.exampleForm.get('orarioValiditaDaFormControl');
  }

  get orarioValiditaAlFormControl() {
    return this.exampleForm.get('orarioValiditaAlFormControl');
  }
}
