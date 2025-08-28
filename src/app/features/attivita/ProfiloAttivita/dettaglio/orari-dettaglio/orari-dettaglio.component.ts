import { Component, Input, OnInit } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-orari-dettaglio',
  templateUrl: './orari-dettaglio.component.html',
  styleUrls: ['./orari-dettaglio.component.scss'],
})
export class OrariDettaglioComponent  implements OnInit {

  constructor() { }

  @Input() attivita! : Attivita ;

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}
}
