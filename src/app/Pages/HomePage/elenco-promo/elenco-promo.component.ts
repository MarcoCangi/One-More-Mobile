import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Attivita } from 'src/app/EntityInterface/Attivita';

@Component({
  selector: 'app-elenco-promo',
  templateUrl: './elenco-promo.component.html',
  styleUrls: ['./elenco-promo.component.scss'],
})
export class ElencoPromoComponent{

  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;
  @ViewChild('titleContent') titleContent: ElementRef | undefined;

  @Input() elencoPromo:Attivita[] | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  attivitaSelezionata: Attivita | undefined;

  constructor() { }


  getImmaginePrincipale(attivita: Attivita): string {
    const immaginePrincipale = attivita.immagini?.find(img => img.isImmaginePrincipale);
    // Controlla se è presente un'immagine principale nell'array delle immagini
    if (immaginePrincipale) {
      return immaginePrincipale.upload; // Restituisci l'URL dell'immagine principale
    } else {
      // Se non è presente un'immagine principale, restituisci un'immagine di fallback o un'URL predefinito
      return 'URL_IMMAGINE_FALLBACK';
    }
  }

  scrollLeft(): void {
    if (this.widgetsContent && this.widgetsContent.nativeElement) {
      this.widgetsContent.nativeElement.scrollTo({
        left: this.widgetsContent.nativeElement.scrollLeft - 450,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.widgetsContent && this.widgetsContent.nativeElement) {
      this.widgetsContent.nativeElement.scrollTo({
        left: this.widgetsContent.nativeElement.scrollLeft + 450,
        behavior: 'smooth'
      });
    }
  }

  VisualizzaAttivita(attivita: Attivita): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Emetti l'evento con l'attività selezionata
    this.attivitaSelezionata = attivita;
    if(this.attivitaSelezionata)
      this.attivitaSelezionataEvent.emit(this.attivitaSelezionata);
  }
}
