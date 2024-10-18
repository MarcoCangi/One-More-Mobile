import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/auth';
import { getFireBaseErrorMessage } from '../../../Utilities/auth-error'
import { firstValueFrom, of } from 'rxjs';
import { UserSession, Utente } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { MessagingService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/MessagingService';

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

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private messagingService: MessagingService) {
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
            errore: '',
            fcmToken :''
          };

          if(this.utente){
            const token = await this.messagingService.requestPermission();
            if (token){
              this.utente.fcmToken = token;
            }
          }

          console.log(this.utente.fcmToken);

          const response = await firstValueFrom(this.authService.apiCheckUtenteByProvider(this.utente));
          if (!response.utente.errore) {
            this.authService.createUserSession(this.utente.email?? '', this.utente.uid?? '', token, response.idAttivita, response.userId, docData?.photoURL ? docData.photoURL : '', 1, docData?.displayName ? docData.displayName : '', docData?.nome ? docData.nome : '', docData?.cognome ? docData.cognome : '');
            
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
        this.errore = getFireBaseErrorMessage(error);
        this.isLoading = false;
      }
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
          errore: '',
          fcmToken: ''
        };

        if(this.utente){
          const token = await this.messagingService.requestPermission();
          if (token){
            this.utente.fcmToken = token;
          }
        }

        console.log(this.utente.fcmToken);
  
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
          errore: '',
          fcmToken:'',
        };

        if(this.utente){
          const token = await this.messagingService.requestPermission();
          if (token){
            this.utente.fcmToken = token;
          }
        }

        console.log(this.utente.fcmToken);
  
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

  async resetPassword(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.errore = "";
    this.isLoading = true;
    const email = this.homeForm.value.emailLogin;
    if(email){
      try{
        if (!emailRegex.test(email)) {
          this.errore = "Inserire una mail valida per richiedere il reset della password";
          this.isLoading = false;
          return;
        }
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
      this.errore = "Inserire una mail valida per richiedere il reset della password";
    }
    this.isLoading = false;
  }

  closeLogin(){
    this.closeLoginEvent.emit();
  }

  openRegister(){
    this.openRegisterEvent.emit();
  }
}
