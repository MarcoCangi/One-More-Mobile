import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {AbstractControl, FormControl, FormGroupDirective, NgForm, Validators, FormBuilder,  MinLengthValidator, MaxLengthValidator} from '@angular/forms';

@Component({
  selector: 'app-offerte-struttura',
  templateUrl: './offerte-struttura.component.html',
  styleUrls: ['./offerte-struttura.component.scss'],
})
export class OfferteStrutturaComponent  implements OnInit {

  @Input() isVegano:boolean | undefined;
  @Input() isVegetariano:boolean | undefined;
  @Input() isNoGlutine:boolean | undefined;

  @Output() offertaVeganaChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() offertaNoGlutineChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() offertaVegetarianaChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isVeganoFormControl!:FormControl;
  isVegetarianoFormControl!:FormControl;
  isNoGlutineFormControl!:FormControl;

  ngOnInit(): void {
    this.isVeganoFormControl = new FormControl();
    this.isVeganoFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitIsVeganoChange(value);
    });

    this.isVegetarianoFormControl = new FormControl();
    this.isVegetarianoFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitIsVegetarianoChange(value);
    });

    this.isNoGlutineFormControl = new FormControl();
    this.isNoGlutineFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitIsNoGlutineChange(value);
    });
  }

  emitIsVeganoChange(value: boolean) {
    this.offertaVeganaChange.emit(value);
  }
  
  emitIsVegetarianoChange(value: boolean) {
    this.offertaVegetarianaChange.emit(value);
  }
  
  emitIsNoGlutineChange(value: boolean) {
    this.offertaNoGlutineChange.emit(value);
  }
}
