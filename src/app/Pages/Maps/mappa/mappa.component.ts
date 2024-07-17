import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Attivita, AttivitaFiltrate, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';

@Component({
  selector: 'app-mappa',
  templateUrl: './mappa.component.html',
  styleUrls: ['./mappa.component.scss'],
})
export class MappaComponent implements OnInit {
  
  @Output() ricercaAttiviaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() openSearchEvent = new EventEmitter<number>();
  attivitas: Attivita[] | undefined;
  attivitaFiltrate!: AttivitaFiltrate | null | undefined;
  isLoading: boolean | undefined;
  isRicerca: boolean | undefined;
  position: GeolocationPosition | undefined;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  showMap: boolean = true;
  markerPositions: google.maps.LatLngLiteral[] = [];
  selectedAttivita: Attivita | undefined;
  dettaglioAttivita: Attivita | undefined;
  @ViewChild(IonModal) modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  display: any; // Dichiarazione della proprietà display
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  filter!: FiltriAttivita;
  // Modal states
  isDetailModalOpen = false;
  isListModalOpen = false;
  isFilterModalOpen = false;
  listaAttivitaDDL: TipoAttivita[] | undefined;
  isLimitEnabled: boolean = false;

  constructor(private service: GetApiAttivitaService) {}

  async ngOnInit(): Promise<void> {
    this.isRicerca = false;
    this.isLoading = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.attivitaFiltrate = this.service.getListaAttivita();
    if (this.attivitaFiltrate == undefined || this.attivitaFiltrate == null) {
      this.filter= new FiltriAttivita();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => this.handleLocationSuccess(position),
          (error) => this.handleLocationError(error),
        );
      }
      this.filter.tipoRicerca = 0;
      (await this.service.apiGetListaAttivitaFiltrate(this.filter)).subscribe(
        (data: AttivitaFiltrate) => {
          this.attivitas = data.listaAttivita;
          if(this.attivitas)
            this.attivitas.forEach(e => {
              if (e.latitudine !== undefined && e.longitudine !== undefined) {
                const marker = new google.maps.LatLng({ lat: e.latitudine, lng: e.longitudine });
                this.markerPositions.push(marker.toJSON());
              }
          });
          this.isLoading = false;
        },
        (error: any) => {
          console.error("Errore durante la chiamata API:", error);
        },
      );
    } else {
      if (this.attivitaFiltrate.listaAttivita &&
          this.attivitaFiltrate.latitudine &&
          this.attivitaFiltrate.longitudine) {
        this.attivitaFiltrate.listaAttivita.forEach(e => {
          if (e.latitudine != undefined && e.longitudine != undefined) {
            const marker = new google.maps.LatLng({ lat: e.latitudine, lng: e.longitudine });
            this.markerPositions.push(marker.toJSON());
          }
        });
        this.center = { lat: this.attivitaFiltrate.latitudine, lng: this.attivitaFiltrate.longitudine };
        this.initMap();
      }
      this.attivitas = this.attivitaFiltrate.listaAttivita;
      this.isRicerca = true;
      this.service.resetListaAttivitaFiltrate();
      this.isLoading = false;
    }
  }

  handleLocationSuccess(position: GeolocationPosition): void {
    this.position = position;
    this.center = { lat: position.coords.latitude, lng: position.coords.longitude };
    this.initMap();
  }

  handleLocationError(error: GeolocationPositionError): void {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('Accesso alla geolocalizzazione negato.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Informazioni sulla posizione non disponibili.');
        break;
      case error.TIMEOUT:
        console.error('Richiesta di geolocalizzazione scaduta.');
        break;
    }
    this.isLoading = false;
  }

  initMap(): void {
    const mapElement = document.getElementById('googleMap');
    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: this.center,
        zoom: 14
      });
    }
  }

  toggleMapVisibility(): void {
    this.showMap = !this.showMap;
  }

  zoom = 15;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  getImmaginePrincipale(attivita: Attivita | undefined): string {
    if (attivita && attivita.immagini != undefined) {
      const immaginePrincipale = attivita.immagini.find(img => img.isImmaginePrincipale);
      if (immaginePrincipale) {
        return immaginePrincipale.upload;
      } else {
        return 'URL_IMMAGINE_FALLBACK';
      }
    } else {
      return 'URL_IMMAGINE_FALLBACK';
    }
  }

  markerClicked(markerPosition: google.maps.LatLngLiteral): void {
    this.selectedAttivita = this.attivitas?.find(attivita => 
      attivita.latitudine === markerPosition.lat && attivita.longitudine === markerPosition.lng);
    if (this.selectedAttivita) {
      this.isDetailModalOpen = true;
    }
  }

  selectNewAtt(idAtt: number | undefined){
    this.selectedAttivita = this.attivitas?.find(attivita => 
    attivita.idAttivita === idAtt);
  if (this.selectedAttivita) {
    {
      this.isDetailModalOpen = false;
      this.isDetailModalOpen = true;
    }
  }
}

  openListModal() {
    this.isListModalOpen = true;
  }

  dismissDetailModal() {
    this.isDetailModalOpen = false;
  }

  dismissListModal() {
    this.isListModalOpen = false;
  }

  async openFilerModal() {
    //GET LISTA DEC TIPO ATTIVITA
    this.isLoading = true;
    if (!this.listaAttivitaDDL) {
      this.listaAttivitaDDL = this.service.GetListaTipoAttivitaSession();
      if (this.listaAttivitaDDL == undefined || this.listaAttivitaDDL.length == 0) {
        try {
          const data = await this.service.apiGetListaDecAttivita().toPromise();
          if (data) {
            this.listaAttivitaDDL = data.map((item: TipoAttivita) => {
              return {
                codTipoAttivita: item.codTipoAttivita,
                descrizione: item.descrizione
              };
            });
            this.service.createListaTipoAttivitaSession(this.listaAttivitaDDL);
          }
        } catch (error) {
          console.error('Errore nel recupero della lista di attività:', error);
        }
      }
    }
    this.isLoading = false;
    this.isFilterModalOpen = true;
  }

  dismissFilterModal() {
    this.isFilterModalOpen = false;
  }
 
  
  async VisualizzaAttivita(idAttivita: number | undefined, idModal:number): Promise<void> {

    if(idModal == 1)
      this.dismissDetailModal();
    else if(idModal == 2)
      this.dismissListModal();

    this.isLoading = true; // Set to true at the start of the loading process
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (idAttivita) {
        try {
            const data = await this.service.apiGetAttivitaByIdAttivita(idAttivita).toPromise();
            this.dettaglioAttivita = data;
            this.ricercaAttiviaSelezionataEvent.emit(this.dettaglioAttivita);
        } catch (error) {
            console.error('Error fetching activity:', error);
        }
    }
    this.isLoading = false; 
  }

  openSearch(){
    this.openSearchEvent.emit(8);
  }
}
