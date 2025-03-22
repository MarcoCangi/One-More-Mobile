/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { IonModal } from '@ionic/angular';
import { Attivita, AttivitaFiltrate, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-mappa',
  templateUrl: './mappa.component.html',
  styleUrls: ['./mappa.component.scss'],
})
export class MappaComponent implements OnInit {
  @ViewChild('googleMap', { static: false }) googleMap!: GoogleMap;
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
  // markerOptions: google.maps.MarkerOptions = {
  //   draggable: false,
  //   icon: {
  //     url:"assets/Img/posizione one more_def.png",
  //     scaledSize: new google.maps.Size(90, 85), // Regola le dimensioni come necessario
  //     fillColor: '#FF0000', // Colore di riempimento
  //     fillOpacity: 0.8, // Opacità del riempimento
  //     strokeWeight: 2, // Spessore del bordo
  //     strokeColor: '#000000' // Colore del bordo
  //   }
  // };
  filter!: FiltriAttivita;
  // Modal states
  isDetailModalOpen = false;
  isListModalOpen = false;
  isFilterModalOpen = false;
  listaAttivitaDDL: TipoAttivita[] | undefined;
  isLimitEnabled: boolean = false;
  isPositionLoaded: boolean = false;
  isMooving: boolean = false;
  markerOptionsList: google.maps.MarkerOptions[] = [];

  constructor(private service: GetApiAttivitaService) {}

  async ngOnInit(): Promise<void> {
    this.isRicerca = false;
    this.isLoading = true;
    this.filter = new FiltriAttivita();
    this.attivitaFiltrate = this.service.getListaAttivita();
  
    if (this.attivitaFiltrate) {
      await this.setCenterPosition(this.attivitaFiltrate.latitudine, this.attivitaFiltrate.longitudine);
      this.isListModalOpen = this.service.getIsListaModalOpen();
      if (this.isListModalOpen) {
        this.service.setIsListaAttModalOpen(false);
      }
    } else {
      await this.getUserLocation();
    }
    setTimeout(async () => {
      await this.initMap();
    }, 200);
    this.isLoading = false;
  }
  
  /**
   * Recupera la posizione dell'utente, se possibile, altrimenti usa una posizione di default
   */
  private async getUserLocation(): Promise<void> {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      this.position = position;
      await this.setCenterPosition(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      await this.setCenterPosition(41.9028, 12.4964); // Roma come fallback
    }
  
    this.filter.latitudine = this.center.lat;
    this.filter.longitudine = this.center.lng;
  }

