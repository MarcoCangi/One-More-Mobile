
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, provideRouter, RouteReuseStrategy } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getApp, initializeApp } from 'firebase/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { environment, firebaseConfig } from '../environments/environment';
import { Auth, GoogleAuthProvider, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getStorage, provideStorage } from '@angular/fire/storage'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HammerModule } from '@angular/platform-browser';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { GoogleMapsModule } from '@angular/google-maps';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AppCheckInterceptor } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/interceptors/app-check.interceptor';

import { AppComponent } from './app.component';
import { provideFirebaseApp } from '@angular/fire/app';
import { NavComponent } from './Pages/nav/nav.component';
import { UserCreateComponent } from './Pages/User/user-create/user-create.component';
import { UserDetailComponent } from './Pages/User/user-detail/user-detail.component';
import { LoginComponent } from './Pages/HomePage/login/login.component';
import { HomeComponent } from './Pages/HomePage/home/home.component';
import { ElencoPromoComponent } from './Pages/HomePage/HomePageWidgets/elenco-promo/elenco-promo.component';
import { ElencoConsigliComponent } from './Pages/HomePage/HomePageWidgets/elenco-consigli/elenco-consigli.component';
import { CardTipoAttivitaComponent } from './Pages/HomePage/HomePageWidgets/card-tipo-attivita/card-tipo-attivita.component';
import { FooterComponent } from './Pages/footer/footer.component';
import { MappaComponent } from './Pages/Maps/mappa/mappa.component';
import { DettaglioComponent } from './Pages/Attivita/ProfiloAttivita/dettaglio/dettaglio.component';
import { GalleriaDettaglioComponent } from './Pages/Attivita/ProfiloAttivita/galleria dettaglio/galleria-dettaglio/galleria-dettaglio.component';
import { IngrandimentoImmagineDialogComponent } from './Pages/Attivita/ProfiloAttivita/galleria dettaglio/ingrandimento-immagine-dialog/ingrandimento-immagine-dialog.component';
import { DialogAttivitaComponent } from './Pages/Maps/dialog-attivita/dialog-attivita.component';
import { CapComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/cap/cap.component';
import { DatiStrutturaComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/dati-struttura.component';
import { CittaComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/citta/citta.component';
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
import { ConfermaEsitoComponent } from './Pages/Promo/conferma-esito/conferma-esito.component';
import { DialogConfermaComponent } from './Pages/Promo/dialog-conferma/dialog-conferma.component';
import { PannelloPromoComponent } from './Pages/Promo/pannello-promo/pannello-promo.component';
import { RicercaComponent } from './Pages/HomePage/ricerca/ricerca.component';
import { FavoritesComponent } from './Pages/favorites/favorites.component';
import { TipoOfferteComponent } from './Pages/HomePage/ricerca/tipo-offerte/tipo-offerte.component';
import { DistanzaComponent } from './Pages/Maps/mappa/distanza/distanza.component';
import { CouponComponent } from './Pages/coupon/coupon.component';
import { DettaglioCouponComponent } from './Pages/coupon/dettaglio-coupon/dettaglio-coupon.component';
import { ConfirmModalComponent } from './Pages/coupon/confirm-modal/confirm-modal.component'
import { DettaglioCouponNonAttComponent } from './Pages/coupon/dettaglio-coupon-non-att/dettaglio-coupon-non-att.component';
import { InfoRegistrazioneAttivitaComponent } from './Pages/Attivita/info-registrazione-attivita/info-registrazione-attivita.component';
import { ConfermaDisattivazionePromoComponent } from './Pages/Attivita/ProfiloAttivita/riepilogo-promo-attivita/conferma-disattivazione-promo/conferma-disattivazione-promo.component';
import { ElencoViciniComponent } from './Pages/HomePage/HomePageWidgets/elenco-vicini/elenco-vicini.component';
import { EsitoGestionePromoComponent } from './Pages/Attivita/ProfiloAttivita/riepilogo-promo-attivita/esito-gestione-promo/esito-gestione-promo.component';
import { IconCittaComponent } from './Pages/HomePage/HomePageWidgets/icon-citta/icon-citta.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from '@angular/fire/app-check';
import { FormRiepilogoComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/googleAutocomplete/form-riepilogo/form-riepilogo.component';
import { RicercaAttivitaAutocompleteComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/googleAutocomplete/ricerca-attivita-autocomplete/ricerca-attivita-autocomplete.component';
import { RichiestaTipoCompilazioneComponent } from './Pages/Attivita/RegistraAttivita/dati-struttura/googleAutocomplete/richiesta-tipo-compilazione/richiesta-tipo-compilazione.component';
import { OrariDettaglioComponent } from './Pages/Attivita/ProfiloAttivita/dettaglio/orari-dettaglio/orari-dettaglio.component';
import { GoogleMap } from '@angular/google-maps';
import { Capacitor } from '@capacitor/core';
import { GetApiComuniService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-comuni.service';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { FileUploadService } from 'one-more-frontend-common/projects/one-more-fe-service/src/file-upload-service.service';
import { UserService } from 'one-more-frontend-common/projects/one-more-fe-service/src/user-service';
import { Constants } from 'one-more-frontend-common/projects/one-more-fe-service/src/Constants';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { SearchPromoByCategoryComponent } from './Pages/HomePage/HomePageWidgets/search-promo-by-category/search-promo-by-category.component';

const appRoute: Routes = [
  { path: "", component:HomeComponent },
  { path: "mappa", component:MappaComponent },
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent,
                 NavComponent,
                 LoginComponent,
                 HomeComponent,
                 SearchPromoByCategoryComponent,
                 ElencoPromoComponent,
                 ElencoConsigliComponent,
                 CardTipoAttivitaComponent,
                 UserCreateComponent,
                 UserDetailComponent,
                 FooterComponent,
                 MappaComponent,
                 DialogAttivitaComponent,
                 DettaglioComponent,
                 GalleriaDettaglioComponent,
                 IngrandimentoImmagineDialogComponent,
                 CapComponent,
                 DatiStrutturaComponent,
                 CittaComponent,
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
                 ConfermaEsitoComponent,
                 DialogConfermaComponent,
                 PannelloPromoComponent,
                 RicercaComponent,
                 FavoritesComponent,
                 TipoOfferteComponent,
                 DistanzaComponent,
                 CouponComponent,
                 DettaglioCouponComponent,
                 ConfirmModalComponent,
                 DettaglioCouponNonAttComponent,
                 InfoRegistrazioneAttivitaComponent,
                 ConfermaDisattivazionePromoComponent,
                 ElencoViciniComponent,
                 IconCittaComponent,
                 EsitoGestionePromoComponent,
                 RicercaAttivitaAutocompleteComponent,
                 RichiestaTipoCompilazioneComponent,
                 FormRiepilogoComponent,
                 OrariDettaglioComponent
  ],
  imports: [BrowserModule,
            HttpClientModule,
            TranslateModule.forRoot({
              loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
              }
            }),
            FontAwesomeModule,
            RouterModule.forRoot(appRoute),
            IonicModule.forRoot(), 
            BrowserAnimationsModule,
            HttpClientModule,
            FormsModule,
            ReactiveFormsModule,
            GoogleMapsModule,
            GoogleMap,
            HammerModule,
            ToastrModule.forRoot(),
            RecaptchaModule,
            RecaptchaFormsModule,
            AngularFireMessagingModule,
            ServiceWorkerModule.register('firebase-messaging-sw.js', {
              enabled: environment.production && !Capacitor.isNativePlatform(),
              registrationStrategy: 'registerWhenStable:30000'
            }),
          ],
          providers: [
            { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
            { provide: HTTP_INTERCEPTORS, useClass: AppCheckInterceptor, multi: true },

            GetApiAttivitaService,
            InAppBrowser,
            GetApiPromoService,
            GetApiComuniService,
            FileUploadService,
            AuthService,
            UserService,
            GoogleAuthProvider,
            Constants,
            provideAnimations(),
            importProvidersFrom([
              provideFirebaseApp(() => initializeApp(firebaseConfig)),
              provideAuth(() => {
                if (Capacitor.isNativePlatform()) {
                  return initializeAuth(getApp(), {
                    persistence: indexedDBLocalPersistence
                  });
                } else {
                  return getAuth();
                }
              }),
              provideFirestore(() => getFirestore()),
              provideStorage(() => getStorage()),
              provideAppCheck(() =>
                initializeAppCheck(undefined, {
                  provider: Capacitor.isNativePlatform()
                    ? new CustomProvider({
                        getToken: async () => {
                          const { FirebaseAppCheck } = await import('@capacitor-firebase/app-check');
                          const result = await FirebaseAppCheck.getToken();
                          return {
                            token: result.token,
                            expireTimeMillis: Date.now() + 60 * 60 * 1000,
                          };
                        }
                      })
                    : new ReCaptchaV3Provider('auto'),
                  isTokenAutoRefreshEnabled: true
                })
              )
            ]),
            {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
            {
              provide: DateAdapter,
              useClass: MomentDateAdapter,
              deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
            },
            {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
          ],
          bootstrap: [AppComponent],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
