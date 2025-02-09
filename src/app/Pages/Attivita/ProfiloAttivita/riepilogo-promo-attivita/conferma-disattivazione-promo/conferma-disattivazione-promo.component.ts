import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';

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
  constructor(private promoService: GetApiPromoService) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  Disattiva(): void {
    this.isLoading = true;
    this.isDisattivata = false;
    if (this.idPromo != null && this.idPromo > 0 && this.idAttivita != null && this.idAttivita) {
      this.promoService.apiDeletePromoByIdPromo(this.idPromo, this.idAttivita).subscribe(
        () => {
          this.isLoading = false;
          this.isDisattivata = true;
          this.dismissDisattivazioneEvent.emit();
        },
        (error) => {
          this.isLoading = false;
          console.error('Errore durante la disattivazione della promo:', error);
        }
      );
    }
  }

  Annulla(){
    this.dismissDisattivazioneEvent.emit();
  }
}
