/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';
@Component({
  selector: 'app-elenco-promo',
  templateUrl: './elenco-promo.component.html',
  styleUrls: ['./elenco-promo.component.scss'],
})
export class ElencoPromoComponent implements OnInit{

  @Input() latitudine:number | undefined;
  @Input() longitudine:number | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() ricercaAttivitaEvent = new EventEmitter<number>();
  elencoPromo: Attivita[] | undefined;
  isLoading: boolean = false;

  constructor(private attivitaService: GetApiAttivitaService,
              private storageService: StorageService) { }

  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
  if (this.latitudine && this.longitudine) {
    this.isLoading = true;
    const cacheKey = `attivita_promo`;
    const cachedData = await this.storageService.getItem(cacheKey);

    if (cachedData) {
      this.elencoPromo = cachedData; // Usa i dati dalla cache
      this.isLoading = false;
    } else {
      (await this.attivitaService.apiGetListaAttivitaWhitPromo(this.latitudine, this.longitudine, true))
        .subscribe(async (data: Attivita[]) => {
          this.elencoPromo = data;
          await this.storageService.setItem(cacheKey, data, 120);
          this.isLoading = false;
        });
    }
  }
  }

  VisualizzaAttivita(attivita: Attivita): void {
    this.attivitaSelezionataEvent.emit(attivita);
  }

  RicercaAttivitaEvent(){
    this.ricercaAttivitaEvent.emit(TipoRicercaAttivita.AttivitaConPromo);
  }
}
