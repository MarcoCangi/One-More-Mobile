import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, ValidationErrors, Validators} from '@angular/forms';
import { getFireBaseErrorMessage } from '../../../Utilities/auth-error';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { Utente } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { sendEmailVerification } from 'firebase/auth';
import { MessagingService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/MessagingService';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.scss'],
})
export class RegistrazioneComponent {

  utente : Utente | undefined;
  formRegistrazione : FormGroup;
  hide = true;
  isLoading : boolean | undefined;
  @Input() email:any;
  correntDate = new Date();
  errore = '';
  minPw = 8;
  isRegistered : boolean = false;
  passwordsDoNotMatch: boolean = false;
  esitoResendVerification: string | undefined;
  @Output() closeRegisterEvent = new EventEmitter<void>();

  constructor(private authService: AuthService, private cd: ChangeDetectorRef, private el: ElementRef, private messagingService: MessagingService) {
    this.formRegistrazione = new FormGroup({
      emailRegistrazione: new FormControl('', [Validators.required, Validators.email]),
      passwordRegistrazione: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15),this.customPasswordValidator()]),
      ConfermaPasswordRegistrazione: new FormControl('', Validators.required),
      nomeRegistrazione: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])),
      cognomeRegistrazione: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)]))
    }, {validators: this.passwordMatchValidator});
  }

  get password() { return this.formRegistrazione.get('passwordRegistrazione'); }
  get password2() { return this.formRegistrazione.get('ConfermaPasswordRegistrazione'); }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('passwordRegistrazione')?.value;
    const confirmPassword = control.get('ConfermaPasswordRegistrazione')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onPasswordInput() {
    const password = this.formRegistrazione.get('passwordRegistrazione')?.value;
    const confirmPassword = this.formRegistrazione.get('ConfermaPasswordRegistrazione')?.value;
    
    if (confirmPassword && password !== confirmPassword) {
      this.passwordsDoNotMatch = true;
    } else {
      this.passwordsDoNotMatch = false;
    }
    
    this.formRegistrazione.get('ConfermaPasswordRegistrazione')?.updateValueAndValidity();
  }

  customPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const hasUpperCase = /[A-Z]/.test(password); // Verifica presenza di lettera maiuscola
      const hasNumber = /\d/.test(password); // Verifica presenza di numero
  
      if (!hasUpperCase || !hasNumber) {
        return {
          passwordRequirements: true // Password non rispetta i requisiti
        };
      }
  
      return null; // Password valida
    };
  }

  async onSubmit(){
    this.isLoading = true;
    
    if (this.formRegistrazione.valid){

      if(!this.formRegistrazione.value.passwordRegistrazione){
        this.errore = "inserire una password";
        this.updateLabelVisibility();
      };
      if(!this.formRegistrazione.value.ConfermaPasswordRegistrazione){
        this.errore = "Confermare la password";
        this.updateLabelVisibility();
      }
      if(this.formRegistrazione.value.passwordRegistrazione != this.formRegistrazione.value.ConfermaPasswordRegistrazione){
        this.errore = "Le password non coincidono";
        this.updateLabelVisibility();
      }

      try{
        const email = this.formRegistrazione.value.emailRegistrazione;
        const nome = this.formRegistrazione.value.nomeRegistrazione;
        const cognome = this.formRegistrazione.value.cognomeRegistrazione;
        const displayName = nome + ' ' + cognome;
        const currentDate = new Date();
        const id = 0;

        const { userCredential, token } = await this.authService.signUp(this.formRegistrazione.value.emailRegistrazione, this.formRegistrazione.value.passwordRegistrazione);
        const { user: { uid } } = userCredential;

        await sendEmailVerification(userCredential.user);

        await this.authService.addUser({uid, displayName, email, nome, cognome});

        this.utente = {
          id: id,
          uid : uid,
          displayName : displayName,
          email: email,
          ipAddress: '',
          isEmailLogin : true,
          isGoogleLogin : false,
          isFacebookLogin : false,
          registrationDate: undefined,
          lastLoginDate: undefined,
          errore:'',
          fcmToken: ''
        };

        if(this.utente){
          const token = await this.messagingService.getFCMToken();
          if (token){
            this.utente.fcmToken = token;
          }
        }
        
        this.authService.apiInsertNewUtente(this.utente).pipe(
          tap((response) =>
          {
            if(!response.utente.errore)
            {
              this.authService.createUserSession(email? email : '', uid, token, response.idAttivita, response.utente.id, '', 1, displayName, nome, cognome);
              this.isLoading = false;
              this.isRegistered = true;
            }
            else{
              console.log(response.utente.errore)
          }
          }),
          catchError((error) => {
            this.isLoading = false;
              this.errore = error.error;
              this.updateLabelVisibility();
            return of(null);
          })
        ).subscribe();

        // Notifica l'utente che deve verificare la sua email
        this.errore = "Registrazione completata. Controlla la tua email per verificare l'account.";
        this.updateLabelVisibility();
      }
      catch(error: any)
      {
        this.errore = getFireBaseErrorMessage(error);
        this.updateLabelVisibility();
        this.isLoading = false;
      }
    }
  };

  async signInWithGoogle(){
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
          const token = await this.messagingService.getFCMToken();
          if (token){
            this.utente.fcmToken = token;
          }
        }
  
        const response = await firstValueFrom(this.authService.apiCheckUtenteByProvider(this.utente));
        if (!response.utente.errore) {
          this.authService.createUserSession(newUser.email ? newUser.email : '', newUser.uid, newUser.token ? newUser.token : '', response.idAttivita, response.userId, newUser.photoURL ? newUser.photoURL : '', 2, newUser.displayName ? newUser.displayName : '', '', '');
          this.isLoading = false;
          this.closeRegisterEvent.emit();
        } else {
          console.log(response.utente.errore);
        }
      }
    } catch (error: any) {
      this.isLoading = false;
      this.errore = getFireBaseErrorMessage(error);
    }
  }

  async signInWithFacebook(){
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
          fcmToken: ''
        };

        if(this.utente){
          const token = await this.messagingService.getFCMToken();
          if (token){
            this.utente.fcmToken = token;
          }
        }
  
        const response = await firstValueFrom(this.authService.apiCheckUtenteByProvider(this.utente));
        if (!response.utente.errore) {
          this.authService.createUserSession(newUser.email ? newUser.email : '', newUser.uid, newUser.token ? newUser.token : '', response.idAttivita, response.userId, newUser.photoURL ? newUser.photoURL : '', 3, newUser.displayName ? newUser.displayName : '', '', '');
          this.isLoading = false;
          this.closeRegisterEvent.emit();
        } else {
          console.log(response.utente.errore);
        }
      }
    } catch (error: any) {
      this.isLoading = false;
      this.errore = getFireBaseErrorMessage(error);
    }
  }

  private updateLabelVisibility() {
    const lblEmailPresente: HTMLElement = this.el.nativeElement.querySelector('#lblEmailPresente');
    if (lblEmailPresente) {
      lblEmailPresente.style.visibility = this.errore ? 'visible' : 'hidden';
      this.cd.detectChanges();
    }
  }

  closeRegister(){
    this.closeRegisterEvent.emit();
  }

  async resendVerificationEmail(){
    this.esitoResendVerification = await this.authService.resendVerificationEmail();
  }

}
