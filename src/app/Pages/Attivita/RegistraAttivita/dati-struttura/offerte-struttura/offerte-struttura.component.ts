import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-offerte-struttura',
  templateUrl: './offerte-struttura.component.html',
  styleUrls: ['./offerte-struttura.component.scss'],
})
export class OfferteStrutturaComponent implements OnInit {

  @Input() isVegano: boolean | undefined;
  @Input() isVegetariano: boolean | undefined;
  @Input() isNoGlutine: boolean | undefined;
  @Input() isRiepilogo: boolean = false;

  @Output() offertaVeganaChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() offertaNoGlutineChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() offertaVegetarianaChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isVeganoFormControl!: FormControl;
  isVegetarianoFormControl!: FormControl;
  isNoGlutineFormControl!: FormControl;

  ngOnInit(): void {
    // Inizializza i controlli del form con i valori ricevuti dagli Input
    this.isVeganoFormControl = new FormControl(this.isVegano || false);
    this.isVeganoFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitIsVeganoChange(value);
    });

    this.isVegetarianoFormControl = new FormControl(this.isVegetariano || false);
    this.isVegetarianoFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitIsVegetarianoChange(value);
    });

    this.isNoGlutineFormControl = new FormControl(this.isNoGlutine || false);
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
