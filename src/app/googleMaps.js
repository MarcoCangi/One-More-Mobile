// File: googleMaps.js

window.initMap = function() {
    var mapElement = document.getElementById('googleMap'); // Ottieni l'elemento della mappa
  
    // Funzione per gestire la posizione corrente
    function success(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
  
      var map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude }, // Usa le coordinate della tua posizione
        zoom: 16
      });
  
      // Aggiungi un marker per la tua posizione
      var marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'La tua posizione'
      });
    }
  
    // Funzione in caso di errore durante la geolocalizzazione
    function error() {
      console.error('Impossibile recuperare la tua posizione');
    }
  
    // Se il browser supporta la geolocalizzazione, ottieni la posizione corrente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error('Geolocalizzazione non supportata dal browser.');
    }
  };
  
  // Codice per caricare l'API di Google Maps
  (function() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdKNFrzvMZFnAZi-7VmVFgASuvOYXlF3k&callback=initMap';
    script.defer = true;
    document.head.appendChild(script);
  })();