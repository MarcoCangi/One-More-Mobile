import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';

export const firebaseConfig = {
  apiKey: "AIzaSyBV2_PYleiEY5cpNDsd-WDulEWQPihVdf8",
  authDomain: "one-more-angular.firebaseapp.com",
  projectId: "one-more-angular",
  storageBucket: "one-more-angular.appspot.com",
  messagingSenderId: "201102405242",
  appId: "1:201102405242:web:21e9b72a2df7994b82d5c3",
  measurementId: "G-EZX3VLQB86"
};

export const environment = {
  production: false
};

// Abilita il token di debug solo per l'ambiente di sviluppo
if (!environment.production) {
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "53da5101-3f7f-4452-86bb-223ce58ce81c"; // Questo abilita il debug token per localhost
}

const app = initializeApp(firebaseConfig);

// if (Capacitor.isNativePlatform()) {
//   // Piattaforme native (Android/iOS) con Play Integrity
//   initializeAppCheck(app, {
//     provider: new CustomProvider({
//       getToken: async () => {
//         // Logica per recuperare il token reale da Play Integrity
//         // Sostituisci questa logica se necessario
//         const tokenFromServer = 'debug-token'; // Usa un token reale in produzione
//         return {
//           token: tokenFromServer,
//           expireTimeMillis: Date.now() + 60 * 60 * 1000, // Valido per 1 ora
//         };
//       },
//     }),
//     isTokenAutoRefreshEnabled: true,
//   });
// } else {
//   // Web - usa il debug token
//   initializeAppCheck(app, {
//     provider: new CustomProvider({
//       getToken: async () => {
//         // Genera un debug token per testare le richieste su localhost
//         return {
//           token: 'debug-token', // Assicurati che sia registrato nella Firebase Console
//           expireTimeMillis: Date.now() + 60 * 60 * 1000,
//         };
//       },
//     }),
//     isTokenAutoRefreshEnabled: true,
//   });

  // Configura Analytics e Messaging solo per il Web
  const analytics = getAnalytics(app);
  const messaging = getMessaging(app);

  // Listener per notifiche in foreground
  onMessage(messaging, (payload) => {
    console.log('Notifica ricevuta in foreground (web):', payload);
  });

