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
      descFormControl: [this.descrizione || '']
    });

    this.exampleFormDesc = this.fb.group({
      descOffertaFormControl: [this.descrizioneOfferta || '']
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

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
