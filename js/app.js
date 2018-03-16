var map;

var markers = [];

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

    var bounds = new google.maps.LatLngBounds();

    // creates array of markers

    for (var i = 0; i < locations.length; i++) {

        var position = locations[i].location;
        var title = locations[i].title

        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        markers.push(marker);

        bounds.extend(marker.position);

        marker.addListener('click', function(){
            populateInfoWindow(this,largeInfowindow);
        });
    }
    map.fitBounds(bounds);

    // populates info window whem marker is clicked.
    function populateInfoWindow(marker, infowindow){
        if (infowindow.marker != marker){
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // clear marker property if info window closed
            infowindow.addListener('closeclick', function(){
                infowindow.setMarker(null);
            })
        }

    }

}





/*/ create marker
var tribeca =  {lat: 34.001201, lng: -118.806442};
var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'Pt Dume'
});
var infowindow = new google.maps.InfoWindow({
    content: 'This is my favorite surf spot'
});
marker.addListener('click', function() {
    infowindow.open(map,marker);
});
*/
