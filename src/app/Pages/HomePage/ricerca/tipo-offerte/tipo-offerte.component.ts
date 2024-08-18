import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TipologiaOfferta } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';

@Component({
  selector: 'app-tipo-offerte',
  templateUrl: './tipo-offerte.component.html',
  styleUrls: ['./tipo-offerte.component.scss'],
})
export class TipoOfferteComponent  implements OnInit {

  is2X1:boolean | undefined;
  is3x2:boolean | undefined;
  isOmaggio:boolean | undefined;
  isPacchetto:boolean | undefined;
  isSconto:boolean | undefined;
  isBambini:boolean | undefined;
  isFamiglie:boolean | undefined;
  isCoppie:boolean | undefined;
  isVegani:boolean | undefined;
  isVegetariani:boolean | undefined;
  tipologie : number[] | undefined;

  is2X1FormControl!:FormControl;
  is3X2FormControl!:FormControl;
  isOmaggioFormControl!:FormControl;
  isPacchettoFormControl!:FormControl;
  isScontoFormControl!:FormControl;
  isBambiniFormControl!:FormControl;
  isFamiglieFormControl!:FormControl;
  isCoppieFormControl!:FormControl;
  isVeganiFormControl!:FormControl;
  isVegetarianiFormControl!:FormControl;
  
  @Output() listaTipologieChanged = new EventEmitter<number[]>();

  ngOnInit(): void {
    this.tipologie = [];
    this.is2X1FormControl = new FormControl();
    this.is3X2FormControl = new FormControl();
    this.isOmaggioFormControl = new FormControl();
    this.isPacchettoFormControl = new FormControl();
    this.isScontoFormControl = new FormControl();
    this.isBambiniFormControl = new FormControl();
    this.isFamiglieFormControl = new FormControl();
    this.isCoppieFormControl = new FormControl();
    this.isVeganiFormControl = new FormControl();
    this.isVegetarianiFormControl = new FormControl();

    this.is2X1FormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 1;
      this.emitListaTipologieChange(value, tipo);
    });

    this.is3X2FormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 2;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isOmaggioFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 3;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isPacchettoFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 4;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isScontoFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 5;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isBambiniFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 6;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isFamiglieFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 7;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isCoppieFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 8;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isVeganiFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 9;
      this.emitListaTipologieChange(value, tipo);
    });

    this.isVegetarianiFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 10;
      this.emitListaTipologieChange(value, tipo);
    });
  }

  emitListaTipologieChange(value: boolean, tipo: number) {
    if (value) {
      // Aggiungi 'tipo' a 'tipologie' se non è già presente
      if (this.tipologie && !this.tipologie.includes(tipo)) {
        this.tipologie.push(tipo);
        console.log(this.tipologie);
      }
    } else {
      // Rimuovi 'tipo' da 'tipologie' se è presente
      if(this.tipologie)
      {
        const index = this.tipologie.indexOf(tipo);
        if (index > -1) {
          this.tipologie.splice(index, 1);
        }
      }
    }
    this.listaTipologieChanged.emit(this.tipologie);
  }
}
