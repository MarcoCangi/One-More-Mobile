// ricerca.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Attivita, AttivitaFiltrate, AttivitaRicerca, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
type TipoPromo = 'dueperuno' | 'gift' | 'bundle' | 'percent' | 'child' | 'family' | 'love' | 'vegan' | 'vegetarian';
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

  globalSearchControl: FormControl = new FormControl();
  citySearchControl: FormControl = new FormControl();
  showUnifiedSuggestions = false;
  showCitySuggestions = false;
  filteredUnifiedOptions: any[] = [];
  filteredCityOptions: any[] = [];
  selectedTipo: 'cibo' | 'bevande' | 'entrambi' | null = null;
  selectedPeriod: 'colazione' | 'brunch' | 'pranzo' | 'tè'| 'happyhour'| 'cena'| 'dopocena'| 'sempre'| null = null;
  
  selectedOption: TipoAttivita | null = null;
  selectedOptionAttivita: AttivitaRicerca | null = null;
  selectedCityOption: Comuni | null = null;
  tipoOfferte: number[] | undefined;
  selectedTypePromo: TipoPromo[] = [];
  isModalOpen: boolean = true;
  attivita: Attivita | undefined;
  isLoading: boolean = false;
  isLoadingRicerca: boolean = false;
  filtro!: FiltriAttivita;
  listaAttivitaRicerca!: AttivitaFiltrate;

  constructor(
    private locationService: LocationService,
    private attivitaService: GetApiAttivitaService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.loadAttivita();
    this.isLoading = false;
  }

  async loadAttivita(): Promise<void> {
    if (!this.listaAttivitaPerRicerca || this.listaAttivitaPerRicerca.length === 0) {
      this.listaAttivitaPerRicerca = this.attivitaService.GetListaAttivitaPerRicercaSession();
    }
    if (!this.listaAttivitaPerRicerca || this.listaAttivitaPerRicerca.length === 0) {
      try {
        const lista = await this.attivitaService.apiGetListaAttivitaPreSearch();
        if (lista) {
          this.listaAttivitaPerRicerca = lista;
          this.attivitaService.createListaAttivitaPerRicercaSession(lista);
        }
      } catch (err) {
        console.error('Errore caricamento attività:', err);
      }
    }
  }

  onCitySearchInput(event: any): void {
    const value = event.target.value?.toLowerCase() || '';
    this.filteredCityOptions = [];

    if (!value.trim()) return;

    const citta = (this.listaCitta || [])
      .filter(c => c.descComune?.toLowerCase().includes(value))
      .map(c => ({
        ...c,
        descComune: c.descComune.charAt(0).toUpperCase() + c.descComune.slice(1).toLowerCase(),
        type: 'citta'
      }));

    const deduplicated = new Map<string, any>();
    [...citta].forEach(item => {
      let key = '';
      if ('descComune' in item && item.descComune) key = item.descComune.toLowerCase();

      if (!deduplicated.has(key)) deduplicated.set(key, item);
    });

    this.filteredCityOptions = Array.from(deduplicated.values())
      .sort((a, b) => {
        const getValue = (item: any) => {
          switch (item.type) {
            case 'citta': return item.descComune?.toLowerCase() || '';
            default: return '';
          }
        };

        const aVal = getValue(a);
        const bVal = getValue(b);

        const startsWithA = aVal.startsWith(value);
        const startsWithB = bVal.startsWith(value);

        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;

        return aVal.localeCompare(bVal);
      })
      .slice(0, 15)
      .sort((a, b) => {
        const getValue = (item: any) => {
          switch (item.type) {
            case 'citta': return item.descComune?.toLowerCase() || '';
            default: return '';
          }
        };

        const aVal = getValue(a);
        const bVal = getValue(b);

        const startsWithA = aVal.startsWith(value);
        const startsWithB = bVal.startsWith(value);

        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;

        return aVal.localeCompare(bVal);
      })
      .slice(0, 10);
  }

  onGlobalSearchInput(event: any): void {
    const value = event.target.value?.toLowerCase() || '';
    this.filteredUnifiedOptions = [];

    if (!value.trim()) return;

    const attivita = (this.listaAttivitaPerRicerca || [])
      .filter(a => a.nome?.toLowerCase().includes(value))
      .map(a => ({ ...a, type: 'attivita' }));

    const tipo = (this.listaTipoAttivita || [])
      .filter(t => t.descrizione?.toLowerCase().includes(value))
      .map(t => ({ ...t, type: 'tipo' }));

    const deduplicated = new Map<string, any>();
    [...attivita, ...tipo].forEach(item => {
      let key = '';
      if ('nome' in item && item.nome) key = item.nome.toLowerCase();
      else if ('descrizione' in item && item.descrizione) key = item.descrizione.toLowerCase();

      if (!deduplicated.has(key)) deduplicated.set(key, item);
    });

    this.filteredUnifiedOptions = Array.from(deduplicated.values())
      .sort((a, b) => {
        const getValue = (item: any) => {
          switch (item.type) {
            case 'attivita': return item.nome?.toLowerCase() || '';
            case 'tipo': return item.descrizione?.toLowerCase() || '';
            default: return '';
          }
        };

        const aVal = getValue(a);
        const bVal = getValue(b);

        const startsWithA = aVal.startsWith(value);
        const startsWithB = bVal.startsWith(value);

        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;

        return aVal.localeCompare(bVal);
      })
      .slice(0, 15)
      .sort((a, b) => {
        const getValue = (item: any) => {
          switch (item.type) {
            case 'attivita': return item.nome?.toLowerCase() || '';
            case 'tipo': return item.descrizione?.toLowerCase() || '';
            default: return '';
          }
        };

        const aVal = getValue(a);
        const bVal = getValue(b);

        const startsWithA = aVal.startsWith(value);
        const startsWithB = bVal.startsWith(value);

        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;

        return aVal.localeCompare(bVal);
      })
      .slice(0, 10);
  }

  selectUnifiedOption(option: any): void {
    this.globalSearchControl.setValue(option.nome || option.descComune || option.descrizione);

    if (option.type === 'attivita') {
      this.selectedOptionAttivita = option;
    } else if (option.type === 'tipo') {
      this.selectedOption = option;
    }

    this.showUnifiedSuggestions = false;
  }

  selectCityOption(option: any): void {
    this.citySearchControl.setValue(option.descComune);
    this.selectedCityOption = option;
    this.showCitySuggestions = false;
  }

  handleListaTipologieChange(tipologie: number[]) {
    this.tipoOfferte = tipologie;
  }

  togglePromoSelection(type: TipoPromo): void {
  const index = this.selectedTypePromo.indexOf(type);
  if (index >= 0) {
    this.selectedTypePromo.splice(index, 1); // rimuove selezione
  } else if (this.selectedTypePromo.length < 3) {
    this.selectedTypePromo.push(type); // aggiunge se < 3
  }
}

  async Ricerca(): Promise<void> {
    this.isLoading = true;
    this.isLoadingRicerca = true;

    const searchValue = this.globalSearchControl.value?.trim().toLowerCase();
    this.filtro = new FiltriAttivita();
    this.filtro.tipoRicercaAttivita = 3;

    if (this.selectedOptionAttivita?.nome?.toLowerCase() === searchValue) {
      this.filtro.nome = this.selectedOptionAttivita?.nome;
      this.filtro.range = 1000;
    } else {
      this.filtro.range = 100;
    }

    if (this.selectedCityOption) {
      this.filtro.citta = this.selectedCityOption.descComune.toUpperCase();
    } else {
      const { latitudine, longitudine } = await this.locationService.getCurrentLocation();
      this.filtro.latitudine = latitudine;
      this.filtro.longitudine = longitudine;
    }

    if (this.selectedOption) {
      this.filtro.codTipoAttivita = this.selectedOption.codTipoAttivita;
    }

    if (this.tipoOfferte && this.tipoOfferte.length > 0) {
      this.filtro.codTipoPromo = this.tipoOfferte;
    }

    (await this.attivitaService.apiGetListaAttivitaFiltrate(this.filtro)).subscribe(
      (data: AttivitaFiltrate) => {
        this.listaAttivitaRicerca = data;
      },
      (error: any) => {
        console.error('Errore API:', error);
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

  openPage(idPage: number) {
    this.openPageEvent.emit(idPage);
  }
}
