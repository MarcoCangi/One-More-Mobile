/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { IonModal } from '@ionic/angular';
import { Attivita, AttivitaFiltrate, FiltriAttivita, TipoAttivita } from 'one-more-frontend-common/projects/one-more-fe-service/src/EntityInterface/Attivita';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { firstValueFrom } from 'rxjs';
import { LocationService } from 'one-more-frontend-common/projects/one-more-fe-service/src/location.service';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';

@Component({
  selector: 'app-mappa',
  templateUrl: './mappa.component.html',
  styleUrls: ['./mappa.component.scss'],
})
export class MappaComponent implements OnInit {
  @ViewChildren('card') cardElements!: QueryList<ElementRef>;
  @ViewChild('googleMap', { static: false }) googleMap!: GoogleMap;
  @Output() ricercaAttiviaSelezionataEvent = new EventEmitter<Attivita>();
  @Output() openSearchEvent = new EventEmitter<number>();
  attivitas: Attivita[] | undefined;
  attivitaFiltrate!: AttivitaFiltrate | null | undefined;
  isLoading: boolean | undefined;
  isRicerca: boolean | undefined;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  showMap: boolean = true;
  markerPositions: google.maps.LatLngLiteral[] = [];
  selectedAttivita: Attivita | undefined;
  dettaglioAttivita: Attivita | undefined;
  @ViewChild(IonModal) modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  display: any;
  filter!: FiltriAttivita;
  idSoggetto: number = 0;
  isSearchModalOpen = false;
  isDetailModalOpen = false;
  isListModalOpen = false;
  isFilterModalOpen = false;
  listaAttivitaDDL: TipoAttivita[] | undefined;
  isLimitEnabled: boolean = false;
  isPositionLoaded: boolean = false;
  isMooving: boolean = false;
  markerOptionsList: google.maps.MarkerOptions[] = [];
  activeMarkerId: number | null = null;
  scrollTimeout: any;
  mapOptions: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

  constructor(private service: GetApiAttivitaService,
              private locationService: LocationService,
              private authService : AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isRicerca = false;
    this.isLoading = true;
    this.filter = new FiltriAttivita();
    this.attivitaFiltrate = this.service.getListaAttivita();

    const userSession = this.authService.getUserSession();
    if (userSession && userSession.idSoggetto && userSession.idSoggetto > 0) {
      this.idSoggetto = userSession.idSoggetto;
    } else {
      this.idSoggetto = 0;
    }
  
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

  onCardFocus(attivita: Attivita): void {
    this.activeMarkerId = attivita.idAttivita;

    const latLng: google.maps.LatLngLiteral = {
      lat: attivita.latitudine,
      lng: attivita.longitudine
    };

    // Centra la mappa
    this.googleMap.googleMap?.panTo(latLng);

    // 🔁 Forza rigenerazione dei marker
    if (this.attivitas) {
      this.updateMarkerPositions(this.attivitas);
    }
  }

  onScroll(container: HTMLElement): void {
  // Debounce per evitare troppe chiamate
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = -1;
      let closestDistance = Infinity;

      this.cardElements.forEach((cardRef, index) => {
        const card = cardRef.nativeElement as HTMLElement;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== -1 && this.attivitas && this.attivitas[closestIndex]) {
        const focusedAttivita = this.attivitas[closestIndex];
        if (focusedAttivita.idAttivita !== this.activeMarkerId) {
          this.onCardFocus(focusedAttivita);
        }
      }
    }, 30); // ritardo per stabilità dello scroll
  }


  
  /**
   * Recupera la posizione dell'utente, se possibile, altrimenti usa una posizione di default
   */
  private async getUserLocation(): Promise<void> {
    try {
      const position = await this.locationService.getCurrentLocation()
      await this.setCenterPosition(position.latitudine, position.longitudine);
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

      if (this.attivitas?.length) {
        this.onCardFocus(this.attivitas[0]);
      }
      
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

    this.markerOptionsList = attivitas.map((e, index) => {
      const imageUrl = this.getImmaginePrincipale(e);
      const isActive = e.idAttivita === this.activeMarkerId;

      return {
        draggable: false,
        icon: {
          url: this.createCircularMarker(imageUrl, isActive),
          scaledSize: new google.maps.Size(isActive ? 68 : 50, isActive ? 68 : 50),
          anchor: new google.maps.Point(32, 32)
        },
        zIndex: isActive ? 999 : index, // <-- attivo in primo piano
        title: e.nome
      };
    });
  }

  
  private createCircularMarker(imageUrl: string, isActive: boolean = false): string {
    const borderColor = isActive ? "#4DA6FF" : "#FFFFFF";  // blu se attivo, bianco se no
    const borderWidth = isActive ? 4 : 3;
    
    const svg = `
      <svg width="100" height="120" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="circleClip">
            <circle cx="50" cy="50" r="38"/>
          </clipPath>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <circle cx="50" cy="50" r="42" fill="#fff" stroke="${borderColor}" stroke-width="${borderWidth}" />
          <image x="12" y="12" width="76" height="76" href="${imageUrl}" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice" />
        </g>
        <!-- punta stile pin -->
        <path d="M50 92 L58 110 L42 110 Z" fill="${borderColor}" />
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

  getTipiAttivitaString(attivita: Attivita): string {
    return attivita.listaTipoAttivita?.map(t => t.descrizione).join(', ') ?? '';
  }


  markerClicked(markerPosition: google.maps.LatLngLiteral): void {
    const attivita = this.attivitas?.find(a =>
      a.latitudine === markerPosition.lat && a.longitudine === markerPosition.lng
    );

    if (attivita) {
      this.activeMarkerId = attivita.idAttivita;

      // Centra la mappa
      const latLng: google.maps.LatLngLiteral = {
        lat: attivita.latitudine,
        lng: attivita.longitudine
      };
      this.googleMap.googleMap?.panTo(latLng);

      // Aggiorna i marker
      this.updateMarkerPositions(this.attivitas!);

      // Mostra il dettaglio
      this.selectedAttivita = attivita;
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
            const data = await this.service.apiGetAttivitaByIdAttivita(idAttivita, this.idSoggetto);
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
