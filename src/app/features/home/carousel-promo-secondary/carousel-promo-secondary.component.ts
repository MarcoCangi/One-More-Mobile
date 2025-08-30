import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { CarouselPromoType } from '../carousel-promo/carousel-promo-type';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-secondary-carousel-promo',
  templateUrl: './carousel-promo-secondary.component.html',
  styleUrls: ['./carousel-promo-secondary.component.scss'],
})
export class CarouselPromoComponentSecondary implements OnInit {

  CarouselPromoType = CarouselPromoType;
  @Output() attivitaSelezionataEvent = new EventEmitter<Attivita>();
  @Input() type: CarouselPromoType | undefined;
  @Input() latitudine: number | undefined;
  @Input() longitudine: number | undefined;
  attivitaSelezionata: Attivita | undefined;
  elencoAttivita: Attivita[] | undefined;

  constructor(private attivitaService: GetApiAttivitaService) { }

  async ngOnInit() {

    if (this.latitudine && this.longitudine) {

      switch (this.type) {
        case CarouselPromoType.vicini:
          (await this.attivitaService.apiGetListaAttivitaNear(this.latitudine, this.longitudine, true))
            .subscribe(async (data: Attivita[]) => { console.log("vicini" + data); this.elencoAttivita = data; });
          break;
        case CarouselPromoType.promo:
          (await this.attivitaService.apiGetListaAttivitaWhitPromo(this.latitudine, this.longitudine, true))
            .subscribe(async (data: Attivita[]) => { console.log("promo" + data); this.elencoAttivita = data; });
          break;
        case CarouselPromoType.consigli:
          (await this.attivitaService.apiGetListaAttivitaJustSigned(this.latitudine, this.longitudine, true))
            .subscribe(async (data: Attivita[]) => { console.log("nuove" + data); this.elencoAttivita = data; });
          break;
        default:
          console.warn("SecondaryCarouselPromoComponent richiamato per type non atteso: " + this.type);
          break;
      }
    }
  }

  VisualizzaAttivita(attivita: Attivita): void {
    this.attivitaSelezionata = attivita;
    if (this.attivitaSelezionata)
      this.attivitaSelezionataEvent.emit(this.attivitaSelezionata);
  }

  getImmaginePrincipale(attivita: Attivita): string {
    const immaginePrincipale = attivita.immagini?.find(img => (img.isImmaginePrincipale && img.isVerificata) || img.isImmaginePrincipaleTemp);
    if (immaginePrincipale && immaginePrincipale.upload) {
      return immaginePrincipale.upload; // Restituisci l'URL dell'immagine principale
    } else {
      return 'URL_IMMAGINE_FALLBACK';
    }
  }
}
