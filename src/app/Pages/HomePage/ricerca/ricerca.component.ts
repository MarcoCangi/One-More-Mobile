// ricerca.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Attivita, AttivitaFiltrate, AttivitaRicerca, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { SearchApiService } from 'one-more-frontend-common/projects/one-more-fe-service/src/search-api.service';
import { SearchItemDto, searchItemType } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/SearchItemDto';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { TipoPeriodo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/TipoPeriodo';
type TipoPromo = 'dueperuno' | 'gift' | 'bundle' | 'percent' | 'child' | 'family' | 'love' | 'vegan' | 'vegetarian';
@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss'],
})


export class RicercaComponent implements OnInit {
  @Input() listaTipoAttivita: TipoAttivita[] | undefined;
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
  tipoPeriodoList: TipoPeriodo[] = [];
  
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
  searchItemList : SearchItemDto[] = [];
  unifiedOption: SearchItemDto | undefined;
  selectedPeriodo: number[] = [];

  constructor(
    private locationService: LocationService,
    private attivitaService: GetApiAttivitaService,
    private searchService: SearchApiService,
    private getPromoService: GetApiPromoService,
  ) 
  {
     
    
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.isLoading = false;
    this.tipoPeriodoList = await this.getPromoService.apiGetListaTipoPeriodo();
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

  async onGlobalSearchInput(event: any): Promise<void> {
    const value = event.target.value?.toLowerCase() || '';
    
    if(value.length<3)
      return;

    (await this.searchService.Search(value)).subscribe(data => {
      this.searchItemList = data
    });
  }

  selectUnifiedOption(option: SearchItemDto): void {
    this.globalSearchControl.setValue(option.descrizione || option.id || option.type);
    this.unifiedOption = option;
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

    switch(this.unifiedOption?.type)
    {
      case searchItemType.Shop:
        this.filtro.idAttivita = Number(this.unifiedOption.id);
        break;
      case searchItemType.ShopType:
        this.filtro.codTipoAttivita = this.unifiedOption.id;
        break;
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

    this.filtro.codTipoPeriodoList = this.selectedPeriodo;
    console.log(this,this.selectedPeriodo);
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

  SetPeriodo(id:number | undefined){
    if (id == null) return;

  this.selectedPeriodo = this.selectedPeriodo.includes(id)
    ? this.selectedPeriodo.filter(item => item !== id)
    : [...this.selectedPeriodo, id];
  }
}
