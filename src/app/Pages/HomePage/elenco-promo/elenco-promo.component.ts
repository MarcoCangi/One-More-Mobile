/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';
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

  constructor(private attivitaService: GetApiAttivitaService,
              private storageService: StorageService) { }

  ngOnInit(): void {
    this.loadData();
}

async loadData() {
  if (this.latitudine && this.longitudine) {
    this.isLoading = true;
    const cacheKey = `attivita_promo`; // Chiave generica senza coordinate
    const cachedData = await this.storageService.getItem(cacheKey);

    if (cachedData) {
      this.elencoPromo = cachedData; // Usa i dati dalla cache
      this.isLoading = false;
    } else {
      (await this.attivitaService.apiGetListaAttivitaWhitPromo(this.latitudine, this.longitudine))
        .subscribe(async (data: Attivita[]) => {
          this.elencoPromo = data;
          await this.storageService.setItem(cacheKey, data, 60); // Salva in cache per 1 minuto
          this.isLoading = false;
        });
    }
  }
}

  getImmaginePrincipale(attivita: Attivita): string {
    const immaginePrincipale = attivita.immagini?.find(img => (img.isImmaginePrincipale && img.isVerificata)||img.isImmaginePrincipaleTemp);
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
    this.ricercaAttivitaEvent.emit(TipoRicercaAttivita.AttivitaConPromo);
  }
}
