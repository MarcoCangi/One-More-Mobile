import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';

@Component({
  selector: 'app-card-home-page',
  templateUrl: './card-home-page.component.html',
  styleUrls: ['./card-home-page.component.scss'],
})
export class CardHomePageComponent  implements OnInit {

  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  @Input() elencoAtt: Attivita[] | undefined;
  attivitaSelezionata: Attivita | undefined;

  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  VisualizzaAttivita(attivita: Attivita): void {
    this.attivitaSelezionata = attivita;
    if(this.attivitaSelezionata)
      this.attivitaSelezionataEvent.emit(this.attivitaSelezionata);
  }

  getImmaginePrincipale(attivita: Attivita): string {
    const immaginePrincipale = attivita.immagini?.find(img => (img.isImmaginePrincipale && img.isVerificata) || img.isImmaginePrincipaleTemp);
    if (immaginePrincipale && immaginePrincipale.upload) {
      return immaginePrincipale.upload; // Restituisci l'URL dell'immagine principale
    } else {
      return 'URL_IMMAGINE_FALLBACK';
    }
  }
}
