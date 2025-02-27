/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-elenco-promo',
  templateUrl: './elenco-promo.component.html',
  styleUrls: ['./elenco-promo.component.scss'],
})
export class ElencoPromoComponent{

  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;
  @ViewChild('titleContent') titleContent: ElementRef | undefined;

  // @Input() elencoPromo:Attivita[] | undefined;
  @Input() latitudine:number | undefined;
  @Input() longitudine:number | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() ricercaAttivitaEvent = new EventEmitter<number>();
  attivitaSelezionata: Attivita | undefined;
  elencoPromo: Attivita[] | undefined;
  isLoading: boolean = false;
  constructor(private attivitaService: GetApiAttivitaService) { }

  ngOnInit(): void {
    this.loadData();
}

async loadData(){
  if(this.latitudine && this.longitudine){
    this.isLoading = true;
    (await this.attivitaService.apiGetListaAttivitaWhitPromo(this.latitudine, this.longitudine)).subscribe((data: Attivita[]) => {
    this.elencoPromo = data;
    this.isLoading = false;
   });
  }
}

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
    // Emetti l'evento con l'attività selezionata
    this.attivitaSelezionata = attivita;
    if(this.attivitaSelezionata)
      this.attivitaSelezionataEvent.emit(this.attivitaSelezionata);
  }

  RicercaAttivitaEvent(){
    this.ricercaAttivitaEvent.emit(1);
  }
}
