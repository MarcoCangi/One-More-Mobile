import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-descrizione',
  templateUrl: './descrizione.component.html',
  styleUrls: ['./descrizione.component.scss'],
})
export class DescrizioneComponent  implements OnInit {

  @Input() descrizione: string | undefined;
  @Output() descrizioneChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!:FormGroup;
  
  constructor(private fb: FormBuilder) {}

   ngOnInit(): void {
    this.exampleForm = this.fb.group({
      descFormControl: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]]
    });
     
    this.exampleForm.get('descFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitDescChange(value);
    });
   }
   
   emitDescChange(value: string) {
    this.descrizioneChange.emit(value);
  }

  get descFormControl() {
    return this.exampleForm.get('descFormControl');
  }

  hasError(errorCode: string): boolean {
    const control = this.descFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
