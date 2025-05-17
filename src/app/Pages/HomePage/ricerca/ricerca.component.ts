import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Attivita, AttivitaFiltrate, AttivitaRicerca, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss'],
})
export class RicercaComponent implements OnInit {

  @Input() listaTipoAttivita: TipoAttivita[] | undefined;
  @Input() listaAttivitaPerRicerca: AttivitaRicerca[] | undefined = [];
  @Input() listaCitta: Comuni[] | undefined;
  @Output() ricercaAttiviaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() openPageEvent = new EventEmitter<number>();

  selectedOption: TipoAttivita | null = null;
  selectedOptionAttivita: AttivitaRicerca | null = null;
  selectedCityOption: Comuni | null = null;
  tipoOfferte : number[] | undefined;

  filteredOptions: Observable<TipoAttivita[]> | null = null;
  filteredCitiesOptions: Observable<Comuni[]> | null = null;
  filteredOptionAtt: Observable<AttivitaRicerca[]> | undefined;
  
  inputControl: FormControl = new FormControl();
  inputCityControl: FormControl = new FormControl();

  searchForm!: FormGroup;
  showDropdown = true;
  showCitiesDropdown = true;
  private _filterValue = '';
  private _filterCityValue = '';
  
  position!: GeolocationPosition;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  filtro!: FiltriAttivita;
  listaAttivitaRicerca!: AttivitaFiltrate;
  isModalOpen: boolean = false;
  showSuggestions: boolean = true;
  attivita: Attivita | undefined;
  isLoading : boolean = false;
  isLoadingRicerca : boolean = false;

  constructor(private formBuilder: FormBuilder,
              private locationService: LocationService,
              private attivitaService: GetApiAttivitaService) 
            {
              this.searchForm = this.formBuilder.group({
                nomeLocale: new FormControl(''),
                citta: new FormControl(''),
                tipoLocale: new FormControl('')
              });
            }

  async ngOnInit(): Promise<void> {
      this.isLoading = true;
      this.showDropdown = false;
      this.showCitiesDropdown = false;

      document.addEventListener('click', this.handleClickOutside);
  
      this.filteredOptions = this.inputControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.filteredCitiesOptions = this.inputCityControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCities(value))
      );
  
      this.filteredOptionAtt = this.searchForm.get('nomeLocale')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAtt(value))
      );
  
      await this.GetAttivita();
  
      document.addEventListener('click', this.closeDropdown);
  }
  
  async GetAttivita() {
      if(!this.listaAttivitaPerRicerca || this.listaAttivitaPerRicerca.length == 0)
        this.listaAttivitaPerRicerca = this.attivitaService.GetListaAttivitaPerRicercaSession();
      if(!this.listaAttivitaPerRicerca || this.listaAttivitaPerRicerca.length == 0){
        try {
          const listaAttivita = await this.attivitaService.apiGetListaAttivitaPreSearch();
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

  _filterCities(value: string): Comuni[] {
    const filterCityValue = value.toLowerCase();
if (Array.isArray(this.listaCitta)) {
  // Filtra prima le corrispondenze esatte
  const exactMatches = this.listaCitta.filter(citta =>
    citta.descComune?.toLowerCase() === filterCityValue
  );

  // Filtra le corrispondenze parziali (escludendo quelle già trovate come esatte)
  const partialMatches = this.listaCitta.filter(citta =>
    citta.descComune?.toLowerCase().includes(filterCityValue) &&
    citta.descComune?.toLowerCase() !== filterCityValue
  );

  // Combina i risultati esatti e parziali, limitando il totale a 5
  const filteredList = [...exactMatches, ...partialMatches].slice(0, 5);

  return filteredList;
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

  selectAttivitaOption(option: AttivitaRicerca): void {
  this.searchForm.get('nomeLocale')?.setValue(option.nome);
  this.selectedOptionAttivita = option;
  this.closeAllDropdowns();
}

selectCityOption(cityOption: Comuni): void {
  this.inputCityControl.setValue(cityOption.descComune);
  this.selectedCityOption = cityOption;
  this.closeAllDropdowns();
}

selectOption(option: TipoAttivita): void {
  this.inputControl.setValue(option.descrizione);
  this.selectedOption = option;
  this.closeAllDropdowns();
}

closeAllDropdowns() {
  this.showSuggestions = false;
  this.showCitiesDropdown = false;
  this.showDropdown = false;
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

  closeCitiesDropdown = (event: MouseEvent) => {
    const clickedElement = event.target as HTMLElement;
    const inputElement = document.getElementById('cityIinput');

    if (inputElement && !inputElement.contains(clickedElement)) {
      this.showCitiesDropdown = false;
    } else {
      this.showCitiesDropdown = true;
    }
  }

  async VisualizzaAttivita(idAttivita: number | undefined): Promise<void> {
    this.isLoading = true; // Set to true at the start of the loading process
    this.isLoadingRicerca = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (idAttivita) {
        try {
            const data = await this.attivitaService.apiGetAttivitaByIdAttivita(idAttivita);
            this.attivita = data;
            this.ricercaAttiviaSelezionataEvent.emit(this.attivita);
        } catch (error) {
            console.error('Error fetching activity:', error);
        }
    }
    this.isLoadingRicerca = false;
    this.isLoading = false; // Set to false after the loading process is complete
  }

  handleListaTipologieChange(tipologie: number[]) {
    this.tipoOfferte = tipologie;
  }

  async Ricerca(): Promise<void> {
    this.isLoading = true; // Set to true at the start of the loading process
    this.isLoadingRicerca = true;
    const nomeLocale = this.searchForm.get('nomeLocale')?.value;
    const citta = this.selectedCityOption?.descComune;
    const codTipoAttivita = this.selectedOption?.codTipoAttivita;
    this.filtro = new FiltriAttivita();

    this.filtro.tipoRicercaAttivita = 3;

    if (nomeLocale != null && nomeLocale.trim() !== '') {
      this.filtro.nome = nomeLocale;
      this.filtro.range = 1000;
    }
    else{
      this.filtro.range = 100;
    }
    if (citta != null && citta.trim() !== '') {
      this.filtro.citta = citta.toUpperCase();
    }
    else{
      const { latitudine, longitudine } = await this.locationService.getCurrentLocation();
      this.filtro.latitudine = latitudine;
      this.filtro.longitudine = longitudine;
    }

    if (codTipoAttivita != null && codTipoAttivita.trim() !== '') {
      this.filtro.codTipoAttivita = codTipoAttivita;
    }

    if(this.tipoOfferte && this.tipoOfferte.length > 0)
    {
      this.filtro.codTipoPromo = this.tipoOfferte;
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
        this.attivitaService.setIsListaAttModalOpen(true);
        this.attivitaService.setFilter(this.filtro);
        this.isLoading = false;
        this.isLoadingRicerca = false;
        this.openPage(2);
      }
    );
  }

  openPage(idPage:number){
    this.openPageEvent.emit(idPage);
  }

  handleClickOutside = (event: MouseEvent) => {
   const target = event.target as HTMLElement;
    
   if (!target.closest('ion-searchbar')) {
     this.showSuggestions = false;
     this.showCitiesDropdown = false;
     this.showDropdown = false;
   }
  }

  openSuggestions(type: 'nome' | 'citta' | 'tipo') {
  this.showSuggestions = type === 'nome';
  this.showCitiesDropdown = type === 'citta';
  this.showDropdown = type === 'tipo';
}
}
