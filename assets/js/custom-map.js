var mapStyles = [{featureType:'water',elementType:'all',stylers:[{hue:'#d7ebef'},{saturation:-5},{lightness:54},{visibility:'on'}]},{featureType:'landscape',elementType:'all',stylers:[{hue:'#eceae6'},{saturation:-49},{lightness:22},{visibility:'on'}]},{featureType:'poi.park',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-81},{lightness:34},{visibility:'on'}]},{featureType:'poi.medical',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-80},{lightness:-2},{visibility:'on'}]},{featureType:'poi.school',elementType:'all',stylers:[{hue:'#c8c6c3'},{saturation:-91},{lightness:-7},{visibility:'on'}]},{featureType:'landscape.natural',elementType:'all',stylers:[{hue:'#c8c6c3'},{saturation:-71},{lightness:-18},{visibility:'on'}]},{featureType:'road.highway',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-92},{lightness:60},{visibility:'on'}]},{featureType:'poi',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-81},{lightness:34},{visibility:'on'}]},{featureType:'road.arterial',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-92},{lightness:37},{visibility:'on'}]},{featureType:'transit',elementType:'geometry',stylers:[{hue:'#c8c6c3'},{saturation:4},{lightness:10},{visibility:'on'}]}];

$.ajaxSetup({
    cache: true
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Google Map
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGoogleMap(_latitude, _longitude){
    setMapHeight();
    if( document.getElementById('map') != null ){
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            //maxZoom: 20,
            center: new google.maps.LatLng(_latitude, _longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapStyles
        });

//      setMarkers();

        $('body').addClass('loaded');
        setTimeout(function() {
            $('body').removeClass('has-fullscreen-map');
        }, 1000);
        $('#map').removeClass('fade-map');
    }
}

// Function which set markers on map
function setMarkers(locations) {
    var markerPool = [];
    var i;

    for (i = 0; i < locations.length; i++) {

        if (locations[i]['lat'] != '00.000000') {
            var pictureLabel = document.createElement("img");
            pictureLabel.src = "assets/img/property-types/empty.png";

            var boxText = document.createElement("div");

            infoboxOptions = {
                content: boxText,
                disableAutoPan: false,
                //maxWidth: 150,
                pixelOffset: new google.maps.Size(-100, 0),
                zIndex: null,
                alignBottom: true,
                boxClass: "infobox-wrapper",
                enableEventPropagation: true,
                closeBoxMargin: "0px 0px -8px 0px",
                closeBoxURL: "assets/img/close-btn.png",
                infoBoxClearance: new google.maps.Size(1, 1)
            };

            // Overcoming multiple overlapped markers with the same coordinates 
            // offset by a random number in the range [-0.0002; 0.0002]
            var lat = parseFloat(locations[i]['lat']) + (Math.random() * 2 - 1) / 5000;
            var lon = parseFloat(locations[i]['lon']) + (Math.random() * 2 - 1) / 5000;

            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(lat, lon),
                map: map,
                icon: 'assets/img/marker.png',
                labelContent: pictureLabel,
                labelAnchor: new google.maps.Point(50, 0),
                labelClass: "marker-style"
            });

            //markerPool.push(marker);
            markerPool[i] = marker;

            boxText.innerHTML =
                '<div class="infobox-inner">' +
                    '<div class="infobox-description">' +
                    '<div class="infobox-title">' + locations[i]['prefix'] + ', ' + locations[i]['date'] + ', ' + locations[i]['summ'] + ' руб.</div>' +
                    '<div class="infobox-location">' + locations[i]['contragent'] + '</div>' +
                    '</div>' +
                    '</div>';

            // Define the infobox
            markerPool[i].infobox = new InfoBox(infoboxOptions);

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    markerPool[i].infobox.open(map, this);
                }
            })(marker, i));

            // Fill the list of orders
            $('.list-unstyled').append('<li><a href="#" data-marker-id="' + i + '">' + locations[i]['contragent'] + '</a></li>');
        } else {
            $('.list-unstyled').append('<li>' + locations[i]['contragent'] + '</li>');
        }
    }

    $(document).on('click', 'li a', function(e) {         
        e.preventDefault();

        var markerId = $(this).attr('data-marker-id');
        var marker = markerPool[markerId];

        if (marker) {
            //map.setCenter(marker.getPosition());
            map.panTo(marker.getPosition());
            google.maps.event.trigger(marker, 'click');
        }
    });

    var clusterStyles = [
        {
            url: 'assets/img/cluster.png',
            height: 37,
            width: 37
        }
    ];

    var markerCluster = new MarkerClusterer(map, markerPool, {styles: clusterStyles, maxZoom: 15});
}