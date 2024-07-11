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
  listaTipologie: TipologiaOfferta[] = [];
  tipologia : TipologiaOfferta | undefined;

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
  
  @Input() listaTipologieSelezionate:TipologiaOfferta[] | undefined;
  @Output() listaTipologieChanged = new EventEmitter<TipologiaOfferta[]>();

  ngOnInit(): void {

    if(this.listaTipologieSelezionate != undefined)
      this.listaTipologie = this.listaTipologieSelezionate;
    else
      this.listaTipologie = [];

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

    if(this.listaTipologieSelezionate)
      {
        for (const tipo of this.listaTipologieSelezionate) {
          switch(tipo.codTipologia){
            case 1:{
              this.is2X1FormControl.setValue(true);
              break;
            };
            case 2:{
              this.is3X2FormControl.setValue(true);
              break;
            };
            case 3:{
              this.isOmaggioFormControl.setValue(true);
              break;
            };
            case 4:{
              this.isPacchettoFormControl.setValue(true);
              break;
            };
            case 5:{
              this.isScontoFormControl.setValue(true);
              break;
            };
            case 6:{
              this.isBambiniFormControl.setValue(true);
              break;
            };
            case 7:{
              this.isFamiglieFormControl.setValue(true);
              this.isFamiglie = true;
              break;
            };
            case 8:{
              this.isCoppieFormControl.setValue(true);
              this.isCoppie = true;
              break;
            };
            case 9:{
              this.isVeganiFormControl.setValue(true);
              this.isVegani = true;
              break;
            };
            case 10:{
              this.isVegetarianiFormControl.setValue(true);
              this.isVegetariani = true;
              break;
            };
          }
        };
      }
    

    this.is2X1FormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 1;
      const desc = "2X1";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.is3X2FormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 2;
      const desc = "3X2";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isOmaggioFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 3;
      const desc = "Omaggio";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isPacchettoFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 4;
      const desc = "Pacchetto/Bundle";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isScontoFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 5;
      const desc = "Sconto";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isBambiniFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 6;
      const desc = "Bambini";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isFamiglieFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 7;
      const desc = "Famiglie";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isCoppieFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 8;
      const desc = "Coppie";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isVeganiFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 9;
      const desc = "Vegani";
      this.emitListaTipologieChange(value, tipo, desc);
    });

    this.isVegetarianiFormControl.valueChanges.subscribe((value: boolean) => {
      const tipo = 10;
      const desc = "Vegetariani";
      this.emitListaTipologieChange(value, tipo, desc);
    });
  }

  emitListaTipologieChange(value: boolean, tipo: number, descrizione: string) {

    if (!this.listaTipologie.find(x => x.codTipologia === tipo) && value) {
      this.tipologia = new TipologiaOfferta();
      this.tipologia.codTipologia = tipo;
      this.tipologia.descrizione = descrizione;
      this.listaTipologie.push(this.tipologia);
    } else if (this.listaTipologie.find(x => x.codTipologia === tipo) && !value) {
      const index = this.listaTipologie.findIndex(x => x.codTipologia === tipo);
      this.listaTipologie.splice(index, 1);
    }

    this.listaTipologieChanged.emit(this.listaTipologie);
  }
}
