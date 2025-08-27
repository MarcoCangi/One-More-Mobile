/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';

@Component({
  selector: 'app-elenco-consigli',
  templateUrl: './elenco-consigli.component.html',
  styleUrls: ['./elenco-consigli.component.scss'],
})
export class ElencoConsigliComponent {

  @Input() latitudine:number | undefined;
  @Input() longitudine:number | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() ricercaAttivitaEvent = new EventEmitter<number>();
  listaElencoNuove : Attivita[] | undefined;
  isLoading: boolean = false;
  
  constructor(private attivitaService: GetApiAttivitaService,
              private storageService: StorageService) {}

  ngOnInit(): void {
      this.loadData();
    }

  async loadData() {
      if (this.latitudine && this.longitudine) {
        this.isLoading = true;
        const cacheKey = `attivita_vicini`; // Chiave generica senza coordinate
        const cachedData = await this.storageService.getItem(cacheKey);
    
        if (cachedData) {
          this.listaElencoNuove = cachedData;
          this.isLoading = false;
        } else {
          (await this.attivitaService.apiGetListaAttivitaJustSigned(this.latitudine, this.longitudine, true))
            .subscribe(async (data: Attivita[]) => {
              this.listaElencoNuove = data;
              await this.storageService.setItem(cacheKey, data, 240); 
              this.isLoading = false;
            });
        }
      }
  }

  VisualizzaAttivita(attivita: Attivita): void {
    this.attivitaSelezionataEvent.emit(attivita);
  }

  RicercaAttivitaEvent(){
    this.ricercaAttivitaEvent.emit(TipoRicercaAttivita.AttivitaNuove);
  }
}
