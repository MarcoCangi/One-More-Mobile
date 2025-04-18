import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attivita, ReqAttivitaAutocomplete } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
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

  async Search(){
    this.isLoading = true;
    if(this.requestAttivita){
      const data = await this.attivitaService.apiGetAttivitaAutocomplete(this.requestAttivita);
          if (data) {
              this.attivita = data;
              console.log(this.attivita);
          }
        }
        this.isLoading = false;  
  }

  changeNomeAttivita(nome : string){
    if(this.attivita && nome)
      this.attivita.nome = nome
  }
}
