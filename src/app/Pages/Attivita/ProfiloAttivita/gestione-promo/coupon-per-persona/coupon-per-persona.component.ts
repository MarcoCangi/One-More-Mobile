import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-coupon-per-persona',
  templateUrl: './coupon-per-persona.component.html',
  styleUrls: ['./coupon-per-persona.component.scss'],
})
export class CouponPerPersonaComponent implements OnInit {

  isLimitEnabled: boolean = false;

  @Input() numMaxPerPersona: number | undefined;
  @Output() numMaxPerPersonaChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private fb: FormBuilder) {}

  exampleForm!:FormGroup;

  ngOnInit(): void {
    this.exampleForm = this.fb.group({
      nMax: ['']
    });
     
    this.exampleForm.get('nMax')!.valueChanges.subscribe((value: number) => {
      this.emitNumMaxPerPersonaChange(value);
    });
   }

   get nMax() {
    return this.exampleForm.get('nMax');
  }

  // Funzione per emettere l'evento di output
  emitNumMaxPerPersonaChange(value: number) {
    this.numMaxPerPersonaChange.emit(value);
  }
}