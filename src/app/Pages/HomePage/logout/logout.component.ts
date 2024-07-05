import { AuthService } from 'src/app/Services/Auth/auth.service';
import { RegistrazioneComponent } from './../registrazione/registrazione.component';
import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Utente, UserSession } from '../../../EntityInterface/Utente';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

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


  constructor(private authService: AuthService) {}

  LogOut(): void {
    this.authService.logOut(); 
    this.authService.deleteUserSession();
    this.openPageEvent.emit(1);
    this.setIdFooterEvent.emit(undefined);
  }

  Annulla(): void {
    this.openPageEvent.emit(1);
  }

}
