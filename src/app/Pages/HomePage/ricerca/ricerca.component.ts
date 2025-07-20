import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap, map } from 'rxjs';

import {
  Attivita,
  AttivitaFiltrate,
  AttivitaRicerca,
  FiltriAttivita,
  TipoAttivita
} from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { Comuni } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Comuni_CAP';
import { TipoPeriodo } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/TipoPeriodo';
import { SearchItemDto, searchItemType } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/SearchItemDto';

import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { SearchApiService } from 'one-more-frontend-common/projects/one-more-fe-service/src/search-api.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';

type TipoPromo = 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss']
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
  selectedPeriodo: number[] = [];
  selectedOption: TipoAttivita | null = null;
  selectedOptionAttivita: AttivitaRicerca | null = null;
  selectedCityOption: Comuni | null = null;
  tipoOfferte: number[] | undefined;
  selectedTypePromo: TipoPromo[] = [];

  isModalOpen = true;
  attivita: Attivita | undefined;
  isLoading = false;
  isLoadingRicerca = false;
  isFirstOpen = false;
  isSecondOpen = false;
  isThirdOpen = false;
  isFourthOpen = false;
  isFifthOpen = false;

  filtro!: FiltriAttivita;
  listaAttivitaRicerca!: AttivitaFiltrate;
  searchItemList: SearchItemDto[] = [];
  unifiedOption: SearchItemDto | undefined;

  constructor(
    private locationService: LocationService,
    private attivitaService: GetApiAttivitaService,
    private searchService: SearchApiService,
    private getPromoService: GetApiPromoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.filtro = new FiltriAttivita();
    this.tipoPeriodoList = await this.getPromoService.apiGetListaTipoPeriodo();

    this.globalSearchControl.valueChanges.pipe(
      debounceTime(300),
      filter(val => val && val.length >= 3),
      switchMap(val => this.searchService.Search(val)),
      map(obs => obs as unknown as SearchItemDto[])
    ).subscribe((data: SearchItemDto[]) => {
      this.searchItemList = data; // qui assegni effettivamente l'array
    });

    this.isLoading = false;
  }

  onCitySearchInput(event: any): void {
    const value = event.target.value?.toLowerCase() || '';
    if (!value.trim()) return;

    const uniqueCities = new Map<string, Comuni>();

    (this.listaCitta || [])
      .filter(c => c.descComune?.toLowerCase().includes(value))
      .forEach(c => uniqueCities.set(c.descComune.toLowerCase(), c));

    this.filteredCityOptions = Array.from(uniqueCities.values())
      .sort((a, b) => a.descComune.localeCompare(b.descComune))
      .slice(0, 10);
  }

  async onGlobalSearchInput(event: any): Promise<void> {
    const value = event.target.value?.toLowerCase() || '';
    if (value.length < 3) return;

    (await this.searchService.Search(value)).subscribe(data => this.searchItemList = data);
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
    if (index >= 0) this.selectedTypePromo.splice(index, 1);
    else if (this.selectedTypePromo.length < 3) this.selectedTypePromo.push(type);
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
    this.filtro.tipoRicercaAttivita = 3;

    const searchValue = this.globalSearchControl.value?.trim().toLowerCase();

    if (this.selectedOptionAttivita?.nome?.toLowerCase() === searchValue) {
      this.filtro.nome = this.selectedOptionAttivita?.nome;
      this.filtro.range = 1000;
    } else {
      this.filtro.range = 100;
    }

    switch (this.unifiedOption?.type) {
      case searchItemType.Shop:
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

    if (this.selectedTipo) this.filtro.codTipoConsumazione = this.selectedTipo;
    if (this.selectedOption) this.filtro.codTipoAttivita = this.selectedOption.codTipoAttivita;
    if (this.selectedPeriodo) this.filtro.codTipoPeriodoList = this.selectedPeriodo;
    if (this.tipoOfferte?.length) this.filtro.codTipoPromo = this.tipoOfferte;
    if (this.selectedTypePromo.length) this.filtro.codTipoPromo = this.selectedTypePromo;

    (await this.attivitaService.apiGetListaAttivitaFiltrate(this.filtro)).subscribe(
      (data: AttivitaFiltrate) => this.listaAttivitaRicerca = data,
      (error: any) => console.error('Errore API:', error),
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

  SetPeriodo(id: number | undefined) {
    if (id != null) this.selectedPeriodo = [id];
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
