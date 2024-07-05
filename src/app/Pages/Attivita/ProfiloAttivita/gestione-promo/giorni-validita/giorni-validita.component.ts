import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GiorniSettimanaPromo } from 'src/app/EntityInterface/Promo';

@Component({
  selector: 'app-giorni-validita',
  templateUrl: './giorni-validita.component.html',
  styleUrls: ['./giorni-validita.component.scss'],
})
export class GiorniValiditaComponent  implements OnInit {

  @Input() giorni: GiorniSettimanaPromo | undefined;
  @Output() isAllSettimanaChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isLunediChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isMartediChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isMercolediChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isGiovediChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isVenerdiChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isSabatoChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isDomenicaChange : EventEmitter<boolean> = new EventEmitter<boolean>();

  allSettimanaFormControl!: FormControl;
  lunediFormControl!: FormControl;
  martediFormControl!: FormControl;
  mercolediFormControl!: FormControl;
  giovediFormControl!: FormControl;
  venerdiFormControl!: FormControl;
  sabatoFormControl!: FormControl;
  domenicaFormControl!: FormControl;

  isAllSettimanaFormControl!: boolean;
  isLunediFormControl!: boolean;
  isMartediFormControl!: boolean;
  isMercolediFormControl!: boolean;
  isGiovediFormControl!: boolean;
  isVenerdiFormControl!: boolean;
  isSabatoFormControl!: boolean;
  isDomenicaFormControl!: boolean;

  constructor(private fb:FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {

    this.allSettimanaFormControl = new FormControl();
    this.lunediFormControl = new FormControl();
    this.martediFormControl = new FormControl();
    this.mercolediFormControl = new FormControl();
    this.giovediFormControl = new FormControl();
    this.venerdiFormControl = new FormControl();
    this.sabatoFormControl = new FormControl();
    this.domenicaFormControl = new FormControl();

    if(this.giorni != undefined && this.giorni.days != undefined && this.giorni.days.length > 0)   
    {
      this.isAllSettimanaFormControl = this.giorni.days.includes(0);
      this.isLunediFormControl = this.giorni.days.includes(1);
      this.isMartediFormControl = this.giorni.days.includes(2);
      this.isMercolediFormControl = this.giorni.days.includes(3);
      this.isGiovediFormControl = this.giorni.days.includes(4);
      this.isVenerdiFormControl = this.giorni.days.includes(5);
      this.isSabatoFormControl = this.giorni.days.includes(6);
      this.isDomenicaFormControl = this.giorni.days.includes(7);

      this.allSettimanaFormControl.setValue(this.giorni.days.includes(0) ? true : false);
      this.lunediFormControl.setValue(this.giorni.days.includes(0) ? true : false);
      this.martediFormControl.setValue(this.giorni.days.includes(0) ? true : false);
      this.mercolediFormControl.setValue(this.giorni.days.includes(0) ? true : false);
      this.giovediFormControl.setValue(this.giorni.days.includes(0) ? true : false);
      this.venerdiFormControl.setValue(this.giorni.days.includes(0) ? true : false);
      this.sabatoFormControl.setValue(this.giorni.days.includes(0) ? true : false);
      this.domenicaFormControl.setValue(this.giorni.days.includes(0) ? true : false);
    }
    

    // Aggiungi un listener per il cambio di valore nel form control
    this.allSettimanaFormControl.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.deselectOtherDays();
      }
      this.emitAllSettimanaChange(value);
    });

    this.lunediFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitLunediChange(value);
    });

    this.martediFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitMartediChange(value);
    });

    this.mercolediFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitMercolediChange(value);
    });

    this.giovediFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitGiovediChange(value);
    });

    this.venerdiFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitVenerdiChange(value);
    });

    this.sabatoFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitSabatoChange(value);
    });

    this.domenicaFormControl.valueChanges.subscribe((value: boolean) => {
      this.emitDomenicaChange(value);
    });

    const checkboxes = [
      this.lunediFormControl,
      this.martediFormControl,
      this.mercolediFormControl,
      this.giovediFormControl,
      this.venerdiFormControl,
      this.sabatoFormControl,
      this.domenicaFormControl
    ];

    checkboxes.forEach(checkbox => {
      checkbox.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.allSettimanaFormControl.setValue(false);
        } else {
          const allSelected = checkboxes.every(cb => cb.value);
          if (allSelected) {
            this.allSettimanaFormControl.setValue(true);
          }
        }
      });
    });
  }

  deselectOtherDays() {
    this.lunediFormControl.setValue(false);
    this.martediFormControl.setValue(false);
    this.mercolediFormControl.setValue(false);
    this.giovediFormControl.setValue(false);
    this.venerdiFormControl.setValue(false);
    this.sabatoFormControl.setValue(false);
    this.domenicaFormControl.setValue(false);
  }

  emitAllSettimanaChange(value: boolean) {
    this.isAllSettimanaChange.emit(value);
  }

  emitLunediChange(value: boolean) {
    this.isLunediChange.emit(value);
  }

  emitMartediChange(value: boolean) {
    this.isMartediChange.emit(value);
  }

  emitMercolediChange(value: boolean) {
    this.isMercolediChange.emit(value);
  }

  emitGiovediChange(value: boolean) {
    this.isGiovediChange.emit(value);
  }

  emitVenerdiChange(value: boolean) {
    this.isVenerdiChange.emit(value);
  }

  emitSabatoChange(value: boolean) {
    this.isSabatoChange.emit(value);
  }

  emitDomenicaChange(value: boolean) {
    this.isDomenicaChange.emit(value);
  }
}
