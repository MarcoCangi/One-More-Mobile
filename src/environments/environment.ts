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

// 🔹 Se sei in sviluppo, abilita il Debug Token (solo per localhost)
if (!environment.production && typeof window !== 'undefined') {
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "53da5101-3f7f-4452-86bb-223ce58ce81c";
}
