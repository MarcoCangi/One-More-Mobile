import { Component, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-elenco-vicini',
  templateUrl: './elenco-vicini.component.html',
  styleUrls: ['./elenco-vicini.component.scss'],
})
export class ElencoViciniComponent {

  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;
  @ViewChild('titleContent') titleContent: ElementRef | undefined;
  @Output() ricercaAttivitaEvent = new EventEmitter<number>();
  // @Input() elencoVicini:Attivita[] | undefined;
  @Input() latitudine:number | undefined;
  @Input() longitudine:number | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  attivitaSelezionata: Attivita | undefined;
  elencoVicini: Attivita[] | undefined;

   constructor(private attivitaService: GetApiAttivitaService) { }
  
    ngOnInit(): void {
      this.loadData();
  }
  
  async loadData(){
    if(this.latitudine && this.longitudine)
  (await this.attivitaService.apiGetListaAttivitaNear(this.latitudine, this.longitudine)).subscribe((data: Attivita[]) => {
    this.elencoVicini = data;
   });
  }


  getImmaginePrincipale(attivita: Attivita): string {
    const immaginePrincipale = attivita.immagini?.find(img => img.isImmaginePrincipale);
    // Controlla se è presente un'immagine principale nell'array delle immagini
    if (immaginePrincipale && immaginePrincipale.upload) {
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
    this.ricercaAttivitaEvent.emit(2);
  }

}
