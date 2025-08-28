import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  @Input() description: string | undefined;
  @Output() descrizioneChange: EventEmitter<string> = new EventEmitter<string>();

  exampleForm!:FormGroup;
  exampleFormDesc!:FormGroup;

  constructor(private fb: FormBuilder) {}

   ngOnInit(): void {
    this.exampleForm = this.fb.group({
      descFormControl: [this.description || '']
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

  get descOffertaFormControl() {
    return this.exampleFormDesc.get('descOffertaFormControl');
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
