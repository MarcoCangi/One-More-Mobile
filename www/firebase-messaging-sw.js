/* eslint-disable */

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBV2_PYleiEY5cpNDsd-WDulEWQPihVdf8",
  authDomain: "one-more-angular.firebaseapp.com",
  projectId: "one-more-angular",
  storageBucket: "one-more-angular.appspot.com",
  messagingSenderId: "201102405242",
  appId: "1:201102405242:web:21e9b72a2df7994b82d5c3",
  measurementId: "G-EZX3VLQB86"
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  var notificationTitle = payload.notification.title;
  var notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Aggiungi un'icona se necessario
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});