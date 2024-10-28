import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";

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

// Solo per il Web: inizializza Firebase
if (!Capacitor.isNativePlatform()) {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const messaging = getMessaging(app);

  // Listener per le notifiche in foreground (solo web)
  onMessage(messaging, (payload) => {
    console.log('Notifica ricevuta in foreground (web):', payload);
  });
}