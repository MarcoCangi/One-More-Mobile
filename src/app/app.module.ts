
import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, provideRouter, RouteReuseStrategy } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { getApp, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { firebaseConfig } from '../environments/environment';
import { Auth, GoogleAuthProvider, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getStorage, provideStorage } from '@angular/fire/storage'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HammerModule } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { GoogleMapsModule } from '@angular/google-maps';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { GetApiAttivitaService } from './Services/get-api-attivita.service';
import { GetApiPromoService } from './Services/get-api-promo.service';
import { UserService } from './Services/user-service';
import { GetApiComuniService } from './Services/get-api-comuni.service';
import { FileUploadService } from './Services/file-upload-service';
import { AuthService } from './Services/Auth/auth.service';
import { provideFirebaseApp } from '@angular/fire/app';
import { CookieService } from 'ngx-cookie-service';
import { NavComponent } from './Pages/HomePage/nav/nav.component';
import { RegistrazioneComponent } from './Pages/HomePage/registrazione/registrazione.component';
import { LoginComponent } from './Pages/HomePage/login/login.component';
import { HomeComponent } from './Pages/HomePage/home/home.component';
import { ElencoPromoComponent } from './Pages/HomePage/elenco-promo/elenco-promo.component';
import { ElencoConsigliComponent } from './Pages/HomePage/elenco-consigli/elenco-consigli.component';
import { CardTipoAttivitaComponent } from './Pages/HomePage/card-tipo-attivita/card-tipo-attivita.component';
import { IconPromoComponent } from './Pages/HomePage/icon-promo/icon-promo.component';
import { FooterComponent } from './Pages/HomePage/footer/footer.component';
import { MappaComponent } from './Pages/Maps/mappa/mappa.component';
import { DettaglioComponent } from './Pages/Attivita/ProfiloAttivita/dettaglio/dettaglio.component';
import { GalleriaDettaglioComponent } from './Pages/Attivita/ProfiloAttivita/galleria dettaglio/galleria-dettaglio/galleria-dettaglio.component';
import { IngrandimentoImmagineDialogComponent } from './Pages/Attivita/ProfiloAttivita/galleria dettaglio/ingrandimento-immagine-dialog/ingrandimento-immagine-dialog.component';
import { DialogAttivitaComponent } from './Pages/Maps/dialog-attivita/dialog-attivita.component';
import { CapComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/cap/cap.component';
import { DatiStrutturaComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/dati-struttura.component';
import { CittaComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/citta/citta.component';
import { CellulareComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/cellulare/cellulare.component';
import { CivicoComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/civico/civico.component';
import { EmailComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/email/email.component';
import { IndirizzoComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/indirizzo/indirizzo.component';
import { NomeComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/nome/nome.component';
import { OfferteStrutturaComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/offerte-struttura/offerte-struttura.component';
import { OrariAperturaComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/orari-apertura/orari-apertura.component';
import { TelefonoComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/telefono/telefono.component';
import { TipoAttivitaComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/tipo-attivita/tipo-attivita.component';
import { DialogEsitoRegistrazioneComponent } from './Pages/Attivita/RegistraAttivita/dialog-esito-registrazione/dialog-esito-registrazione.component';
import { DialogGalleryComponent } from './Pages/Attivita/RegistraAttivita/gallery/dialog-gallery/dialog-gallery.component';
import { GalleryComponent } from './Pages/Attivita/RegistraAttivita/gallery/gallery.component';
import { AreaUtenteComponent } from './Pages/area-utente/area-utente.component';
import { CognomeUtenteComponent } from './Pages/area-utente/cognome-utente/cognome-utente.component';
import { EmailUtenteComponent } from './Pages/area-utente/email-utente/email-utente.component';
import { NomeUtenteComponent } from './Pages/area-utente/nome-utente/nome-utente.component';
import { PromoAttiveUtenteComponent } from './Pages/area-utente/promo-attive-utente/promo-attive-utente.component';
import { PromoUtilizzateUtenteComponent } from './Pages/area-utente/promo-utilizzate-utente/promo-utilizzate-utente.component';
import { ClosableAlertComponent } from './Pages/Common/closable-alert/closable-alert.component';
import { ConfirmDialogComponent } from './Pages/Common/confirm-dialog/confirm-dialog.component';
import { InfoComponent } from './Pages/info/info.component';
import { LogoutComponent } from './Pages/HomePage/logout/logout.component';
import { MenuComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/menu/menu.component';
import { GestionePromoComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/gestione-promo.component';
import { RiepilogoPromoAttivitaComponent } from './Pages/Attivita/ProfiloAttivita/riepilogo-promo-attivita/riepilogo-promo-attivita.component';
import { CouponPerPersonaComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/coupon-per-persona/coupon-per-persona.component';
import { DescrizioneComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/descrizione/descrizione.component';
import { GiorniValiditaComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/giorni-validita/giorni-validita.component';
import { NumMaxCouponComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/num-max-coupon/num-max-coupon.component';
import { OrarioValiditaComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/orario-validita/orario-validita.component';
import { PeriodoValiditaComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/periodo-validita/periodo-validita.component';
import { TipologiaOffertaComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/tipologia-offerta/tipologia-offerta.component';
import { TitoloComponent } from './Pages/Attivita/ProfiloAttivita/gestione-promo/titolo/titolo.component';
import { ConfermaEliminazionePromoComponent } from './Pages/Attivita/ProfiloAttivita/riepilogo-promo-attivita/conferma-eliminazione-promo/conferma-eliminazione-promo.component';
import { ConfermaEsitoComponent } from './Pages/Promo/conferma-esito/conferma-esito.component';
import { DialogConfermaComponent } from './Pages/Promo/dialog-conferma/dialog-conferma.component';
import { PannelloPromoComponent } from './Pages/Promo/pannello-promo/pannello-promo.component';
import { RicercaComponent } from './Pages/HomePage/ricerca/ricerca.component';
import { FavoritesComponent } from './Pages/favorites/favorites.component';
import { TipoOfferteComponent } from './Pages/Maps/mappa/tipo-offerte/tipo-offerte.component';
import { DistanzaComponent } from './Pages/Maps/mappa/distanza/distanza.component';
import { CouponComponent } from './Pages/coupon/coupon.component';
import { DettaglioCouponComponent } from './Pages/coupon/dettaglio-coupon/dettaglio-coupon.component';
import { ConfirmModalComponent } from './Pages/coupon/confirm-modal/confirm-modal.component';

import { Capacitor } from '@capacitor/core';

const appRoute: Routes = [
  { path: "", component:HomeComponent },
  { path: "mappa", component:MappaComponent },
];

@NgModule({
  declarations: [AppComponent,
                 NavComponent,
                 LoginComponent,
                 HomeComponent,
                 ElencoPromoComponent,
                 ElencoConsigliComponent,
                 CardTipoAttivitaComponent,
                 IconPromoComponent,
                 RegistrazioneComponent,
                 FooterComponent,
                 MappaComponent,
                 DialogAttivitaComponent,
                 DettaglioComponent,
                 GalleriaDettaglioComponent,
                 IngrandimentoImmagineDialogComponent,
                 CapComponent,
                 DatiStrutturaComponent,
                 CittaComponent,
                 CellulareComponent,
                 CivicoComponent,
                 EmailComponent,
                 IndirizzoComponent,
                 NomeComponent,
                 OfferteStrutturaComponent,
                 OrariAperturaComponent,
                 TelefonoComponent,
                 TipoAttivitaComponent,
                 DialogEsitoRegistrazioneComponent,
                 DialogGalleryComponent,
                 GalleryComponent,
                 AreaUtenteComponent,
                 CognomeUtenteComponent,
                 EmailUtenteComponent,
                 NomeUtenteComponent,
                 PromoAttiveUtenteComponent,
                 PromoUtilizzateUtenteComponent,
                 ClosableAlertComponent,
                 ConfirmDialogComponent,
                 InfoComponent,
                 LogoutComponent,
                 MenuComponent,
                 GestionePromoComponent,
                 RiepilogoPromoAttivitaComponent,
                 CouponPerPersonaComponent,
                 DescrizioneComponent,
                 GiorniValiditaComponent,
                 NumMaxCouponComponent,
                 OrarioValiditaComponent,
                 PeriodoValiditaComponent,
                 TipologiaOffertaComponent,
                 TitoloComponent,
                 ConfermaEliminazionePromoComponent,
                 ConfermaEsitoComponent,
                 DialogConfermaComponent,
                 PannelloPromoComponent,
                 RicercaComponent,
                 FavoritesComponent,
                 TipoOfferteComponent,
                 DistanzaComponent,
                 CouponComponent,
                 DettaglioCouponComponent,
                 ConfirmModalComponent
  ],
  imports: [BrowserModule, 
            AngularFireModule.initializeApp(firebaseConfig),
            AngularFireAuthModule,
            AngularFirestoreModule,
            FontAwesomeModule,
            RouterModule.forRoot(appRoute),
            IonicModule.forRoot(), 
            BrowserAnimationsModule,
            MatSlideToggleModule,
            MatStepperModule,
            MatIconModule,
            MatCardModule,
            MatButtonModule,
            HttpClientModule,
            MatInputModule,
            MatCheckboxModule,
            MatSelectModule,
            MatGridListModule,
            MatChipsModule,
            MatExpansionModule,
            MatAutocompleteModule,
            FormsModule,
            ReactiveFormsModule,
            GoogleMapsModule,
            MatToolbarModule,
            MatFormFieldModule,
            MatProgressBarModule,
            MatListModule,
            MatDialogModule,
            MatMenuModule,
            HammerModule,
            MatNativeDateModule,
            MatDatepickerModule,
            MatProgressSpinnerModule,
            MatSidenavModule,
            ToastrModule.forRoot(),
          ],
          providers: [
            { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
            GetApiAttivitaService,
            GetApiPromoService,
            GetApiComuniService,
            FileUploadService,
            AuthService,
            UserService,
            GoogleAuthProvider,
            provideAnimations(),
            importProvidersFrom([
              provideFirebaseApp(() => initializeApp(firebaseConfig)),
              // provideAuth(() => getAuth()),
              provideAuth(() => {
                if(Capacitor.isNativePlatform()) {
                  return initializeAuth(getApp(), {
                    persistence: indexedDBLocalPersistence
                  })
                } else {
                  return getAuth()
                }
              }),
              provideFirestore(() => getFirestore()),
              provideStorage(() => getStorage())
            ]),
            {
              provide: MatDialogRef,
              useValue: {}
            },
            MatDialog,
            {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
            {
              provide: DateAdapter,
              useClass: MomentDateAdapter,
              deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
            },
            {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
            CookieService
          ],
          bootstrap: [AppComponent],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
