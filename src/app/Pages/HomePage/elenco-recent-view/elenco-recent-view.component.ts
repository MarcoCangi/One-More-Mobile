import { Component, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';

@Component({
  selector: 'app-elenco-recent-view',
  templateUrl: './elenco-recent-view.component.html',
  styleUrls: ['./elenco-recent-view.component.scss'],
})
export class ElencoRecentViewComponent {

  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;
  @ViewChild('titleContent') titleContent: ElementRef | undefined;
  @Output() ricercaAttivitaEvent = new EventEmitter<number>();
  @Input() latitudine:number | undefined;
  @Input() longitudine:number | undefined;
  @Input() idSoggetto: number | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  attivitaSelezionata: Attivita | undefined;
  elencoAtt: Attivita[] | undefined;
  isLoading: boolean = false;

   constructor(private attivitaService: GetApiAttivitaService,
               private storageService: StorageService) { }
  
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
      this.loadData();
  }

  async loadData() {
    if (this.latitudine && this.longitudine && this.idSoggetto) {
      this.isLoading = true;
      const cacheKey = `attivita_recent_view`;
      const cachedData = await this.storageService.getItem(cacheKey);
  
      if (cachedData) {
        this.elencoAtt = cachedData;
        this.isLoading = false;
      } else {
        (await this.attivitaService.apiGetListaAttivitaRecentView(this.idSoggetto))
          .subscribe(async (data: Attivita[]) => {
            this.elencoAtt = data;
            await this.storageService.setItem(cacheKey, data, 8640000); 
            this.isLoading = false;
          });
      }
    }
  }


  getImmaginePrincipale(attivita: Attivita): string {
    const immaginePrincipale = attivita.immagini?.find(img => (img.isImmaginePrincipale && img.isVerificata) || img.isImmaginePrincipaleTemp);
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
    this.ricercaAttivitaEvent.emit(TipoRicercaAttivita.AttivitaVicine);
  }

}
