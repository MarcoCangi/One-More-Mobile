import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-registrazione-attivita',
  templateUrl: './info-registrazione-attivita.component.html',
  styleUrls: ['./info-registrazione-attivita.component.scss'],
})
export class InfoRegistrazioneAttivitaComponent  implements OnInit {

  features = [
  { titleKey: 'FASTREGISTRATION',   descKey: 'VISIBLEONREADEAL',         img: 'assets/Img/one more blu.png',               alt: 'Registrazione veloce' },
  { titleKey: 'CUSTOMPROMOTIONS',   descKey: 'OFFERDISCOUNTS',           img: 'assets/Img/promozioni_personalizzabili.png', alt: 'Promozioni personalizzabili' },
  { titleKey: 'AUDIENCE',           descKey: 'CREATEPROMOTION',          img: 'assets/Img/target_mirato.png',               alt: 'Target mirato' },
  { titleKey: 'NOCOMMISSIONS',      descKey: 'NOCOMMISSIONSDESCRIPTION', img: 'assets/Img/zerocommissioni_1.png',           alt: 'Zero commissioni' },
];

  constructor() { }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
