import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, Immagini, Orari } from 'src/app/EntityInterface/Attivita';
import { Promo } from 'src/app/EntityInterface/Promo';
import { GetApiPromoService } from '../../../../Services/get-api-promo.service';
import { MatDialog } from '@angular/material/dialog';
import { GalleriaDettaglioComponent } from '../galleria dettaglio/galleria-dettaglio/galleria-dettaglio.component';
import { IngrandimentoImmagineDialogComponent } from '../galleria dettaglio/ingrandimento-immagine-dialog/ingrandimento-immagine-dialog.component';
import { GetApiAttivitaService } from 'src/app/Services/get-api-attivita.service';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { UserService } from 'src/app/Services/user-service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.scss'],
})
export class DettaglioComponent  implements OnInit {

  attivita!: Attivita;
  listaPromo: Promo[] | undefined;
  id:number | undefined;
  immagini : Immagini[] | undefined;
  isLoading : boolean | undefined;
  isModalLoginOpen : boolean | undefined;
  idSoggetto!: number;
  @Input() attivitaSelezionata : Attivita | undefined;
  @Output() isModalLoginOpenEvent = new EventEmitter<boolean>();
  isFavorite: boolean | undefined;
  isOk: boolean | undefined;

  constructor(private promoService: GetApiPromoService,
              private modalController: ModalController,
              private attivitaService : GetApiAttivitaService,
              private authService : AuthService,
              private userService: UserService) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && userSession.idSoggetto && userSession.idSoggetto > 0) {
      this.idSoggetto = userSession.idSoggetto;
    } else {
      this.idSoggetto = 0;
    }

    if (this.attivitaSelezionata) {
        this.attivita = this.attivitaSelezionata;
        if(this.attivita)
        {
          if (this.attivita.idAttivita && this.attivita.idAttivita > 0 && this.attivita.isPromoPresente) {
            const promoData = await this.promoService.apiGetListaPromoByIdAttivitaAndUser(this.attivita.idAttivita, this.idSoggetto).toPromise();
              if (promoData) {
                this.listaPromo = promoData.filter(item => item.isAttiva === true);
                if (this.listaPromo) {
                  this.listaPromo.forEach(item => {
                    item.days = this.getDaysArray(item.validDays);
                  });
                }
              }
          }

          if (this.idSoggetto > 0 && this.attivita.idAttivita) {
            this.isFavorite = await this.userService.apiCheckIsFavorite(this.idSoggetto, this.attivita.idAttivita).toPromise();
        }

          const immaginiData = await this.attivitaService.apiGetListaTop3ImmaginiById(this.attivita.idAttivita).toPromise();
          if (this.attivita) {
              this.attivita.immagini = immaginiData;
          }
          
          if(!this.attivita.orari)
          {
            const orariData = await this.attivitaService.apiGetOrariById(this.attivita.idAttivita).toPromise();
              if(this.attivita)
                this.attivita.orari = orariData;
          }
        }  
    } else {
        // Se non ci sono dati nell'oggetto state, gestisci l'errore o fai una redirezione
        console.error('Dati dell\'attività non presenti nello stato della navigazione.');
        // Puoi anche reindirizzare l'utente ad una pagina di errore o ad un'altra pagina.
    }
    this.isLoading = false;
  }

  async openDialogImg(idAttivita: number | undefined) {
    const modal = await this.modalController.create({
      component: GalleriaDettaglioComponent,
      cssClass: 'fullscreen-modal',
      componentProps: { IdAttivita: idAttivita }
    });
    return await modal.present();
  }

  async AddRemoveFavorite(idAttivita: number | undefined): Promise<void> {
    const userSession = this.authService.getUserSessionFromCookie();
    if (userSession && idAttivita) {
      this.isOk = await this.userService.AddRemoveFavorite(this.idSoggetto, idAttivita).toPromise();
      if(this.isOk){
        if(this.isFavorite)
          this.isFavorite = false;
        else
        this.isFavorite = true;
      }
    }
  }

  private getDaysArray(validDays: string | undefined): number[] {
    const days: number[] = [];
    if (validDays) {
      if (validDays.includes('-')) {
        const range = validDays.split('-').map(Number);
        const start = range[0];
        const end = range[1];
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            days.push(i);
          }
        }
      } else {
        const day = parseInt(validDays, 10);
        if (!isNaN(day)) {
          days.push(day);
        }
      }
    }
    return days;
  }

  isOpenPageLoginEvent(isOpen:boolean){
    this.isModalLoginOpenEvent.emit(isOpen);
  }
}
