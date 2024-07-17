import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  @Input() descrizione: string | undefined;
  @Input() descrizioneOfferta: string | undefined;
  @Output() descrizioneChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() descrizioneOffertaChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!:FormGroup;
  exampleFormDesc!:FormGroup;

  constructor(private fb: FormBuilder) {}

   ngOnInit(): void {
    this.exampleForm = this.fb.group({
      descFormControl: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(2000)]]
    });

    this.exampleFormDesc = this.fb.group({
      descOffertaFormControl: []
    });

    this.exampleForm.get('descFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitDescChange(value);
    });

    this.exampleFormDesc.get('descOffertaFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitDescOffertaChange(value);
    });
   }
   
   emitDescChange(value: string) {
    this.descrizioneChange.emit(value);
  }
  
   emitDescOffertaChange(value: string) {
    this.descrizioneOffertaChange.emit(value);
  }

  get descFormControl() {
    return this.exampleForm.get('descFormControl');
  }

  get descOffertaFormControl() {
    return this.exampleFormDesc.get('descOffertaFormControl');
  }

  hasError(errorCode: string): boolean {
    const control = this.descFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
