import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserSession, Utente } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {

  hide = true;
  utente : Utente | undefined;
  userSession : UserSession | undefined;
  @Input() email:any;
  @Output() openPageEvent = new EventEmitter<number>();
  @Output() setIdFooterEvent = new EventEmitter<number>();


  constructor(private authService: AuthService,
              private storageService: StorageService) {}

  LogOut(): void {
    this.authService.logOut(); 
    this.authService.deleteUserSession();
    this.storageService.clearAll();
    this.openPageEvent.emit(1);
    this.setIdFooterEvent.emit(undefined);
  }

  Annulla(): void {
    this.openPageEvent.emit(1);
  }

}
