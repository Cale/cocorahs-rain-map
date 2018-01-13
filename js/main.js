
// map
// http://leafletjs.com/examples/quick-start/example.html

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var state = "TN";
var stateName = "Tennessee";

var navHeight = $( "#nav" ).height();

$( "#map" ).height($(window).height() - navHeight);

$( window ).resize(function() {
    $( "#map" ).height($(window).height() - navHeight);
});

var mymap = L.map('map').setView([39.02772, -96.76758], 4);
var markers = new Array();
var rainArr = new Array();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Rain data <a href="https://creativecommons.org/licenses/by/3.0/">CC</a> <a href="http://www.cocorahs.org/">CoCoRaHS</a> | Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom:        18,
    detectRetina:   true,
    id:             'mapbox.light',
    accessToken:    'pk.eyJ1IjoiY2FsZSIsImEiOiJjaXd1eTN2amQwMHd3Mm9wcnNoc3Z4czFkIn0.8YNSxAQ0qONw-mUDcCQVmA'
}).addTo(mymap);

var icon1 = L.icon({
    iconUrl: 'images/marker-pin-zero.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

var icon2 = L.icon({
    iconUrl: 'images/marker-pin-trace.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

var icon3 = L.icon({
    iconUrl: 'images/marker-pin-3.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

var icon4 = L.icon({
    iconUrl: 'images/marker-pin-4.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

var icon5 = L.icon({
    iconUrl: 'images/marker-pin-5.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

var icon6 = L.icon({
    iconUrl: 'images/marker-pin-6.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

var icon7 = L.icon({
    iconUrl: 'images/marker-pin-7.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

var icon8 = L.icon({
    iconUrl: 'images/marker-pin-8.png',
    iconSize: [21, 35],
    iconAnchor: [0, 35],
    popupAnchor: [11, -30]
});

// Render Markers
placeMarkers = function( data ) {
    rainArr = new Array();
    var markerCount = data.result.length;

    for (var i = 0; i < markerCount; i++) {
        var markerData = data.result[i];
        var lat = markerData.lat;
        var lon = markerData.lng;
        var loc = markerData.st_name;
        var date = markerData.obs_date;
        var time = markerData.obs_time;
        var id = markerData.id;
        var station = markerData.st_num;
        var rain = markerData.prcp;
        var icon = 1;
        var snowfall = markerData.snowfall;

        if (rain === "0.00" || rain === "-2.00" ) {
            icon = icon1;
        } else if (rain === "-1.00") {
            icon = icon2;
        } else if (rain >= 2.99) {
            icon = icon8;
        } else if (rain >= 1.99) {
            icon = icon7;
        } else if (rain >= 0.99) {
            icon = icon6;
        } else if (rain >= 0.39 ) {
            icon = icon5;
        } else if (rain >= 0.19) {
            icon = icon4;
        } else if (rain > 0) {
            icon = icon3;
        }

        // Format precipitation number
        if (rain === "0.00") {
            rainArr.push(Number(rain));
            rain = '0"';
        } else if (rain === "-1.00") {
            rain = "Trace";
        } else if ( rain === "-2.00" ) {
            rain = "N/A"
        } else {
            rainArr.push(Number(rain));
            rain = rain+'"';
        }

        // Snowfall
        if (snowfall === "NA") {
            snowfall = "";
        } else if (snowfall === "0.00" || snowfall === "0.0") {
            snowfall = '<br>Snowfall: 0"';
        } else if (snowfall === "T") {
            snowfall = '<br>Snowfall: Trace';
        } else {
            snowfall = '<br>Snowfall: '+snowfall+'"';
        }

        var marker = L.marker([lat, lon], {icon: icon}).addTo(mymap).bindPopup('<div class="precip">'+rain+'</div><div class="location">'+loc+snowfall+'</div><div class="date">'+date+' '+time+' <a href="http://www.cocorahs.org/ViewData/ViewDailyPrecipReport.aspx?DailyPrecipReportID='+id+'" target="blank">'+station+'</a></div>');

        markers.push(marker);
        mymap.addLayer(markers[i]);
    }
    calculateAvgs();
}

// Remove Markers
removeMarkers = function() {
    for ( var i = 0; i < markers.length; i++ ) {
        mymap.removeLayer(markers[i]);
        if (i < markers.length - 1) {

        } else {
            markers = [];
        }
    }
}

// Get rain data
getData = function() {
    removeMarkers();
    var $stateOpt = $(".state").find('option:selected');
    var lat = $stateOpt.attr( "lat" );
    var lon = $stateOpt.attr( "lon" );
    state = $stateOpt.attr( "state" );
    stateName = $stateOpt.text();
    var zoom = $stateOpt.attr( "zoom" );
    dd = $(".day").find('option:selected').val()
    mm = $(".month").find('option:selected').val();
    yyyy = $(".year").find('option:selected').val();
    var date = mm+"%2F"+dd+"%2F"+yyyy;

    var latlng = L.latLng(lat, lon);
    mymap.panTo(latlng, {animate:false}).setZoom(zoom);

    var url = "data/rain-by-state.php?state="+state+"&date="+date;
    //var url = "data/tn-data.json"; // test data

    $.getJSON( url, function( data ) {
        placeMarkers(data);
    });
}

setDropdowns = function() {
    $('.state option[state=TN]').prop('selected',true);
    $('.day option[value='+dd+']').prop('selected',true);
    $('.month option[value='+mm+']').prop('selected',true);
    $('.year option[value='+yyyy+']').prop('selected',true);
    getData();
}

$( ".state" ).change( function() {
    getData();
});
$( ".day" ).change( function() {
    getData();
});
$( ".month" ).change( function() {
    getData();
});
$( ".year" ).change( function() {
    getData();
});

calculateAvgs = function() {
    var sum = 0;
    var avg = 0;
    var med = 0;
    var max = 0;

    for( var i = 0; i < rainArr.length; i++ ) {
        sum += rainArr[i];
    }

    avg = sum/rainArr.length;
    max = Math.max(...rainArr);

    // Median
    function calculateMedian(rainArr){
        rainArr.sort(function(a, b) {
            return a - b;
        });
        var i = rainArr.length/2;
        i % 1 === 0 ? med = rainArr[i-1] : med = (rainArr[Math.floor(i)-1] + rainArr[Math.floor(i)])/2;
        return med;
    }

    $( ".state-name" ).text(stateName);
    $( ".max" ).text(max);
    $( ".avg" ).text(avg.toFixed(2));
    $( ".med" ).text(calculateMedian(rainArr).toFixed(2));
}

$( document ).ready( function(){
    setDropdowns();
});
