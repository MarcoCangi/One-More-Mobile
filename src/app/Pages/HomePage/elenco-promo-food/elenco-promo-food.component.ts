import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Attivita, AttivitaWithPromos } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-elenco-promo-food',
  templateUrl: './elenco-promo-food.component.html',
  styleUrls: ['./elenco-promo-food.component.scss'],
})
export class ElencoPromoFoodComponent  implements OnInit {

  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;
  @ViewChild('titleContent') titleContent: ElementRef | undefined;

  @Input() latitudine:number | undefined;
  @Input() longitudine:number | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() ricercaAttivitaEvent = new EventEmitter<number>();
  attivitaSelezionata: Attivita | undefined;
  elencoAttivita: Attivita[] | undefined;
  isLoading: boolean = false;

  constructor(private attivitaService: GetApiAttivitaService,
              private storageService: StorageService) { }

  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
   if (this.latitudine && this.longitudine) {
    this.isLoading = true;
    // const cacheKey = `attivita_promofood`;
    // const cachedData = await this.storageService.getItem(cacheKey);

    // if (cachedData) {
    //   this.elencoAttivita = cachedData; // Usa i dati dalla cache
    //   this.isLoading = false;
    // } else {
    //   (await this.attivitaService.apiGetListaAttivitaFoodDrinkPromo(this.latitudine, this.longitudine, 1, true))
    //     .subscribe(async (data: Attivita[]) => {
    //       this.elencoAttivita = data;
    //       await this.storageService.setItem(cacheKey, data, 120);
    //       this.isLoading = false;
    //     });
    // }

    const observable = await this.attivitaService.apiGetListaAttivitaFoodDrinkPromo(
  this.latitudine,
  this.longitudine,
  1,
  true
);

this.elencoAttivita = await firstValueFrom(observable);
this.isLoading = false;

    console.log('Dati ricevuti da API:', this.elencoAttivita);
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
    this.attivitaSelezionata.isPromoPresente = true;
    if(this.attivitaSelezionata)
      this.attivitaSelezionataEvent.emit(this.attivitaSelezionata);
  }

  RicercaAttivitaEvent(){
    this.ricercaAttivitaEvent.emit(TipoRicercaAttivita.AttivitaConPromo);
  }

  has2X1Tipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 1) ?? false;
  }

  has3X2Tipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 2) ?? false;
  }

  hasOmaggiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 3) ?? false;
  }

  hasPacchettiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 4) ?? false;
  }

  hasScontiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 5) ?? false;
  }

  hasPerBambiniTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 6) ?? false;
  }

  hasPerFamiglieTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 7) ?? false;
  }

  hasPerCoppieTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 8) ?? false;
  }

  hasVeganiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 9) ?? false;
  }

  hasVegetarianiTipologia(promo: Promo): boolean {
    return promo.listaTipologie?.some(t => t.codTipologia === 1) ?? false;
  }

}
