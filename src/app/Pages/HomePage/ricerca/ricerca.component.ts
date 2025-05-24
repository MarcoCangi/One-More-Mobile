// ricerca.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  globalSearchControl: FormControl = new FormControl();
  showUnifiedSuggestions = false;
  filteredUnifiedOptions: any[] = [];

  selectedOption: TipoAttivita | null = null;
  selectedOptionAttivita: AttivitaRicerca | null = null;
  selectedCityOption: Comuni | null = null;
  tipoOfferte: number[] | undefined;

  isModalOpen: boolean = false;
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

  onGlobalSearchInput(event: any): void {
    const value = event.target.value?.toLowerCase() || '';
    this.filteredUnifiedOptions = [];

    if (!value.trim()) return;

    const attivita = (this.listaAttivitaPerRicerca || [])
      .filter(a => a.nome?.toLowerCase().includes(value))
      .map(a => ({ ...a, type: 'attivita' }));

    const citta = (this.listaCitta || [])
      .filter(c => c.descComune?.toLowerCase().includes(value))
      .map(c => ({
        ...c,
        descComune: c.descComune.charAt(0).toUpperCase() + c.descComune.slice(1).toLowerCase(),
        type: 'citta'
      }));

    const tipo = (this.listaTipoAttivita || [])
      .filter(t => t.descrizione?.toLowerCase().includes(value))
      .map(t => ({ ...t, type: 'tipo' }));

    const deduplicated = new Map<string, any>();
    [...attivita, ...citta, ...tipo].forEach(item => {
      let key = '';
      if ('nome' in item && item.nome) key = item.nome.toLowerCase();
      else if ('descComune' in item && item.descComune) key = item.descComune.toLowerCase();
      else if ('descrizione' in item && item.descrizione) key = item.descrizione.toLowerCase();


      if (!deduplicated.has(key)) deduplicated.set(key, item);
    });

    this.filteredUnifiedOptions = Array.from(deduplicated.values())
      .sort((a, b) => {
        const getValue = (item: any) => {
          switch (item.type) {
            case 'attivita': return item.nome?.toLowerCase() || '';
            case 'citta': return item.descComune?.toLowerCase() || '';
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
            case 'citta': return item.descComune?.toLowerCase() || '';
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
    } else if (option.type === 'citta') {
      this.selectedCityOption = option;
    } else if (option.type === 'tipo') {
      this.selectedOption = option;
    }

    this.showUnifiedSuggestions = false;
  }

  handleListaTipologieChange(tipologie: number[]) {
    this.tipoOfferte = tipologie;
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
