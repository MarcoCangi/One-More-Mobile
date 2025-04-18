import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';

@Component({
  selector: 'app-richiesta-tipo-compilazione',
  templateUrl: './richiesta-tipo-compilazione.component.html',
  styleUrls: ['./richiesta-tipo-compilazione.component.scss'],
})
export class RichiestaTipoCompilazioneComponent  implements OnInit {

  isModalOpen = false;
  constructor() { }

  @Input() listaComuni : Comuni[] | undefined;
  @Output() inserimentoManualeEvent = new EventEmitter<void>();

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  Manual(){
    this.inserimentoManualeEvent.emit();
  }
}
