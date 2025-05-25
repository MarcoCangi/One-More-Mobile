import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InsertPromoReqDto } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';

@Component({
  selector: 'app-area-promo',
  templateUrl: './area-promo.component.html',
  styleUrls: ['./area-promo.component.scss'],
})
export class AreaPromoComponent  implements OnInit {

  @Input() promo!: InsertPromoReqDto;
  @Output() isFoodDrinkChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isFoodChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isDrinkChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isAnyTimeChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isBreakfastChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isBrunchChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isLunchChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isAfternoonTeaChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isHappyHourChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isDinnerChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isLateNightChange : EventEmitter<boolean> = new EventEmitter<boolean>();



  foodDrinkFormControl!: FormControl;
  foodFormControl!: FormControl;
  drinkFormControl!: FormControl;

  anyTimeFormControl!: FormControl;
  breakfastFormControl!: FormControl;
  brunchFormControl!: FormControl;
  lunchFormControl!: FormControl;
  afternoonTeaFormControl!: FormControl;
  happyHourFormControl!: FormControl;
  dinnerFormControl!: FormControl;
  lateNightFormControl!: FormControl;

  isFoodDrinkFormControl!: boolean;
  isFoodFormControl!: boolean;
  isDrinkFormControl!: boolean;

  isAnyTimeFormControl!: boolean;
  isBreakfastFormControl!: boolean;
  isBrunchFormControl!: boolean;
  isLunchFormControl!: boolean;
  isAfternoonTeaFormControl!: boolean;
  isHappyHourFormControl!: boolean;
  isDinnerFormControl!: boolean;
  isLateNightFormControl!: boolean;

