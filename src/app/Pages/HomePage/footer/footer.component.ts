/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  @Output() openPageEvent = new EventEmitter<number>();
  @Input()idSoggetto: number | undefined;

  constructor( private authService: AuthService) { }

  ngOnInit() {
    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && userSession.idSoggetto && userSession.idSoggetto > 0) {
      this.idSoggetto = userSession.idSoggetto;
    } else {
      this.idSoggetto = 0;
    }
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }
}