  setCenterPosition(latitudine: number, longitudine:number){
    this.center = { lat: latitudine, lng: longitudine };
    this.isPositionLoaded = true;
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

  async initMap(): Promise<void> {
    if (this.googleMap && this.googleMap.googleMap) {
      const map = this.googleMap.googleMap;
      const currentZoom = map.getZoom();
      const earthCircumference = 40075000; // in metri
      const mapCenter = map.getCenter();
      const centerLat = mapCenter?.lat();

        map.panTo(this.center);

        // Applica lo zoom corrente, se esiste
        if (currentZoom !== null && currentZoom !== undefined) {
            map.setZoom(currentZoom);

            if (centerLat !== undefined && currentZoom !== null && currentZoom !== undefined) {
              // Calcolo del raggio in metri
              const radiusMeters = (earthCircumference / Math.pow(2, currentZoom)) * Math.cos(centerLat * Math.PI / 180);
        
              // Converti in chilometri (1 km = 1000 metri)
              let radiusKm = radiusMeters / 1000;
              radiusKm = parseFloat(radiusKm.toFixed(2));
              // Imposta il raggio in base allo zoom
              this.filter.range = radiusKm;
            }

        } else {
            map.setZoom(15); // Setta a 12 solo se lo zoom corrente non è disponibile
        }
      await this.updateVisibleActivities(map);
    } else {
      console.error("Errore: la mappa Google non è pronta.");
    }
  }

  centerChanged(){
    this.isMooving = true;
  }

  zoomChanged(){
    this.isMooving = true;
  }

  async cerca() {
    this.isMooving = false;
    
    if (this.googleMap && this.googleMap.googleMap) {
      const mapCenter = this.googleMap.googleMap.getCenter();
      if (mapCenter) {
        const centerLat = mapCenter.lat();
        const centerLng = mapCenter.lng();
        // Imposta la posizione centrale con le coordinate attuali della mappa
        await this.setCenterPosition(centerLat, centerLng);
        this.filter.isMovingMap = true;
        this.filter.latitudine = centerLat;
        this.filter.longitudine = centerLng;
  
        setTimeout(async () => {
          await this.initMap();
        }, 200);
      } else {
        console.error("Impossibile recuperare il centro della mappa.");
      }
    } else {
      console.error("La mappa non è pronta.");
    }
  }

  toggleMapVisibility(): void {
    this.showMap = !this.showMap;
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  async updateVisibleActivities(map: google.maps.Map): Promise<void> {
    this.isLoading = true;
  
    try {
      // Se l'utente sta muovendo la mappa, aggiorniamo i filtri
      if (this.filter?.isMovingMap) {
        if (this.attivitaFiltrate?.listaAttivita) this.attivitaFiltrate = null;
  
        // Recuperiamo il filtro dalla sessione, se disponibile
        const sessionFilter = this.service.getFilter();
        if (sessionFilter) {
          this.filter.citta = sessionFilter.citta ?? undefined;
          this.filter.nome = sessionFilter.nome ?? undefined;
          this.filter.codTipoPromo = sessionFilter.codTipoPromo ?? undefined;
          this.filter.codTipoAttivita = sessionFilter.codTipoAttivita ?? undefined;
        }
      }
  
      const bounds = map.getBounds();
  
      // Se ci sono già dati filtrati, aggiorniamo la UI
      if (this.attivitaFiltrate?.listaAttivita) {
        this.updateMarkerPositions(this.attivitaFiltrate.listaAttivita);
        this.attivitas = this.attivitaFiltrate.listaAttivita;
        this.isRicerca = true;
        this.service.resetListaAttivitaFiltrate();
        return;
      }
  
      // Se latitudine e longitudine non sono definite, otteniamo la posizione con il tuo metodo esistente
      if (!this.filter?.latitudine || !this.filter?.longitudine) {
        await this.getUserLocation();
      }
  
      // Imposta il tipo di filtro
      this.filter.typeFilterHomePage = 2;
  
      // Chiamata API per ottenere la lista di attività
      const observable = await this.service.apiGetListaAttivitaFiltrate(this.filter);
      const data = await firstValueFrom(observable);
  
      // Filtriamo le attività visibili sulla mappa
      const allAttivitas = data.listaAttivita;
      const filteredAttivitas = bounds
        ? allAttivitas.filter(e => this.isWithinBounds(e, bounds))
        : allAttivitas;
  
      // Aggiorniamo i marker e la lista delle attività visibili
      this.attivitas = filteredAttivitas;
      this.updateMarkerPositions(filteredAttivitas);
      
    } catch (error) {
      console.error("Errore durante la chiamata API:", error);
    } finally {
      this.isLoading = false;
    }
  }
  
  private isWithinBounds(e: any, bounds: google.maps.LatLngBounds): boolean {
    if (!e.latitudine || !e.longitudine) return false;
    const position = new google.maps.LatLng(e.latitudine, e.longitudine);
    return bounds.contains(position);
  }
  
  private updateMarkerPositions(attivitas: Attivita[]): void {
    this.markerPositions = attivitas
      .filter(e => e.latitudine !== undefined && e.longitudine !== undefined)
      .map(e => ({ lat: e.latitudine, lng: e.longitudine }));
  
    this.markerOptionsList = attivitas.map(e => {
      const imageUrl = this.getImmaginePrincipale(e); // Ottieni immagine principale
  
      return {
        draggable: false,
        icon: {
          url: this.createCircularMarker(imageUrl || 'assets/Img/default-marker.png'), // Crea un marker circolare
          scaledSize: new google.maps.Size(50, 50),
          anchor: new google.maps.Point(25, 25)
        },
        title: e.nome
      };
    });
  }
  
  private createCircularMarker(imageUrl: string): string {
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <!-- Bordo blu chiaro spesso -->
        <circle cx="50" cy="50" r="45" stroke="#4DA6FF" stroke-width="8" fill="white"/>
  
        <!-- Ritaglio circolare -->
        <clipPath id="circleClip">
          <circle cx="50" cy="50" r="42"/>
        </clipPath>
  
        <!-- Immagine che riempie il cerchio -->
        <image x="4" y="4" width="92" height="92" href="${imageUrl}" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice"/>
      </svg>
    `;
  
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  
  getImmaginePrincipale(attivita: Attivita | undefined): string {
    if (attivita && attivita.immagini != undefined) {
      const immaginePrincipale = attivita.immagini.find(img => (img.isImmaginePrincipale && img.isVerificata) || img.isImmaginePrincipaleTemp);
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

 
  async VisualizzaAttivita(idAttivita: number | undefined, idModal:number): Promise<void> {

    if(idModal == 1)
      this.dismissDetailModal();
    else if(idModal == 2)
      this.dismissListModal();

    this.isLoading = true; // Set to true at the start of the loading process
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (idAttivita) {
        try {
            const data = await this.service.apiGetAttivitaByIdAttivita(idAttivita);
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

  popoverDismissed(){
    this.isDetailModalOpen = false;
    this.selectedAttivita = undefined;
  }
}
