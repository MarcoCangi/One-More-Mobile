import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Attivita, AttivitaFiltrate, AttivitaRicerca, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss'],
})
export class RicercaComponent implements OnInit {

  @Input() listaTipoAttivita: TipoAttivita[] | undefined;
  @Input() listaAttivitaPerRicerca: AttivitaRicerca[] | undefined = [];
  @Output() ricercaAttiviaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() openPageEvent = new EventEmitter<number>();

  selectedOption: TipoAttivita | null = null;
  selectedOptionAttivita: AttivitaRicerca | null = null;

  filteredOptions: Observable<TipoAttivita[]> | null = null;
  filteredOptionAtt: Observable<AttivitaRicerca[]> | undefined;
  
  inputControl: FormControl = new FormControl();

  searchForm!: FormGroup;
  showDropdown = true;
  private _filterValue = '';
  
  position!: GeolocationPosition;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  filtro!: FiltriAttivita;
  listaAttivitaRicerca!: AttivitaFiltrate;
  
  showSuggestions: boolean = true;
  attivita: Attivita | undefined;
  isLoading : boolean = false;
  isLoadingRicerca : boolean = false;

  constructor(private formBuilder: FormBuilder,
              private attivitaService: GetApiAttivitaService) 
            {
              this.searchForm = this.formBuilder.group({
                nomeLocale: new FormControl(''),
                citta: new FormControl(''),
                tipoLocale: new FormControl('')
              });
            }

  ngOnInit(): void {
      this.isLoading = true;
      this.showDropdown = false;
  
      this.filteredOptions = this.inputControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  
      this.filteredOptionAtt = this.searchForm.get('nomeLocale')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAtt(value))
      );
  
      this.GetAttivita();
  
      document.addEventListener('click', this.closeDropdown);
  }
  
  async GetAttivita() {
      if(!this.listaAttivitaPerRicerca || this.listaAttivitaPerRicerca.length == 0)
        this.listaAttivitaPerRicerca = this.attivitaService.GetListaAttivitaPerRicercaSession();
      if(!this.listaAttivitaPerRicerca || this.listaAttivitaPerRicerca.length == 0){
        try {
          const listaAttivita = await lastValueFrom(this.attivitaService.apiGetListaAttivitaPerRicerca());
          if (listaAttivita) {
              this.listaAttivitaPerRicerca = listaAttivita;
              this.attivitaService.createListaAttivitaPerRicercaSession(this.listaAttivitaPerRicerca);
          }
      } catch (error) {
          console.error('Error fetching activities:', error);
      } finally {
          this.isLoading = false;
      }
      }
      else{
        this.isLoading = false;
      }
  }

  _filter(value: string): TipoAttivita[] {
    const filterValue = value.toLowerCase();
    if (Array.isArray(this.listaTipoAttivita)) {
      const filteredList = this.listaTipoAttivita.filter(attivita =>
        attivita.descrizione?.toLowerCase().includes(filterValue)
      );
      return filteredList.slice(0, 3); // Restituisci solo le prime 3 opzioni filtrate
    }
    return [];
  }

  _filterAtt(value: string): AttivitaRicerca [] {
    const filterValue = value.toLowerCase();
    if (Array.isArray(this.listaAttivitaPerRicerca)) {
      return this.listaAttivitaPerRicerca.filter(attivita =>
        attivita.nome?.toLowerCase().includes(filterValue)
      ).slice(0, 8); 
    }
    return [];
  }

  selectOption(option: TipoAttivita): void {
    this.showDropdown = false;
    this.inputControl.setValue(option.descrizione);
    this.selectedOption = option;
  }

  closeDropdown = (event: MouseEvent) => {
    const clickedElement = event.target as HTMLElement;
    const inputElement = document.getElementById('inputAttivita');

    if (inputElement && !inputElement.contains(clickedElement)) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
  }

  async VisualizzaAttivita(idAttivita: number | undefined): Promise<void> {
    this.isLoading = true; // Set to true at the start of the loading process
    this.isLoadingRicerca = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (idAttivita) {
        try {
            const data = await this.attivitaService.apiGetAttivitaByIdAttivita(idAttivita).toPromise();
            this.attivita = data;
            this.ricercaAttiviaSelezionataEvent.emit(this.attivita);
        } catch (error) {
            console.error('Error fetching activity:', error);
        }
    }
    this.isLoadingRicerca = false;
    this.isLoading = false; // Set to false after the loading process is complete
  }


  async Ricerca(): Promise<void> {
    this.isLoading = true; // Set to true at the start of the loading process
    this.isLoadingRicerca = true;
    const nomeLocale = this.searchForm.get('nomeLocale')?.value;
    const citta = this.searchForm.get('citta')?.value;
    const codTipoAttivita = this.selectedOption?.codTipoAttivita;
    this.filtro = new FiltriAttivita();
    this.filtro.tipoRicerca = 0

    if (nomeLocale != null && nomeLocale.trim() !== '') {
      this.filtro.nome = nomeLocale;
      this.filtro.tipoRicerca = 1
    }
    if (citta != null && citta.trim() !== '') {
      this.filtro.citta = citta;
      if (this.filtro.tipoRicerca == 0)
        this.filtro.tipoRicerca = 2
    }

    if (codTipoAttivita != null && codTipoAttivita.trim() !== '') {
      this.filtro.codTipoAttivita = codTipoAttivita;
      if (this.filtro.tipoRicerca == 0)
        this.filtro.tipoRicerca = 3
    }

    (await this.attivitaService.apiGetListaAttivitaFiltrate(this.filtro)).subscribe(
      (data: AttivitaFiltrate) => {
        this.listaAttivitaRicerca = data;
      },
      (error: any) => {
        console.error("Errore durante la chiamata API:", error);
      },
      () => {
        this.attivitaService.setListaAttivitaFiltrate(this.listaAttivitaRicerca);
        this.isLoading = false;
        this.isLoadingRicerca = false;
        this.openPage(2);
      }
    );
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }
}
