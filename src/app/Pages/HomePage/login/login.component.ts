import { AuthService } from 'src/app/Services/Auth/auth.service';
import { RegistrazioneComponent } from './../registrazione/registrazione.component';
import { Component, Input, Output, OnInit, ViewChild, inject, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Utente, UserSession} from '../../../EntityInterface/Utente'
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFireBaseErrorMessage } from '../../../Utilities/auth-error'
import { FirebaseError } from 'firebase/app';
import { firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  homeForm : FormGroup;
  hide = true;
  utente : Utente | undefined;
  userSession : UserSession | undefined;
  errore = '';
  notificaInvio = '';
  isLoading : boolean | undefined;
  @Input() email:any;
  @Output() closeLoginEvent = new EventEmitter<void>();
  @Output() openRegisterEvent = new EventEmitter<void>();

  constructor(private afAuth: AngularFireAuth, private authService: AuthService) {
    this.homeForm = new FormGroup({
      emailLogin: new FormControl('', [Validators.required, Validators.email]),
      passwordLogin: new FormControl('', Validators.required)
    });
  }

  async Login(){
    this.isLoading = true;
    if (this.homeForm.valid)
    {
      const email = this.homeForm.value.emailLogin;
      const password = this.homeForm.value.passwordLogin;
      try {
        const { userCredential, token } = await this.authService.login(email, password);
        if(userCredential){

          const docData = await this.authService.getCurrentUser(userCredential.user.uid)

          const { user: { uid } } = userCredential;
          const currentDate = new Date();

          this.utente = {
            id: 0,
            uid: uid,
            displayName: docData?.displayName,
            email: email ? email : '',
            ipAddress: '',
            isEmailLogin: true,
            isGoogleLogin: false,
            isFacebookLogin: false,
            registrationDate: undefined,
            lastLoginDate: undefined,
            errore: ''
          };
          const response = await firstValueFrom(this.authService.apiCheckUtenteByProvider(this.utente));
          if (!response.utente.errore) {
            this.authService.createUserSession(this.utente.email?? '', this.utente.uid, token, response.idAttivita, response.userId, docData?.photoURL ? docData.photoURL : '', 1, docData?.displayName ? docData.displayName : '', docData?.nome ? docData.nome : '', docData?.cognome ? docData.cognome : '');
            
            this.isLoading = false;
            this.closeLoginEvent.emit();
          } else {
            this.errore = response.utente.errore;
          }
        }
        
        this.homeForm.reset();
        this.isLoading = false;
      } 
      catch(error:any) {
        console.log(error.message);
        this.errore = getFireBaseErrorMessage(error);
        this.isLoading = false;
      }
    }
  }
    
  async resetPassword(){
    this.isLoading = true;
    const email = this.homeForm.value.emailLogin;
    if(email){
      try{
        this.isLoading = true;
        await this.authService.passwordReset(email);
        this.notificaInvio = "Controlla la tua mail per reimpostare la password"
      }
      catch(err: any){
        this.errore = getFireBaseErrorMessage(err);
      }
      finally{
        this.isLoading = false;
      }
    }
    else{
      this.errore = "inserire la mail per richiedere una nuova password";
      this.isLoading = false;
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    try {
      const newUser = await this.authService.GoogleLogIn();
      if (newUser) {
        await this.authService.addUser(newUser);
        const currentDate = new Date();
        this.utente = {
          id: 0,
          uid: newUser.uid,
          displayName: newUser.displayName,
          email: newUser.email ? newUser.email : '',
          ipAddress: '',
          isEmailLogin: false,
          isGoogleLogin: true,
          isFacebookLogin: false,
          registrationDate: undefined,
          lastLoginDate: undefined,
          errore: ''
        };
  
        const response = await firstValueFrom(this.authService.apiCheckUtenteByProvider(this.utente));
        if (!response.utente.errore) {
          this.authService.createUserSession(newUser.email ? newUser.email : '', newUser.uid, newUser.token ? newUser.token : '', response.idAttivita, response.userId, newUser.photoURL ? newUser.photoURL : '', 2, newUser.displayName ? newUser.displayName : '', '', '');
          this.isLoading = false;
          this.closeLoginEvent.emit();
        } else {
          console.log(response.utente.errore);
        }
      }
    } catch (error: any) {
      this.isLoading = false;
      this.errore = getFireBaseErrorMessage(error);
    }
  }

  async signInWithFacebook() {
    this.isLoading = true;
    try {
      const newUser = await this.authService.FacebookLogIn();
      if (newUser) {
        await this.authService.addUser(newUser);
        const currentDate = new Date();
        this.utente = {
          id: 0,
          uid: newUser.uid,
          displayName: newUser.displayName,
          email: newUser.email ? newUser.email : '',
          ipAddress: '',
          isEmailLogin: false,
          isGoogleLogin: false,
          isFacebookLogin: true,
          registrationDate: undefined,
          lastLoginDate: undefined,
          errore: ''
        };
  
        const response = await firstValueFrom(this.authService.apiCheckUtenteByProvider(this.utente));
        if (!response.utente.errore) {
          this.authService.createUserSession(newUser.email ? newUser.email : '', newUser.uid, newUser.token ? newUser.token : '', response.idAttivita, response.userId, newUser.photoURL ? newUser.photoURL : '', 3, newUser.displayName ? newUser.displayName : '', '', '');
          this.isLoading = false;
          this.closeLoginEvent.emit();
        } else {
          console.log(response.utente.errore);
        }
      }
    } catch (error: any) {
      this.isLoading = false;
      this.errore = getFireBaseErrorMessage(error);
    }
  }

  closeLogin(){
    this.closeLoginEvent.emit();
  }

  openRegister(){
    this.openRegisterEvent.emit();
  }
}
