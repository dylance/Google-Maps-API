//steven bryder? udemy
var map;
var markers = [];
var data = null

function initMap() {
    //Constructor creates a new map - only center and zoom are required
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.001201, lng: -118.806442},
        zoom: 13,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
        ],
        mapTypeControl: false
    });

    // Marker Locations
    var locations = [
        {title: 'Pt Dume', location: {lat: 34.001201,lng: -118.806442}},
        {title: 'Leo Carillo', location: {lat: 34.044551,lng:-118.940695}},
        {title: 'County Line', location: {lat: 34.051425,lng: -118.95996}},
        {title: 'Malibu Pt', location: {lat: 34.036265 ,lng: -118.67795}},
        {title: 'Westward Beach', location: {lat: 34.008341 ,lng: -118.814812}}
    ];

    var largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    ///////
    //var bounds = new google.maps.LatLngBounds();
    ///////
    // creates array of markers

    for (var i = 0; i < locations.length; i++) {

        var position = locations[i].location;
        var title = locations[i].title

        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            // below lines allow markers to be visible at beginning of map creation. 
            //map: map
        });

        markers.push(marker);

        //bounds.extend(marker.position);

        marker.addListener('click', function(){
            populateInfoWindow(this,largeInfowindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,
         // to change the colors back and forth.
         marker.addListener('mouseover', function() {
           this.setIcon(highlightedIcon);
         });
         marker.addListener('mouseout', function() {
           this.setIcon(defaultIcon);
         });
    }

    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);

}
    // map.fitBounds(bounds);
    // populates info window whem marker is clicked.
function populateInfoWindow(marker, infowindow){
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // clear marker property if info window closed
        infowindow.addListener('closeclick', function(){
            infowindow.setMarker(null);
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status){
            if ( status == google.maps.StreetViewStatus.OK){
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: -30
                    }
                };
            var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            }
            else {
                infowindow.setContent('<div>No Street View Found</div>');
            }
        }
    // use street to get cloest streetview image within
    // 50 meters of teh markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    //open info window on correct marker
    infowindow.open(map, marker);
    }
}

var ViewModel = function(){
    var self = this


}
// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        // adds marker later to a map
        markers[i].setMap(map);
        // extends the bounds to contain the given point
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
    return markerImage;
}
