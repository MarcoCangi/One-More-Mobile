import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-num-max-coupon',
  templateUrl: './num-max-coupon.component.html',
  styleUrls: ['./num-max-coupon.component.scss'],
})
export class NumMaxCouponComponent  implements OnInit {

  @Input() numMax : number | undefined
  @Output() numMaxChange: EventEmitter<number> = new EventEmitter<number>();
  
  numMaxFormControl!:FormControl;

  ngOnInit(): void {
    this.numMaxFormControl = new FormControl();
    this.numMaxFormControl.setValue(this.numMax);
    // Aggiungi un listener per il cambio di valore nel form control
    this.numMaxFormControl.valueChanges.subscribe((value: number) => {
      this.emitNumMaxChange(value);
    });
  }

  // Funzione per emettere l'evento di output
  emitNumMaxChange(value: number) {
    this.numMaxChange.emit(value);
  }
}
