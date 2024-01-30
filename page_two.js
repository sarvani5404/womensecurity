var map;
var service;
var infowindow;

function initMap() {
  var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pyrmont = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infowindow.setPosition(pyrmont);
      infowindow.setContent('Location found.');
      infowindow.open(map);
      map.setCenter(pyrmont);

      var request = {
        location: pyrmont,
        radius: '500',
        query: 'police station',
        fields: ['name', 'formatted_address', 'international_phone_number', 'geometry']
      };

      service = new google.maps.places.PlacesService(map);
      service.textSearch(request, callback);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i], infowindow);
    }
  }
}

function createMarker(place, infowindow) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  var request = {
    reference: place.reference
  };

  service.getDetails(request, function(details, status) {
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(details.name + "<br />" + details.formatted_address + "<br />" + details.formatted_phone_number);
      infowindow.open(map, this);
    });
  });
}
