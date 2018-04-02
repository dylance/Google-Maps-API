let map;
let surfSpots = [
    {title: 'Pt Dume',
     location: {lat: 34.001201,lng: -118.806442},
     id: "854"},
    {title: 'Leo Carillo',
    location: {lat: 34.044551,lng:-118.940695},
    id: "2642"},
    {title: 'County Line',
    location: {lat: 34.051425,lng: -118.95996},
    id: "277"},
    {title: 'Malibu Pt',
    location: {lat: 34.036265 ,lng: -118.67795},
    id: "279"},
    {title: 'Westward Beach',
    location: {lat: 34.008341 ,lng: -118.814812},
    id: "2610"}
]
let mSWurl = "http://magicseaweed.com/api/c601eb5d859031e96bd33e9f0ea25b26/forecast/?spot_id=";
function initMap() {
    //Constructor creates a new map - only center and zoom are required
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.001201, lng: -118.806442},
        zoom: 12,
        styles:
        [
          {
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#fffec4"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#65a75e"
              },
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#a75808"
              }
            ]
          },

          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#247212"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#32e8ff"
              },
              {
                "weight": 4.5
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
              {
                "color": "#a305ff"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#fcff00"
              }
            ]
          }
        ],
    mapTypeControl: false;
    });
    ko.applyBindings(new ViewModel())
};

let surfSpot = function(data){
    self = this;

    this.name = data.title;
    this.spotID = data.id;
    this.url = mSWurl + this.spotID;
    this.swellHeight = null;
    this.swellDirection = null;
    this.swellPeriod = null;
    // TO DO: Add Images
    // this.imgSrc = ko.observableArray(data.imgSrc)
    // this.nickName = ko.observableArray(data.nickName)
    this.position = data.location;
    this.display = ko.observable(true);
    // Style the markers a bit. This will be our listing marker icon.
    let defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    let highlightedIcon = makeMarkerIcon('FFFF24');
    this.marker = new google.maps.Marker({
            position: this.position,
            title: this.name,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
    });

    magCopy(self.url, this)();

    let largeInfowindow = new google.maps.InfoWindow();

    this.marker.addListener('click',( function(markerCopy){
            return function() {
               populateInfoWindow(this,largeInfowindow, markerCopy);
           }
    })(self));
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.

    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });

    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });
}

let ViewModel = function(){
    let self = this;

    this.s = ko.observable('show spots!');
    this.d = ko.observable('hide spots!');
    this.filter =  ko.observable('');

    this.spotList = ko.observableArray([]);

    surfSpots.forEach(function(spot){
        self.spotList.push(new surfSpot(spot));
    })

    this.showSpot = function(clickedSpot){
        clickedSpot.marker.setMap(map);
        map.setZoom(15);
        map.panTo(clickedSpot.position);
    }
    // This function will loop through the markers array and display them all.
    this.showListings = function(){
        let bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        self.spotList().forEach(function(spot){
            spot.marker.setMap(map);
            bounds.extend(spot.position);
        })
        map.fitBounds(bounds);
    }
    // This function will loop through the listings and hide them all.
    this.hideListings = function(){
        self.spotList().forEach(function(spot){
            spot.marker.setMap(null);
        })
    }

    this.filteredItems = ko.computed(function(){
        let filter2 = self.filter().toLowerCase();

        if (!filter2){
            return self.spotList();
        }
        else {
            return ko.utils.arrayFilter(self.spotList(), function(spot){
                if ( spot.name.toLowerCase().indexOf(filter2) >= 0) {
                    return true;
                }
                else {
                    return false;
                }
            })
        }
    })
}
// populates info window whem marker is clicked.
function populateInfoWindow(marker, infowindow, self){
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + self.name + '</div>' +
            '<div> Wave height: ' + self.swellHeight + '</div>' +
            '<div> Swell Angle: ' + self.swellDirection + '</div>' +
            '<div> Swell Period: ' + self.swellPeriod + '</div>' +
            '<div> Swell data provided by magicseaweed.com   </div>');
        infowindow.open(map, marker);
        // clear marker property if info window closed
        infowindow.addListener('closeclick', function(){
            infowindow.setMarker = null;
        });
    }
    infowindow.open(map, marker);
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    let markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
    return markerImage;
}

function magCopy (urlcopy, spotCopy) {
    return function (){
        let f = spotCopy;
        $.ajax({
          url: urlcopy,
          dataType: "jsonp",
          success: function(data){
              f.swellHeight = data[0].swell.components.primary.height
              f.swellDirection = data[0].swell.components.primary.direction
              f.swellPeriod = data[0].swell.components.primary.period
          }
        }).fail(function(){alert("Magic SeaWeed API cold not be loaded")});
    }
}
