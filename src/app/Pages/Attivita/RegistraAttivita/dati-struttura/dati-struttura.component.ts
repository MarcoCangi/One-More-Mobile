import { Component, OnInit} from '@angular/core';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { Attivita, Immagini, InsertAttivitaReqDto, Orari, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { UserSession } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Utente';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiComuniService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-comuni.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { StorageService } from 'one-more-frontend-common/projects/one-more-fe-service/src/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dati-struttura',
  templateUrl: './dati-struttura.component.html',
  styleUrls: ['./dati-struttura.component.scss'],
})
export class DatiStrutturaComponent  implements OnInit {
  isAdd : boolean = false;
  isAttAdded : boolean = false;
  isSelected : boolean = false;
  listaAttivita: Attivita[] | undefined;
  id: number | undefined;
  idAttivita:number | undefined;
  listaComuni: Comuni[] | undefined;
  listaAttivitaDDL: TipoAttivita[] | undefined;
  attivita!: Attivita ;
  listaTipoAttivita: TipoAttivita[] = [];
  requestAttivita: InsertAttivitaReqDto | undefined;
  immagini:Immagini[] | undefined;
  isPrincipale = false;
  countImg = 1;
  sessioneString:UserSession | null | undefined;
  provincia:string | undefined;
  isLoading : boolean | undefined;
  isVerificato: boolean = false;
  esitoResendVerification: string | undefined;

  constructor(
    private attivitaService: GetApiAttivitaService,
    private comuniService: GetApiComuniService,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.idAttivita = 0;
    const user = await this.authService.getCurrentUserFromAuth();
    this.sessioneString = this.authService.getUserSession();
    await this.checkIsAddAtt();
    if(this.isAttAdded){
      this.isVerificato = true;
    }
    else if((user && user?.emailVerified == true && this.sessioneString?.typeLog == 1) || (this.sessioneString?.typeLog == 2 || this.sessioneString?.typeLog == 3))
       this.isVerificato = true;
    
    if(this.isVerificato)
    {
      await this.getListaComuni();
      await this.GetListaTipoAttivita();
      
      if (this.sessioneString !== null) {
        if (this.sessioneString.idSoggetto !== null && this.sessioneString.idSoggetto !== undefined && this.sessioneString.idSoggetto > 0) {
          this.id = this.sessioneString.idSoggetto;
        }
      }
  
      if (this.id) {
        await this.getListaAttivita(this.id);
      }
    }
    
    this.isLoading = false;
  }

  async checkIsAddAtt(){
    const isAttUpdateOrSaved = await this.storageService.getItem(`isSavedUpdateAtt`);
    if(isAttUpdateOrSaved == true){
      this.isAttAdded = true;
      await this.storageService.removeItem(`isSavedUpdateAtt`);
    }
  }

  addNewAtt(){
    this.isAdd = true;
  }
  
  async getAttivita(idSoggetto: number, idAttivita:number) {
    this.isLoading = true;

    try {
      const cacheKey = `attivita_${idAttivita}`; // Chiave generica per la cache
  
      const cachedData = await this.storageService.getItem(cacheKey);
      if (cachedData) {
      this.attivita = cachedData;
      if (this.attivita && this.attivita.idAttivita && this.attivita.idSoggetto) {
          this.idAttivita = this.attivita.idAttivita;
      }
        this.isSelected = true;
        this.isLoading = false;
        return;
      }
      
      const data = await lastValueFrom(this.attivitaService.apiGetAttivitaByIdSoggettoAndAtt(idSoggetto, idAttivita));
      if (data) {
        this.attivita = data;
        if (this.attivita && this.attivita.idAttivita && this.attivita.idSoggetto) {
          this.idAttivita = this.attivita.idAttivita;
          this.storageService.setItem(cacheKey, this.attivita);
          this.isSelected = true;
          this.isLoading = false;
        }
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
    this.isLoading = false;
  }

  async getListaAttivita(idSoggetto: number) {
    const cacheKey = `lista_attivita`; 
  
    try {
      const cachedData = await this.storageService.getItem(cacheKey);
      if (cachedData) {
        this.listaAttivita = cachedData;
        return;
      }
  
      const data = await lastValueFrom(this.attivitaService.apiGetAttivitaByIdSoggetto(idSoggetto));
      if (data) {
        this.listaAttivita = data;
        await this.storageService.setItem(cacheKey, data);
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'attività:', error);
    }
  }
  
  async getListaComuni() {
    try {
        this.listaComuni = await firstValueFrom(this.comuniService.apiGetListaComuni());
    } catch (error) {
        console.error('Errore durante il recupero della lista comuni:', error);
    }
  }

  async GetListaTipoAttivita() {
    this.listaAttivitaDDL = this.attivitaService.GetListaTipoAttivitaSession();
    if (!this.listaAttivitaDDL || this.listaAttivitaDDL.length === 0) {
        try {
            const data = await firstValueFrom(await this.attivitaService.apiGetListaDecAttivita());
            if (data) {
                this.listaAttivitaDDL = data.map((item: TipoAttivita) => {
                    return {
                        codTipoAttivita: item.codTipoAttivita,
                        descrizione: item.descrizione
                    };
                });
            }
        } catch (error) {
            console.error('Errore nel recupero dei dati:', error);
        }
    }
  }

  reloadHome(){
    location.reload();
  }

  async resendVerificationEmail(){
    this.esitoResendVerification = await this.authService.resendVerificationEmail();
  }
}
