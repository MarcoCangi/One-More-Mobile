/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

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
  isLoading: boolean = false;

   constructor(private attivitaService: GetApiAttivitaService,
               private storageService: StorageService) { }
  
    ngOnInit(): void {
      this.loadData();
  }

  async loadData() {
    if (this.latitudine && this.longitudine) {
      this.isLoading = true;
      const cacheKey = `attivita_near`;
      const cachedData = await this.storageService.getItem(cacheKey);
  
      if (cachedData) {
        this.elencoVicini = cachedData; // Usa i dati dalla cache
        this.isLoading = false;
      } else {
        (await this.attivitaService.apiGetListaAttivitaNear(this.latitudine, this.longitudine))
          .subscribe(async (data: Attivita[]) => {
            this.elencoVicini = data;
            await this.storageService.setItem(cacheKey, data, 60); // Salva in cache per 1 minuto
            this.isLoading = false;
          });
      }
    }
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
