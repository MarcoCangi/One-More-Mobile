import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

@Component({
  selector: 'app-esito-gestione-promo',
  templateUrl: './esito-gestione-promo.component.html',
  styleUrls: ['./esito-gestione-promo.component.scss'],
})
export class EsitoGestionePromoComponent  implements OnInit {

    @Input() isEsitoOK : boolean = false;
    @Input() isSaved : boolean = false;
    @Output() CloseConfirmEvent = new EventEmitter<void>();

  constructor(private authService : AuthService,
              private localStorage: StorageService) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  async confirmAndClose(){
    await this.localStorage.setItem(`isSavedUpdatePromo`, true);
    this.authService.setIsShowedSplashFalse();
    location.reload();
  }

  async back(){
    this.CloseConfirmEvent.emit();
  }

}
