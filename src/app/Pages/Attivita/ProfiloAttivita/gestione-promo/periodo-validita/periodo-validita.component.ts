import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-periodo-validita',
  templateUrl: './periodo-validita.component.html',
  styleUrls: ['./periodo-validita.component.scss'],
})
export class PeriodoValiditaComponent implements OnInit {

  @Input() dataDalValue: Date | undefined;
  @Input() dataAlValue: Date | undefined;

  @Output() dataDalChange: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
  @Output() dataAlChange: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

  dataDalFormControl!: FormControl;
  dataAlFormControl!: FormControl;

  isDataDalPickerOpen = false;
  isDataAlPickerOpen = false;

  ngOnInit(): void {
    this.dataDalFormControl = new FormControl();
    this.dataAlFormControl = new FormControl();

    if (this.dataDalValue)
      this.dataDalFormControl.setValue(moment(this.dataDalValue).format('YYYY-MM-DD'));
    if (this.dataAlValue)
      this.dataAlFormControl.setValue(moment(this.dataAlValue).format('YYYY-MM-DD'));

    this.dataDalFormControl.valueChanges.subscribe((value: string) => {
      const momentValue = moment(value, 'YYYY-MM-DD').startOf('day');
      this.emitDataDalChange(momentValue);
    });

    this.dataAlFormControl.valueChanges.subscribe((value: string) => {
      const momentValue = moment(value, 'YYYY-MM-DD').startOf('day');
      this.emitDataAlChange(momentValue);
    });
  }

  emitDataDalChange(value: moment.Moment) {
    this.dataDalChange.emit(value);
  }

  emitDataAlChange(value: moment.Moment) {
    this.dataAlChange.emit(value);
  }

  openDataDalPicker() {
    console.log("Apri data picker Dal");
    this.isDataDalPickerOpen = true;
  }

  closeDataDalPicker() {
    console.log("Chiudi data picker Dal");
    this.isDataDalPickerOpen = false;
  }

  openDataAlPicker() {
    console.log("Apri data picker Al");
    this.isDataAlPickerOpen = true;
  }

  closeDataAlPicker() {
    console.log("Chiudi data picker Al");
    this.isDataAlPickerOpen = false;
  }

  onDataDalSelected(event: any) {
    console.log("Data Dal selezionata:", event.detail.value);
    const value = event.detail.value;
    this.dataDalFormControl.setValue(value);
  }

  onDataAlSelected(event: any) {
    console.log("Data Al selezionata:", event.detail.value);
    const value = event.detail.value;
    this.dataAlFormControl.setValue(value);
  }
}
