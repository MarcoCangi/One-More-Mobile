import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-num-max-coupon',
  templateUrl: './num-max-coupon.component.html',
  styleUrls: ['./num-max-coupon.component.scss'],
})
export class NumMaxCouponComponent  implements OnInit {

  @Input() numMax : number | undefined
  @Output() numMaxChange: EventEmitter<number> = new EventEmitter<number>();
  
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
    this.numMaxChange.emit(value);
  }
}
