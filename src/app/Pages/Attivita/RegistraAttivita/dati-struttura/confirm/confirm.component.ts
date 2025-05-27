import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { InsertAttivitaReqDto } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';

import { catchError, lastValueFrom, of, tap } from 'rxjs';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent  implements OnInit {

  @Input() typeModal: string | undefined;
  @Input() requestAttivita: InsertAttivitaReqDto | undefined;
  isLoadingSalvataggio: boolean = false;
  isEsito: boolean = false;
  isEsitoOk: boolean = false;
  errorMessage!: string;
  countImg = 1;
  @Output() CloseEvent = new EventEmitter<void>();

  constructor(private attivitaService: GetApiAttivitaService,
              private storageService: StorageService,
              private authService: AuthService) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  async confirm(){
    this.isLoadingSalvataggio = true;

    if(this.typeModal == 'Delete'){
      await this.eliminaAttivita();
    }else if(this.typeModal == 'Edit'){
      await this.modificaAttivita();
    }else if(this.typeModal == 'Save'){
      await this.prosegui();
    }

    this.isLoadingSalvataggio = false;
  }

  close() {
    this.CloseEvent.emit();
  }

  async next() {
    await this.storageService.setItem(`isSavedUpdateAtt`, true);
    this.authService.setIsShowedSplashFalse();
    location.reload();
  }

  async prosegui() {
        const sessioneString = this.authService.getUserSession();
    
        if (sessioneString) {
          if (sessioneString.idSoggetto !== null && sessioneString.idSoggetto !== undefined && sessioneString.idSoggetto > 0 && this.requestAttivita != undefined) { 
            this.requestAttivita.idSoggetto = sessioneString.idSoggetto;
          }
          if (this.requestAttivita && this.requestAttivita.immagini != undefined && this.requestAttivita.immagini.length > 0) {
              this.requestAttivita.immagini.forEach(immagine => {
              immagine.ordinamento = this.countImg;
              this.countImg = this.countImg + 1;
            });
          }
          if (this.requestAttivita && this.requestAttivita.listaTipoAttivita && this.requestAttivita.listaTipoAttivita.length > 0) {
            this.requestAttivita.listaTipoAttivita.forEach(att => {
              if (att.codTipoAttivita) {
                att.codTipoAttivita = att.codTipoAttivita.toString().padStart(4, '0');
              }
            });
          }
          
          if (this.requestAttivita) {
            await this.insertAttivita();
          }
        }
        else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  }
  
  async modificaAttivita() {
    
        const sessioneString = this.authService.getUserSession();

        if (sessioneString) {
          if (sessioneString.idSoggetto !== null && sessioneString.idSoggetto !== undefined && sessioneString.idSoggetto > 0 && this.requestAttivita != undefined) {
            this.requestAttivita.idSoggetto = sessioneString.idSoggetto;
          }
          if (this.requestAttivita && this.requestAttivita.immagini != undefined && this.requestAttivita.immagini.length > 0) {
              this.requestAttivita.immagini.forEach(immagine => {
              immagine.ordinamento = this.countImg;
              this.countImg = this.countImg + 1;
            });
          }
          if (this.requestAttivita && this.requestAttivita.listaTipoAttivita && this.requestAttivita.listaTipoAttivita.length > 0) {
            this.requestAttivita.listaTipoAttivita.forEach(att => {
              if (att.codTipoAttivita) {
                att.codTipoAttivita = att.codTipoAttivita.toString().padStart(4, '0');
              }
            });
          }
          if (this.requestAttivita) {
            await this.updateAttivita();
          }
        }
  }

  async insertAttivita() {
    if (this.requestAttivita) {
      try {
        const response = await this.attivitaService.apiInsertAttivita(this.requestAttivita);
  
        if (response.isError) {
          this.isEsito = true;
          this.isEsitoOk = false;
          this.errorMessage = response.errorMessage;
          return;
        }
  
        if (response.idAttivita) {
          this.authService.setIdAttivitaUserSession(response.idAttivita);
          this.storageService.removeItem('lista_attivita');
          this.isEsito = true;
          this.isEsitoOk = true;
        } else {
          this.isEsito = true;
          this.isEsitoOk = false;
        }
      } catch (error: any) {
        console.error(error?.error || error);
        this.isEsito = true;
        this.isEsitoOk = false;
      }
    }

    this.isEsito = true;
    this.isEsitoOk = true;
  }
  

  async updateAttivita() {
    if (this.requestAttivita) {
      try {
        const response = await this.attivitaService.apiUpdateAttivita(this.requestAttivita);
  
        const cacheKey = `lista_attivita`;
        const cacheKeyAtt = `attivita_${this.requestAttivita.idAttivita}`;
        this.storageService.removeItem(cacheKey);
        this.storageService.removeItem(cacheKeyAtt);
  
        this.isEsito = true;
        this.isEsitoOk = true;
      } catch (error: any) {
        this.isEsito = true;
        this.isEsitoOk = false;
      }
    }
    
    this.isEsito = true;
    this.isEsitoOk = true;
  }
  

  async eliminaAttivita() {
        try {
          const utente = this.authService.getUser(); // Ottieni l'utente attuale
    
          await this.attivitaService.deleteSession();
          
          if(this.requestAttivita && this.requestAttivita.idAttivita && utente?.idSoggetto)
          {
            await this.attivitaService.apiDeleteAttivita(this.requestAttivita?.idAttivita, utente?.idSoggetto).toPromise();
            
            const sessioneString = this.authService.getUserSession();
    
            if(sessioneString && sessioneString.idAttivita)
            {
              sessioneString.idAttivita = 0;
              this.authService.saveUserSession(sessioneString);
            }
            this.isEsito = true;
            this.isEsitoOk = true;
            const cacheKey = `lista_attivita`;
            const cacheKeyAtt = `attivita_${this.requestAttivita?.idAttivita}`; // Chiave generica per la cache
            this.storageService.removeItem(cacheKey); //svuoto la cache con la vecchia lista delle attività
            this.storageService.removeItem(cacheKeyAtt) //rimuovo dalla cache l'attività modificata
          }
    
        } catch (error) {
          this.isEsito = true;
          this.isEsitoOk = false;
        }
  }

}


