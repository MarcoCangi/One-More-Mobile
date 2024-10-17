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
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: {
      url:"assets/Img/Marker.png",
      scaledSize: new google.maps.Size(40, 50), // Regola le dimensioni come necessario
      fillColor: '#FF0000', // Colore di riempimento
      fillOpacity: 0.8, // Opacità del riempimento
      strokeWeight: 2, // Spessore del bordo
      strokeColor: '#000000' // Colore del bordo
    }
  };
  filter!: FiltriAttivita;
  // Modal states
  isDetailModalOpen = false;
  isListModalOpen = false;
  isFilterModalOpen = false;
  listaAttivitaDDL: TipoAttivita[] | undefined;
  isLimitEnabled: boolean = false;
  isPositionLoaded: boolean = false;
  isMooving: boolean = false;

  constructor(private service: GetApiAttivitaService) {}

  async ngOnInit(): Promise<void> {
    this.isRicerca = false;
    this.isLoading = true;
    this.filter= new FiltriAttivita();
    this.attivitaFiltrate = this.service.getListaAttivita();
    if (this.attivitaFiltrate == undefined || this.attivitaFiltrate == null) {
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            this.position = position;
            await this.setCenterPosition(position.coords.latitude, position.coords.longitude);
            this.filter.latitudine = this.center.lat;
            this.filter.longitudine = this.center.lng;
            setTimeout(async () => {
              await this.initMap();
            }, 200);
          },
          async (error) => {
            await this.setCenterPosition(41.9028, 12.4964);
            this.filter.latitudine = this.center.lat;
            this.filter.longitudine = this.center.lng;
  
            setTimeout(async () => {
              await this.initMap();
            }, 200);
          }
        );
      }
    }
    else {
      await this.setCenterPosition(this.attivitaFiltrate.latitudine, this.attivitaFiltrate.longitudine);
      this.isListModalOpen = this.service.getIsListaModalOpen();
      if(this.isListModalOpen)
        this.service.setIsListaAttModalOpen(false);
      setTimeout(async () => {
        await this.initMap();
      }, 200);
    }
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
    
    if(this.filter && this.filter.isMovingMap){
      if(this.attivitaFiltrate && this.attivitaFiltrate.listaAttivita)
        this.attivitaFiltrate = null;
      const sessionfilter = this.service.getFilter();
      if(sessionfilter){
        this.filter.citta = sessionfilter.citta ? sessionfilter.citta : undefined;
        this.filter.nome = sessionfilter.nome ? sessionfilter.nome : undefined;
        this.filter.codTipoPromo = sessionfilter.codTipoPromo ? sessionfilter.codTipoPromo : undefined;
        this.filter.codTipoAttivita = sessionfilter.codTipoAttivita ? sessionfilter.codTipoAttivita : undefined;
      }
    }

    const bounds = map.getBounds();
    try {
      if (this.attivitaFiltrate &&
          this.attivitaFiltrate.listaAttivita &&
          this.attivitaFiltrate.latitudine &&
          this.attivitaFiltrate.longitudine) {
          
          this.attivitaFiltrate.listaAttivita.forEach(e => {
            if (e.latitudine != undefined && e.longitudine != undefined) {
              const marker = new google.maps.LatLng({ lat: e.latitudine, lng: e.longitudine });
              this.markerPositions.push(marker.toJSON());
            }
          });

          this.attivitas = this.attivitaFiltrate.listaAttivita;
          this.isRicerca = true;
          this.service.resetListaAttivitaFiltrate();
        }
      else{

        if(this.filter && !this.filter.latitudine && !this.filter.longitudine){
          const getCurrentPositionPromise = (): Promise<GeolocationPosition> => {
            return new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
          };
        
          if (navigator.geolocation) {
            try {
              const position = await getCurrentPositionPromise();
              this.filter.latitudine = position.coords.latitude;
              this.filter.longitudine = position.coords.longitude;
            } catch (error) {
              console.log(error);
            }
          }
        }

        const observable = await this.service.apiGetListaAttivitaFiltrate(this.filter);
        const data = await firstValueFrom(observable);
        const allAttivitas = data.listaAttivita;
        if (bounds) {
          const filterAttivita = allAttivitas.filter(e => {
            if (e.latitudine !== undefined && e.longitudine !== undefined) {
                const position = new google.maps.LatLng({ lat: e.latitudine, lng: e.longitudine });
                if (bounds.contains(position)) {
                    this.markerPositions.push(position.toJSON());
                    return true; // Include l'attività se è visibile nella mappa
                }
            }
            return false;
        });


        this.attivitas = filterAttivita;
        this.markerPositions = [];
        this.attivitas.forEach(e => {
                if (e.latitudine !== undefined && e.longitudine !== undefined) {
                    const position = new google.maps.LatLng({ lat: e.latitudine, lng: e.longitudine });
                    this.markerPositions.push(position.toJSON());
                }
            });
          }
      }
    } catch (error) {
        console.error("Errore durante la chiamata API:", error);
    } finally {
        this.isLoading = false;
    }
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

  popoverDismissed(){
    this.isDetailModalOpen = false;
    this.selectedAttivita = undefined;
  }
}
