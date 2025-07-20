// ricerca.component.ts
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Attivita, AttivitaFiltrate, AttivitaRicerca, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { SearchApiService } from 'one-more-frontend-common/projects/one-more-fe-service/src/search-api.service';
import { SearchItemDto, searchItemType } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/SearchItemDto';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { TipoPeriodo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/TipoPeriodo';
type TipoPromo = 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;



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
  selectedTipo: 1 | 2 | 3 | null = null;
  tipoPeriodoList: TipoPeriodo[] = [];
  isFirstOpen: boolean = false;
  isSecondOpen: boolean = false;
  isThirdOpen: boolean = false;
  isFourthOpen: boolean = false;
  isFifthOpen: boolean = false;  
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
    this.filtro = new FiltriAttivita();
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

  onClearCitySearch() {
    this.citySearchControl.setValue('');
    this.selectedCityOption = null;
    this.showCitySuggestions = false;
  }

  onClearGlobalSearch() {
    this.globalSearchControl.setValue('');
    this.unifiedOption = undefined;
    this.selectedOptionAttivita = null;
    this.showUnifiedSuggestions = false;
  }

  async Ricerca(): Promise<void> {
    this.isLoading = true;
    this.isLoadingRicerca = true;

    const searchValue = this.globalSearchControl.value?.trim().toLowerCase();
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
      case searchItemType.Promo:
        this.filtro.idAttivita = Number(this.unifiedOption.id);
        this.filtro.nome = this.unifiedOption.descrizione;
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

    if(this.selectedTipo)
      this.filtro.codTipoConsumazione = this.selectedTipo;

    if (this.selectedOption) {
      this.filtro.codTipoAttivita = this.selectedOption.codTipoAttivita;
    }

    if(this.selectedPeriodo)
      this.filtro.codTipoPeriodoList = this.selectedPeriodo;

    if (this.tipoOfferte && this.tipoOfferte.length > 0) {
      this.filtro.codTipoPromo = this.tipoOfferte;
    }

    if(this.selectedTypePromo)
      this.filtro.codTipoPromo = this.selectedTypePromo;

    this.filtro.codTipoPeriodoList = this.selectedPeriodo;


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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('ion-searchbar') && !target.closest('.suggestion-list')) {
      this.showCitySuggestions = false;
      this.showUnifiedSuggestions = false;
    }
  }

  openPage(idPage: number) {
    this.openPageEvent.emit(idPage);
  }

  SetPeriodo(id:number | undefined){
    if (id == null) return;

    this.selectedPeriodo = [id];
  }

  handleAllSettimanaChange(isAllSettimana: boolean) {
    console.log('isAllSettimana', isAllSettimana);
    if (isAllSettimana) {
        if (this.filtro.days) {
            this.filtro.days = []; 
        }
        if (!this.filtro.days.includes(0)) {
          console.log('Adding 0 to filtro.days');
            this.filtro.days.push(0);
        }
    } 
    else {
        if (this.filtro.days && this.filtro.days.includes(0)) {
            this.rimuoviNumero(this.filtro.days, 0);
        }
    }
    console.log(this.filtro.days);
  }

  handleLunediChange(isLunedi: boolean) {
    if (isLunedi) {
      if (!this.filtro.days) {
          this.filtro.days = []; 
      }
      if (!this.filtro.days.includes(1)) {
          this.filtro.days.push(1);
      }
  } 
  else {
      if (this.filtro.days && this.filtro.days.includes(1)) {
          this.rimuoviNumero(this.filtro.days, 1);
      }
    }
  }

  handleMartediChange(isMartedi: boolean) {
    if (isMartedi) {
      if (!this.filtro.days) {
          this.filtro.days = []; 
      }
      if (!this.filtro.days.includes(2)) {
          this.filtro.days.push(2);
      }
  } 
  else {
      if (this.filtro.days && this.filtro.days.includes(2)) {
          this.rimuoviNumero(this.filtro.days, 2);
      }
    }
  }

  handleMercolediChange(isMercoledi: boolean) {
    if (isMercoledi) {
      if (!this.filtro.days) {
          this.filtro.days = []; 
      }
      if (!this.filtro.days.includes(3)) {
          this.filtro.days.push(3);
      }
  } 
  else {
      if (this.filtro.days && this.filtro.days.includes(3)) {
          this.rimuoviNumero(this.filtro.days, 3);
      }
    }
  }

  handleGiovediChange(isGiovedi: boolean) {
    if (isGiovedi) {
      if (!this.filtro.days) {
          this.filtro.days = []; 
      }
      if (!this.filtro.days.includes(4)) {
          this.filtro.days.push(4);
      }
  } 
  else {
      if (this.filtro.days && this.filtro.days.includes(4)) {
          this.rimuoviNumero(this.filtro.days, 4);
      }
    }
  }

  handleVenerdiChange(isVenerdi: boolean) {
    if (isVenerdi) {
      if (!this.filtro.days) {
          this.filtro.days = []; 
      }
      if (!this.filtro.days.includes(5)) {
          this.filtro.days.push(5);
      }
  } 
  else {
      if (this.filtro.days && this.filtro.days.includes(5)) {
          this.rimuoviNumero(this.filtro.days, 5);
      }
    }
  }

  handleSabatoChange(isSabato: boolean) {
    if (isSabato) {
      if (!this.filtro.days) {
          this.filtro.days = []; 
      }
      if (!this.filtro.days.includes(6)) {
          this.filtro.days.push(6);
      }
  } 
  else {
      if (this.filtro.days && this.filtro.days.includes(6)) {
          this.rimuoviNumero(this.filtro.days, 6);
      }
    }
  }

  handleDomenicaChange(isDomenica: boolean) {
    if (isDomenica) {
      if (!this.filtro.days) {
          this.filtro.days = []; 
      }
      if (!this.filtro.days.includes(7)) {
          this.filtro.days.push(7);
      }
  } 
  else {
      if (this.filtro.days && this.filtro.days.includes(7)) {
          this.rimuoviNumero(this.filtro.days, 7);
      }
    }
  }

  rimuoviNumero(array: number[], numero: number): void {
    const indice: number = array.indexOf(numero);
    if (indice !== -1) {
        array.splice(indice, 1);
    }
  }
}
