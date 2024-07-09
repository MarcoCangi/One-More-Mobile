import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-distanza',
  templateUrl: './distanza.component.html',
  styleUrls: ['./distanza.component.scss'],
})
export class DistanzaComponent  implements OnInit {

  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  pinFormatter(value: number) {
    return `${value}%`;
  }

}
