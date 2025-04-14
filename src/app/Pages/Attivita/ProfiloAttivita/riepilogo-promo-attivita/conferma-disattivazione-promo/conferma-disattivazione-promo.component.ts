import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { firstValueFrom } from 'rxjs';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

@Component({
  selector: 'app-conferma-disattivazione-promo',
  templateUrl: './conferma-disattivazione-promo.component.html',
  styleUrls: ['./conferma-disattivazione-promo.component.scss'],
})
export class ConfermaDisattivazionePromoComponent  implements OnInit {

  @Input() idPromo : number | undefined;
  @Input() idAttivita : number | undefined;
  @Input() couponRichiesti : number | undefined;
  @Output() dismissDisattivazioneEvent = new EventEmitter<void>();
  isLoading! : boolean;
  isDisattivata! : boolean;
  constructor(private promoService: GetApiPromoService,
              private localStorage: StorageService
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  async Disattiva(): Promise<void> {
    this.isLoading = true;
    this.isDisattivata = false;
  
    if ((this.idPromo ?? 0) > 0 && (this.idAttivita ?? 0) > 0) {
      try {
        await this.localStorage.removeItem(`attivita_promo`);
  
        await this.promoService.apiDeletePromoByIdPromo(this.idPromo, this.idAttivita);

        this.isLoading = false;
        this.isDisattivata = true;
        this.dismissDisattivazioneEvent.emit();
  
      } catch (error) {
        this.isLoading = false;
        console.error('Errore durante la disattivazione della promo:', error);
      }
    } else {
      this.isLoading = false;
      console.warn('Id promo o id attività non validi');
    }
  }

  Annulla(){
    this.dismissDisattivazioneEvent.emit();
  }
}
