import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, Orari, ReqAttivitaAutocomplete, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ricerca-attivita-autocomplete',
  templateUrl: './ricerca-attivita-autocomplete.component.html',
  styleUrls: ['./ricerca-attivita-autocomplete.component.scss'],
})
export class RicercaAttivitaAutocompleteComponent  implements OnInit {

  requestAttivita: ReqAttivitaAutocomplete = {
    nome: '',
    citta: '',
    indirizzo: ''
  };
  isLoading : boolean | undefined;
  attivita : Attivita | undefined;
  ListAttivita : Attivita [] | undefined;
  isRicercaFatta : boolean = false;
  @Input() listaAttivitaDDL: TipoAttivita[] | undefined;
  @Input() listaComuni : Comuni[] | undefined;
  @Output() closeEvent = new EventEmitter<void>();

  constructor(
  private attivitaService: GetApiAttivitaService,
  private alertController: AlertController,
  private translate: TranslateService
) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {

  }

  handleCittaChange(newCitta: Comuni) {
    if(this.requestAttivita)
      this.requestAttivita.citta = newCitta.descComune;
  }

  handleNomeChange(nome: string) {
    if(this.requestAttivita)
      this.requestAttivita.nome = nome;
  }

  handleIndirizzoChange(indirizzo: string) {
    if(this.requestAttivita)
      this.requestAttivita.indirizzo = indirizzo;
  }

  SelectAttivita(attivita : Attivita){
    this.attivita = attivita;
  }

  RevomeAttivitaSelezionata(){
    this.attivita = undefined;
  }

  async Search() {
    if (!this.validateInputs()) return;

    this.isLoading = true;
    this.isRicercaFatta = true;

    const data = await this.attivitaService.apiGetListaAttivitaAutocomplete(this.requestAttivita);
    if (data) this.ListAttivita = data;

    this.isLoading = false;  
  }

  aggiuntaNewAttivita(){
    this.attivita = new Attivita(
      0, 0, '', '', '', '', '', '', 0, 0, '', '', '', false, false, false, false, [], new Orari, [], false, false, '', '', 0, false, 0, 0, ''
    );
  }

  changeNomeAttivita(nome : string){
    if(this.attivita && nome)
      this.attivita.nome = nome
  }

  validateInputs(): boolean {
    const specialCharRegex = /^[a-zA-Z0-9\sÀ-ÿ'’.,\-()]*$/;

    if (!this.requestAttivita.nome || this.requestAttivita.nome.trim() === '') {
      this.presentValidationAlert('ACTIVITY_NAME_REQUIRED');
      return false;
    }

    if (!this.requestAttivita.citta || this.requestAttivita.citta.trim() === '') {
      this.presentValidationAlert('CITY_REQUIRED');
      return false;
    }

    const cittaValida = this.listaComuni?.some(comune =>
      comune.descComune && 
      comune.descComune === this.requestAttivita.citta
    );
  
    if (!cittaValida) {
      this.presentValidationAlert('CITY_NOT_VALID');
      return false;
    }

    if (!specialCharRegex.test(this.requestAttivita.nome)) {
      this.presentValidationAlert('ACTIVITY_NAME_INVALID');
      return false;
    }

    return true;
  }


    async presentValidationAlert(messageKey: string) {
    const header = this.translate.instant('WARNING');
    const message = this.translate.instant(messageKey);
    const okText = this.translate.instant('OK');

    const alert = await this.alertController.create({
      header,
      message,
      buttons: [okText],
      mode: 'ios'
    });

    await alert.present();
  }

}
