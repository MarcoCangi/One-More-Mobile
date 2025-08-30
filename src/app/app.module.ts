
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getApp, initializeApp } from 'firebase/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { environment, firebaseConfig } from '../environments/environment';
import { GoogleAuthProvider, provideAuth } from '@angular/fire/auth';
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
import { FormPromoComponent } from './features/attivita/ProfiloAttivita/gestione-promo/form-promo/form-promo.component';
import { AppComponent } from './app.component';
import { provideFirebaseApp } from '@angular/fire/app';
import { NavComponent } from './shared/nav/nav.component';
import { RegistrazioneComponent } from './features/registrazione/registrazione.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { CardTipoAttivitaComponent } from './features/home/card-tipo-attivita/card-tipo-attivita.component';
import { IconPromoComponent } from './features//home//icon-promo/icon-promo.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MappaComponent } from './features/maps/mappa/mappa.component';
import { DettaglioComponent } from './features/attivita/ProfiloAttivita/dettaglio/dettaglio.component';
import { GalleriaDettaglioComponent } from './features/attivita/ProfiloAttivita/galleria dettaglio/galleria-dettaglio/galleria-dettaglio.component';
import { IngrandimentoImmagineDialogComponent } from './features/attivita/ProfiloAttivita/galleria dettaglio/ingrandimento-immagine-dialog/ingrandimento-immagine-dialog.component';
import { DialogAttivitaComponent } from './features/maps/dialog-attivita/dialog-attivita.component';
import { CapComponent } from './features/attivita/RegistraAttivita/dati-struttura/cap/cap.component';
import { DatiStrutturaComponent } from './features/attivita/RegistraAttivita/dati-struttura/dati-struttura.component';
import { CittaComponent } from './features/attivita/RegistraAttivita/dati-struttura/citta/citta.component';
import { CivicoComponent } from './features/attivita/RegistraAttivita/dati-struttura/civico/civico.component';
import { EmailComponent } from './features/attivita/RegistraAttivita/dati-struttura/email/email.component';
import { IndirizzoComponent } from './features/attivita/RegistraAttivita/dati-struttura/indirizzo/indirizzo.component';
import { NomeComponent } from './features/attivita/RegistraAttivita/dati-struttura/nome/nome.component';
import { OfferteStrutturaComponent } from './features/attivita/RegistraAttivita/dati-struttura/offerte-struttura/offerte-struttura.component';
import { OrariAperturaComponent } from './features/attivita/RegistraAttivita/dati-struttura/orari-apertura/orari-apertura.component';
import { TelefonoComponent } from './features/attivita/RegistraAttivita/dati-struttura/telefono/telefono.component';
import { TipoAttivitaComponent } from './features/attivita/RegistraAttivita/dati-struttura/tipo-attivita/tipo-attivita.component';
import { DialogEsitoRegistrazioneComponent } from './features/attivita/RegistraAttivita/dialog-esito-registrazione/dialog-esito-registrazione.component';
import { DialogGalleryComponent } from './features/attivita/RegistraAttivita/gallery/dialog-gallery/dialog-gallery.component';
import { GalleryComponent } from './features/attivita/RegistraAttivita/gallery/gallery.component';
import { AreaUtenteComponent } from './features/area-utente/area-utente.component';
import { CognomeUtenteComponent } from './features/area-utente/cognome-utente/cognome-utente.component';
import { EmailUtenteComponent } from './features/area-utente/email-utente/email-utente.component';
import { NomeUtenteComponent } from './features/area-utente/nome-utente/nome-utente.component';
import { PromoAttiveUtenteComponent } from './features/area-utente/promo-attive-utente/promo-attive-utente.component';
import { PromoUtilizzateUtenteComponent } from './features/area-utente/promo-utilizzate-utente/promo-utilizzate-utente.component';
import { InfoComponent } from './features/info/info.component';
import { LogoutComponent } from './features/logout/logout.component';
import { MenuComponent } from './features/attivita/RegistraAttivita/dati-struttura/menu/menu.component';
import { GestionePromoComponent } from './features/attivita/ProfiloAttivita/gestione-promo/gestione-promo.component';
import { RiepilogoPromoAttivitaComponent } from './features/attivita/ProfiloAttivita/riepilogo-promo-attivita/riepilogo-promo-attivita.component';
import { CouponPerPersonaComponent } from './features/attivita/ProfiloAttivita/gestione-promo/coupon-per-persona/coupon-per-persona.component';
import { DescrizioneComponent } from './features/attivita/ProfiloAttivita/gestione-promo/descrizione/descrizione.component';
import { GiorniValiditaComponent } from './features/attivita/ProfiloAttivita/gestione-promo/giorni-validita/giorni-validita.component';
import { NumMaxCouponComponent } from './features/attivita/ProfiloAttivita/gestione-promo/num-max-coupon/num-max-coupon.component';
import { OrarioValiditaComponent } from './features/attivita/ProfiloAttivita/gestione-promo/orario-validita/orario-validita.component';
import { PeriodoValiditaComponent } from './features/attivita/ProfiloAttivita/gestione-promo/periodo-validita/periodo-validita.component';
import { TipologiaOffertaComponent } from './features/attivita/ProfiloAttivita/gestione-promo/tipologia-offerta/tipologia-offerta.component';
import { TitoloComponent } from './features/attivita/ProfiloAttivita/gestione-promo/titolo/titolo.component';
import { ConfermaEsitoComponent } from './features/promo/conferma-esito/conferma-esito.component';
import { DialogConfermaComponent } from './features/promo/dialog-conferma/dialog-conferma.component';
import { PannelloPromoComponent } from './features/promo/pannello-promo/pannello-promo.component';
import { RicercaComponent } from './features/ricerca/ricerca.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { TipoOfferteComponent } from './features/ricerca/tipo-offerte/tipo-offerte.component';
import { DistanzaComponent } from './features/maps/mappa/distanza/distanza.component';
import { CouponComponent } from './features/coupon/coupon.component';
import { DettaglioCouponComponent } from './features/coupon/dettaglio-coupon/dettaglio-coupon.component';
import { ConfirmModalComponent } from './features/coupon/confirm-modal/confirm-modal.component'
import { DettaglioCouponNonAttComponent } from './features/coupon/dettaglio-coupon-non-att/dettaglio-coupon-non-att.component';
import { UserComponent } from './features/user/user.component';
import { InfoRegistrazioneAttivitaComponent } from './features/attivita/info-registrazione-attivita/info-registrazione-attivita.component';
import { ConfermaDisattivazionePromoComponent } from './features/attivita/ProfiloAttivita/riepilogo-promo-attivita/conferma-disattivazione-promo/conferma-disattivazione-promo.component';
import { IconCittaComponent } from './features/home/icon-citta/icon-citta.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from '@angular/fire/app-check';
import { FormRiepilogoComponent } from './features/attivita/RegistraAttivita/dati-struttura/googleAutocomplete/form-riepilogo/form-riepilogo.component';
import { RicercaAttivitaAutocompleteComponent } from './features/attivita/RegistraAttivita/dati-struttura/googleAutocomplete/ricerca-attivita-autocomplete/ricerca-attivita-autocomplete.component';
import { OrariDettaglioComponent } from './features/attivita/ProfiloAttivita/dettaglio/orari-dettaglio/orari-dettaglio.component';
import { GoogleMap } from '@angular/google-maps';
import { Capacitor } from '@capacitor/core';
import { GetApiComuniService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-comuni.service';
import { AuthService } from 'one-more-frontend-common/projects/one-more-fe-service/src/Auth/auth.service';
import { GetApiAttivitaService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-attivita.service';
import { GetApiPromoService } from 'one-more-frontend-common/projects/one-more-fe-service/src/get-api-promo.service';
import { FileUploadService } from 'one-more-frontend-common/projects/one-more-fe-service/src/file-upload-service.service';
import { UserService } from 'one-more-frontend-common/projects/one-more-fe-service/src/user-service';
import { Constants } from 'one-more-frontend-common/projects/one-more-fe-service/src/Constants';
import { RiepilogoComponent } from './features/attivita/RegistraAttivita/dati-struttura/riepilogo/riepilogo.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ConfirmComponent } from './features/attivita/RegistraAttivita/dati-struttura/confirm/confirm.component';
import { TermsConditionComponent } from './features/terms-condition/terms-condition.component';
import { AreaPromoComponent } from './features/attivita/ProfiloAttivita/gestione-promo/area-promo/area-promo.component';
import { SkeletonHomePageComponent } from './utilities/skeleton-home-page/skeleton-home-page.component';
import { CardHomePageComponent } from './utilities/card-home-page/card-home-page.component';
import { CarouselPromoComponent } from './features/home/carousel-promo/carousel-promo.component';
import { SecondaryCarouselPromoComponent } from './features/home/secondary-carousel-promo/secondary-carousel-promo.component';

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
                 CarouselPromoComponent,
                 SecondaryCarouselPromoComponent,
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
                 UserComponent,
                 InfoRegistrazioneAttivitaComponent,
                 ConfermaDisattivazionePromoComponent,
                 IconCittaComponent,
                 RicercaAttivitaAutocompleteComponent,
                 FormRiepilogoComponent,
                 OrariDettaglioComponent,
                 RiepilogoComponent,
                 ConfirmComponent,
                 FormPromoComponent,
                 TermsConditionComponent,
                 AreaPromoComponent,
                 SkeletonHomePageComponent,
                 CardHomePageComponent
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
            provideFirebaseApp(() => initializeApp(firebaseConfig)),

            provideAppCheck(() =>
                initializeAppCheck(undefined, {
                  provider: Capacitor.isNativePlatform()
                    ? new CustomProvider({
                        getToken: async () => {
                          const { FirebaseAppCheck } = await import('@capacitor-firebase/app-check');
                          await FirebaseAppCheck.setTokenAutoRefreshEnabled({ enabled: true });
                          const result = await FirebaseAppCheck.getToken();
                          return {
                            token: result.token,
                            expireTimeMillis: result.expireTimeMillis ?? (Date.now() + 60 * 60 * 1000),
                          };
                        }
                      })
                    : new ReCaptchaV3Provider('auto'),
                  isTokenAutoRefreshEnabled: true
                })
              ),
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
