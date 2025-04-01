import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { getFireBaseErrorMessage } from '../../Utilities/auth-error'
import { asyncValidator } from 'src/app/Utilities/asyncValidator';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent  implements OnInit {
  
  constructor(private authService: AuthService, private cd: ChangeDetectorRef, private el: ElementRef, private fb: FormBuilder,private translate: TranslateService) {
    this.formRegistrazione = new FormGroup({
      vecchiaPassword: new FormControl('', [Validators.required]),
      newPasswordRegistrazione: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15),this.customPasswordValidator()]),
      ConfermaNewPasswordRegistrazione: new FormControl('', Validators.required)
    },
    {validators: this.passwordMatchValidator});
    this.formEliminazione = new FormGroup({
      vecchiaPassword: new FormControl('', [Validators.required]),
      newPasswordRegistrazione: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15),this.customPasswordValidator()]),
      ConfermaNewPasswordRegistrazione: new FormControl('', Validators.required)
    },
    {validators: this.passwordMatchValidator});
  }

  user! : UserSession | null;
  isModificaPassword : boolean = false;
  isEliminaAccount : boolean = false;
  formRegistrazione : FormGroup;
  formEliminazione : FormGroup;
  isLoading : boolean | undefined;
  notificaInvio = '';
  errore = '';
  selectedReason: string | null = null;
  isDeleted : boolean = false;
  passwordForm!: FormGroup;
  passwordEliminazione: string | undefined;
  passwordError: boolean = false;
  isVerificato: boolean = false;
  esitoResendVerification: string | undefined;
  @Output() openPageEvent = new EventEmitter<number>();

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPasswordRegistrazione')?.value;
    const confirmPassword = control.get('ConfermaNewPasswordRegistrazione')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
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

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit(): Promise<void> {
    this.user = this.authService.getUserSession();
    const userForAuth = await this.authService.getCurrentUserFromAuth();

    if((userForAuth && userForAuth?.emailVerified == true && this.user?.typeLog == 1) || (this.user?.typeLog == 2 || this.user?.typeLog == 3))
      this.isVerificato = true;

    this.passwordForm = this.fb.group({
      passwordFormControl: ['', [Validators.required]] // Aggiorna qui il nome e i validator
    });

    // Aggiungi un listener per il cambio di valore nel form control
    this.passwordForm.get('passwordFormControl')!.valueChanges.subscribe((value: string) => {
      this.emitPasswordChange(value);
    });
  }

  async eliminaAccount() {
    this.isLoading = true;
    try {
      const utente = this.authService.getUser(); // Ottieni l'utente attuale

      // Esegui la ri-autenticazione su Firebase
      if (this.passwordForm.valid && this.passwordEliminazione && utente?.email && utente?.idSoggetto && utente?.uid) {
        const isReautenticated = await this.authService.reauthenticateUser(utente.email, this.passwordEliminazione);

        if (isReautenticated) {
          // Elimina l'account da Firebase
          await this.authService.deleteUserAccount(); 

          // Elimina la sessione utente
          this.authService.deleteUserSession();

          // Chiama l'API per eliminare l'account
          await this.authService.apiDeleteUtente(utente, this.selectedReason).toPromise();

          this.isLoading = false;
          this.isDeleted = true;
          this.passwordError = false; // Reset dell'errore se tutto va bene
        } else {
          this.isLoading = false;
          this.passwordError = true; // Imposta l'errore per visualizzarlo
        }
      } else {
        this.isLoading = false;
        this.passwordError = true; // Imposta l'errore se la password è vuota o non valida
      }
    } catch (error) {
      this.isLoading = false;
    }
  }

  hasError(errorCode: string): boolean {
    const control = this.passwordFormControl;
    return !!control && control.hasError(errorCode) && control.touched;
  }

  get passwordFormControl() {
    return this.passwordForm.get('passwordFormControl');
  }

  OpenModalModificaPassword(){
    this.isModificaPassword = true;
  }

  emitPasswordChange(value: string) {
    this.passwordEliminazione = value;
  }

  DimsissModalModificaPassword(){
    this.isModificaPassword = false;
  }

  OpenModalEliminaAccount(){
    this.isEliminaAccount = true;
  }

  DimsissModalEliminaAccount(){
    this.isEliminaAccount = false;
  }

  async resetPassword(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.errore = "";
    this.isLoading = true;
    const email = this.user?.email;
    if(email){
      try{
        if (!emailRegex.test(email)) {
          this.translate.get('ERRORS.EMAIL_FOR_RESET').subscribe((translatedText: string) => {
            this.errore = translatedText;
            this.isLoading = false;
          });
          return;
        }
        this.isLoading = true;
        await this.authService.passwordReset(email);
        this.translate.get('ERRORS.CHECK_EMAIL').subscribe((translatedText: string) => {
          this.notificaInvio = translatedText;
          this.errore = "";
        });
      }
      catch(err: any){
        this.errore = getFireBaseErrorMessage(err,this.translate);
      }
      finally{
        this.isLoading = false;
      }
    }
    else{
      this.translate.get('ERRORS.EMAIL_FOR_RESET').subscribe((translatedText: string) => {
        this.errore = translatedText;
      });
    }
    this.isLoading = false;
  }

  onReasonSelected() {
    this.selectedReason = ''
  }

  async onSubmit(){
    this.isLoading = true;
    if (this.formRegistrazione.valid){
      if(!this.formRegistrazione.value.vecchiaPassword){
        this.translate.get('ERRORS.OLD_PASSWORD').subscribe((translatedText: string) => {
          this.errore = translatedText;
        });
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(!this.formRegistrazione.value.newPasswordRegistrazione){
        this.translate.get('ERRORS.NEW_PASSWORD').subscribe((translatedText: string) => {
          this.errore = translatedText;
        });
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(!this.formRegistrazione.value.ConfermaNewPasswordRegistrazione){
        this.translate.get('ERRORS.NEW_PASSWORD_CONFIRM').subscribe((translatedText: string) => {
          this.errore = translatedText;
        });
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(this.formRegistrazione.value.newPasswordRegistrazione != this.formRegistrazione.value.ConfermaNewPasswordRegistrazione){
        this.translate.get('Passwords dont match').subscribe((translatedText: string) => {
          this.errore = translatedText;
        });
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(this.formRegistrazione.value.newPasswordRegistrazione == this.formRegistrazione.value.vecchiaPassword){
        this.translate.get('ERRORS.NEW_PASS_NOT_BE_OLD').subscribe((translatedText: string) => {
          this.errore = translatedText;
        });
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if (this.formRegistrazione.valid && this.user?.email) {
        const email = this.user.email;
        const vecchiaPassword = this.formRegistrazione.value.vecchiaPassword;
        const newPassword = this.formRegistrazione.value.newPasswordRegistrazione;
        
        try {
          // Ottieni l'utente autenticato
          const user = this.authService.getCurrentUserFromAuth();

          if(user)
          {
            // Verifica la vecchia password
            const credential = EmailAuthProvider.credential(email, vecchiaPassword);
            await reauthenticateWithCredential(user, credential);
  
            // Imposta la nuova password
            await updatePassword(user, newPassword);
            this.translate.get('MESSAGES.PASSWORD_CHANGED').subscribe((translatedText: string) => {
              this.notificaInvio = translatedText;
            });
            this.errore = "";
            } else {
              this.translate.get('ERRORS.USER_UNAUTHENTICATED').subscribe((translatedText: string) => {
                this.errore = translatedText;
              });
              this.notificaInvio = "";
            }
        } catch (err: any) {
          this.errore = getFireBaseErrorMessage(err,this.translate);
          this.translate.get('ERRORS.USER_UNAUTHENTICATED').subscribe((translatedText: string) => {
            this.errore = translatedText;
          });
          this.notificaInvio = "";
        } finally {
          this.isLoading = false;
        }
      } else {
        this.translate.get('ERRORS.FILL_FIELDS').subscribe((translatedText: string) => {
          this.errore = translatedText;
        });
        this.notificaInvio = "";
        this.isLoading = false;
      }
    }
  };

  async openPage(idPage:number){
    setTimeout(() => {
      this.DimsissModalEliminaAccount()
    }, 100);
    setTimeout(() => {
      this.openPageEvent.emit(1);
    }, 100);
  }

  async resendVerificationEmail(){
    this.esitoResendVerification = await this.authService.resendVerificationEmail();
  }
}
