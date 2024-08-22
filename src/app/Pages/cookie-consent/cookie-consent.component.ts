import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
})
export class CookieConsentComponent implements OnInit {
  cookieAccepted = false;
  @Output() closeCookiePanelEvent = new EventEmitter<void>();

  constructor(private cookieService: CookieService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.cookieAccepted = this.cookieService.check('cookieConsent');
  }

  acceptCookies() {
    this.cookieService.set('cookieConsent', 'true', 365); // Cookie valido per 1 anno
    this.cookieAccepted = true;
    this.closeCookiePanel();
  }

  declineCookies() {
    this.cookieService.set('cookieConsent', 'false', 365); // Cookie valido per 1 anno
    this.cookieAccepted = true;
    this.closeCookiePanel();
  }

  closeCookiePanel(){
    this.closeCookiePanelEvent.emit();
  }
}
