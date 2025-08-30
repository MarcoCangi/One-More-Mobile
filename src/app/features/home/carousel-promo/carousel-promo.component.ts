import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Promo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Promo';
import { TipoRicercaAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/Enum/TipoRicercaAttivita';
import { CarouselPromoType } from './carousel-promo-type';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-carousel-promo',
  templateUrl: './carousel-promo.component.html',
  styleUrls: ['./carousel-promo.component.scss'],
})
export class CarouselPromoComponent implements OnInit {

  CarouselPromoType = CarouselPromoType;
  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;
  @ViewChild('titleContent') titleContent: ElementRef | undefined;

  @Input() latitudine: number | undefined;
  @Input() longitudine: number | undefined;
  @Input() idSoggetto: number | undefined;
  @Input() type: CarouselPromoType | undefined;


  elencoAttivita: Attivita[] | undefined;
  attivitaSelezionata: Attivita | undefined;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() ricercaAttivitaEvent = new EventEmitter<number>();
  isLoading: boolean = false;

  constructor(private attivitaService: GetApiAttivitaService) { }

  async ngOnInit() {

    if (this.latitudine && this.longitudine) {
      switch (this.type) {
        case CarouselPromoType.food:
          (await this.attivitaService.apiGetListaAttivitaFoodDrinkPromo(this.latitudine, this.longitudine, 1, true))
            .subscribe(async (data: Attivita[]) => { this.elencoAttivita = data; });
          break;
        case CarouselPromoType.drink:
          (await this.attivitaService.apiGetListaAttivitaFoodDrinkPromo(this.latitudine, this.longitudine, 2, true))
            .subscribe(async (data: Attivita[]) => { this.elencoAttivita = data; });
          break;
        case CarouselPromoType.recentviewed:
          if (this.idSoggetto) {
            (await this.attivitaService.apiGetListaAttivitaRecentView(this.idSoggetto))
              .subscribe(async (data: Attivita[]) => {this.elencoAttivita = data; });
          }
          break;
        default:
          console.warn("CarouselPromoComponent richiamato per type non atteso: " + this.type);
          break;
      }
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
    if (this.attivitaSelezionata)
      this.attivitaSelezionataEvent.emit(this.attivitaSelezionata);
  }

  RicercaAttivitaEvent() {
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
