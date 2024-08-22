import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { getFireBaseErrorMessage } from '../../Utilities/auth-error'
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent  implements OnInit {
  
  constructor(private authService: AuthService, private cd: ChangeDetectorRef, private el: ElementRef) {
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
  ngOnInit(): void {
    this.user = this.authService.getUserSessionFromCookie();
    }

  OpenModalModificaPassword(){
    this.isModificaPassword = true;
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
    this.isLoading = true;
    const email = this.user?.email;
    if(email){
      try{
        this.isLoading = true;
        await this.authService.passwordReset(email);
        this.notificaInvio = "Controlla la tua mail per reimpostare la password";
        this.errore = "";
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

  onReasonSelected() {
    this.selectedReason = ''
  }

  async eliminaAccount() {
    this.isLoading = true;
    console.log('log 1')
    try {

      const utente = this.authService.getUser(); // Ottieni l'utente attuale
      console.log(utente)
      // Elimina l'account da Firebase
      await this.authService.deleteUserAccount(); // Assicurati che questo metodo elimini l'account da Firebase
      
      this.authService.deleteUserSession();
      console.log('log 3')
      // Chiama l'API per eliminare l'account
      await this.authService.apiDeleteUtente(utente, this.selectedReason).toPromise();

      this.isLoading = false;
      this.DimsissModalEliminaAccount();

    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'account:', error);
      this.isLoading = false;
    }
  }



  async onSubmit(){
    this.isLoading = true;
    if (this.formRegistrazione.valid){
      if(!this.formRegistrazione.value.vecchiaPassword){
        this.errore = "inserire la vecchia password";
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(!this.formRegistrazione.value.newPasswordRegistrazione){
        this.errore = "Inserire la nuova password";
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(!this.formRegistrazione.value.ConfermaNewPasswordRegistrazione){
        this.errore = "Confermare la nuova password";
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(this.formRegistrazione.value.newPasswordRegistrazione != this.formRegistrazione.value.ConfermaNewPasswordRegistrazione){
        this.errore = "Le password non coincidono";
        this.notificaInvio = "";
        this.isLoading = false;
        return;
      }
      if(this.formRegistrazione.value.newPasswordRegistrazione == this.formRegistrazione.value.vecchiaPassword){
        this.errore = "La nuova password non può essere uguale a quella vecchia";
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
            this.notificaInvio = "Password modificata con successo!";
            this.errore = "";
            } else {
              this.errore = "Errore utente non autenticato.";
              this.notificaInvio = "";
            }
        } catch (err: any) {
          this.errore = getFireBaseErrorMessage(err);
          this.errore = "Errore utente non autenticato.";
          this.notificaInvio = "";
        } finally {
          this.isLoading = false;
        }
      } else {
        this.errore = "Compila correttamente tutti i campi.";
        this.notificaInvio = "";
        this.isLoading = false;
      }
    }
  };
}