  constructor(private fb:FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.foodDrinkFormControl = new FormControl();
    this.foodFormControl = new FormControl();
    this.drinkFormControl = new FormControl();
    this.anyTimeFormControl = new FormControl();
    this.breakfastFormControl = new FormControl();
    this.brunchFormControl = new FormControl();
    this.lunchFormControl = new FormControl();
    this.afternoonTeaFormControl = new FormControl();
    this.happyHourFormControl = new FormControl();
    this.dinnerFormControl = new FormControl();
    this.lateNightFormControl = new FormControl();

    if(this.promo != undefined)   
    {
      if(this.promo.codTipoConsumazione != undefined && this.promo.codTipoConsumazione > 0){
        if(this.promo.codTipoConsumazione == 3)
            this.isFoodDrinkFormControl = true;
        else if(this.promo.codTipoConsumazione == 2)
          this.isDrinkFormControl = true;
        else if(this.promo.codTipoConsumazione == 1)
          this.isFoodFormControl = true;

        this.foodDrinkFormControl.setValue(this.promo.codTipoConsumazione === 3);
        this.foodFormControl.setValue(this.promo.codTipoConsumazione === 1);
        this.drinkFormControl.setValue(this.promo.codTipoConsumazione === 2);
      }
    
      if(this.promo.periodo != undefined && this.promo.periodo != '')

        this.isAnyTimeFormControl = this.promo.periodo?.includes('8') ?? false;
        this.isLateNightFormControl = this.promo.periodo?.includes('7') ?? false; 
        this.isDinnerFormControl = this.promo.periodo?.includes('6') ?? false; 
        this.isHappyHourFormControl = this.promo.periodo?.includes('5') ?? false; 
        this.isAfternoonTeaFormControl = this.promo.periodo?.includes('4') ?? false; 
        this.isLunchFormControl = this.promo.periodo?.includes('3') ?? false; 
        this.isBrunchFormControl = this.promo.periodo?.includes('2') ?? false; 
        this.isBreakfastFormControl = this.promo.periodo?.includes('1') ?? false; 

        this.anyTimeFormControl.setValue(this.promo.periodo?.includes('8') ?? false);
        this.lateNightFormControl.setValue(this.promo.periodo?.includes('7') ?? false);
        this.dinnerFormControl.setValue(this.promo.periodo?.includes('6') ?? false);
        this.happyHourFormControl.setValue(this.promo.periodo?.includes('5') ?? false);
        this.afternoonTeaFormControl.setValue(this.promo.periodo?.includes('4') ?? false);
        this.lunchFormControl.setValue(this.promo.periodo?.includes('3') ?? false);
        this.brunchFormControl.setValue(this.promo.periodo?.includes('2') ?? false);
        this.breakfastFormControl.setValue(this.promo.periodo?.includes('1') ?? false);
      }
    
    // Aggiungi un listener per il cambio di valore nel form control
    this.foodDrinkFormControl.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.deselectOtherType();
      }
      this.emitFoodDrinkChange(value);
    });

    this.anyTimeFormControl.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.deselectOtherPeriod();
      }
      this.emitFoodDrinkChange(value);
    });

    this.foodFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitFoodChange(value);
    });

    this.drinkFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitDrinkChange(value);
    });


    this.breakfastFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitBreakfastChange(value);
    });

    this.brunchFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitBrunchChange(value);
    });

    this.lunchFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitLunchChange(value);
    });

    this.afternoonTeaFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitAfternoonTeaChange(value);
    });

    this.happyHourFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitHappyHourChange(value);
    });

    this.dinnerFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitDinnerChange(value);
    });

    this.lateNightFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitLateNightChange(value);
    });


    const checkboxesType = [
      this.foodDrinkFormControl,
      this.foodFormControl,
      this.drinkFormControl
    ];

    const checkboxesPeriod = [
      this.breakfastFormControl,
      this.brunchFormControl,
      this.lunchFormControl,
      this.afternoonTeaFormControl,
      this.happyHourFormControl,
      this.dinnerFormControl,
      this.lateNightFormControl,
    ];

    checkboxesType.forEach(checkbox => {
      checkbox.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.foodDrinkFormControl.setValue(false);
        } else {
          const allSelected = checkboxesType.every(cb => cb.value);
          if (allSelected) {
            this.foodDrinkFormControl.setValue(true);
          }
        }
      });
    });

    checkboxesPeriod.forEach(checkbox => {
      checkbox.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.anyTimeFormControl.setValue(false);
        } else {
          const allSelected = checkboxesPeriod.every(cb => cb.value);
          if (allSelected) {
            this.anyTimeFormControl.setValue(true);
          }
        }
      });
    });
  }

  deselectOtherType() {
    this.foodFormControl.setValue(false);
    this.drinkFormControl.setValue(false);
  }

  deselectOtherPeriod() {
    this.breakfastFormControl.setValue(false);
    this.brunchFormControl.setValue(false);
    this.lunchFormControl.setValue(false);
    this.afternoonTeaFormControl.setValue(false);
    this.happyHourFormControl.setValue(false);
    this.dinnerFormControl.setValue(false);
    this.lateNightFormControl.setValue(false);
  }

  emitFoodDrinkChange(value: boolean) {
    this.isFoodDrinkChange.emit(value);
  }

  emitFoodChange(value: boolean) {
    this.isFoodChange.emit(value);
  }

  emitDrinkChange(value: boolean) {
    this.isDrinkChange.emit(value);
  }

  emitAnyTimeChange(value: boolean) {
    this.isAnyTimeChange.emit(value);
  }

  emitBreakfastChange(value: boolean) {
    this.isBreakfastChange.emit(value);
  }

  emitBrunchChange(value: boolean) {
    this.isBrunchChange.emit(value);
  }

  emitLunchChange(value: boolean) {
    this.isLunchChange.emit(value);
  }

  emitAfternoonTeaChange(value: boolean) {
    this.isAfternoonTeaChange.emit(value);
  }

  emitHappyHourChange(value: boolean) {
    this.isHappyHourChange.emit(value);
  }

  emitDinnerChange(value: boolean) {
    this.isDinnerChange.emit(value);
  }

  emitLateNightChange(value: boolean) {
    this.isLateNightChange.emit(value);
  }
}
