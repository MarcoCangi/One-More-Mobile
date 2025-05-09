import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, Orari, ReqAttivitaAutocomplete, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

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
  constructor(private attivitaService : GetApiAttivitaService) { }

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

  async Search(){
    this.isLoading = true;
    this.isRicercaFatta = true;
    if(this.requestAttivita){
      const data = await this.attivitaService.apiGetListaAttivitaAutocomplete(this.requestAttivita);
          if (data)
              this.ListAttivita = data;
        }
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
}
