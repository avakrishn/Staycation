 // Initialize Firebase
//  var config = {
//     apiKey: "AIzaSyAqCpGYf4cTEVY92frXrlHvt4sCN4RrsVw",
//     authDomain: "travel-app-410d0.firebaseapp.com",
//     databaseURL: "https://travel-app-410d0.firebaseio.com",
//     projectId: "travel-app-410d0",
//     storageBucket: "travel-app-410d0.appspot.com",
//     messagingSenderId: "979814528498"
//   };
//   firebase.initializeApp(config);

//   var database = firebase.database();

var name;
// var lat;
// var lon;

$(document).ready(function(){

    $('#search').on('click', function(){
        event.preventDefault();
        if( $('#checkbox').is(':checked')){
            getLocation();
            
        }
        else{
            alert('Please enable your location.');
        }

    })
    // $('#checkbox').change(function(){
    //     event.preventDefault();
    //     if( $('#checkbox').is(':checked')){
    //         getLocation();
    //     }
    // });

});

function getLocation() {
    event.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }  
}
function showPosition(position) {
   lat = position.coords.latitude;
   lon = position.coords.longitude;
   console.log(lat , lon);
//    setTimeout(function(){
        weather(lat, lon);
        restaurant(lat, lon);
        // getFoursquare(lat, lon); 
        yelpLocations(lat, lon);
        yelpEvents(lat,lon);
        display();
       
    // }, 6000);
}

function display(){
    $('#hide').hide();
    $('#show').show();

}




$(document).on('click', '#search', function(){
    event.preventDefault();
    if($('#name').val().trim() !== ""){
        name = $('#name').val().trim();
    }

    // database.ref('/user').push({
    //     name: name,
    //     lat: lat,
    //     lon: lon, 
    //     dateAdded: firebase.database.ServerValue.TIMESTAMP
    // });
    
    // window.location.href = "https://avakrishn.github.io/travel-app/info.html";
    
});

// function api(){
//     restaurant();
//     events();
// }

function restaurant(x,y) {
    $.ajax({  
        url: "https://developers.zomato.com/api/v2.1/search",
        dataType: 'json',
        data: { 
        lat: x, 
        lon: y
        },
        async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 
        'faafc11160a617b55a560feef06b483c');},  // This inserts the api key into the HTTP header
        success: function(response) { 
            console.log(response) 
        } });
}

var APIKey = "3cde5a9db34a7bc318d935fbac26a604";
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&"+"lon="+lon+"&APPID="+APIKey;

function weather(x,y){
var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+x+"&"+"lon="+y+"&APPID="+APIKey;
console.log(queryURL);
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    // Create CODE HERE to Log the queryURL
    console.log(response)
    var iconURL = response.weather[0].icon;
    var weatherIcon = $('<img>').attr('src','http://openweathermap.org/img/w/'+iconURL+'.png');
    var temp = $('<span>').html(response.main.temp);
    var city = $('<span>').html(response.name);
    var description = $('<p>').html(response.weather[0].description);
    $('#weather').append(weatherIcon, temp, city, description);

  });
}

function getFoursquare(x,y){
    var url = "https://api.foursquare.com/v2/venues/categories?client_id=C3RL0TDP2E1I4JKKVUIGQGK41LS3L3QIUZGKI1DQWI0RZTOC&client_secret=B4OJE5X30WB2PC41CIIYOMJORHM1TN4M31NAOFUQZEJSAYL4&ll="+x+","+y+"&v=20180713";
    $.ajax({
      url: url,
      dataType: 'json',
      data: { 
        lat: x, 
        lng: y
        },
      success: function(response){
      console.log(response) 
      }
    });
  };

  function yelpLocations(x,y){
    // var rapid = new RapidAPI("default-application_5b4a33cae4b004833ec270ad", "3ad9125a-b897-4679-9417-020f62576786");
    // var RapidAPI = new require('rapidapi-connect');
    var rapid = new RapidAPI('default-application_5b4a33cae4b004833ec270ad', '3ad9125a-b897-4679-9417-020f62576786');

    rapid.call('YelpAPI', 'getBusinesses', { 
        'term': 'attractions',
        'openNow': 'true',
        'accessToken': '3h3aitdeSr9OUymm7UYBzQbS1AqxncwCG_Ieoxc_iL1lAXM9w-sGH53FIWZn0LO_z-IVNFX3NZ6JDTZ01NKd5pcvmsgbT2S1_U3d95ARe4DBsBz6zgREijpNSDdKW3Yx',
        'latitude': x,
        'longitude': y,
        'attributes': ['', '']


    }).on('success', function(res){
        console.log(res);

        /*YOUR CODE GOES HERE*/ 
    }).on('error', function(res){
        /*YOUR CODE GOES HERE*/ 
        console.log('Error');
    });

  }

  function yelpEvents(x,y){
    var rapid = new RapidAPI("default-application_5b4a341ce4b0fd573002f094", "deaaa550-92ad-4d67-8742-180e2230c626");

    rapid.call('YelpAPI', 'searchEvent', { 
        'coordinates': '37.7916153, -122.3935686',
        'accessToken': '3h3aitdeSr9OUymm7UYBzQbS1AqxncwCG_Ieoxc_iL1lAXM9w-sGH53FIWZn0LO_z-IVNFX3NZ6JDTZ01NKd5pcvmsgbT2S1_U3d95ARe4DBsBz6zgREijpNSDdKW3Yx',
        'limit': '20',
        // 'sortOn': 'time_start',
        'radius': '10000',
        'startDate': '2018-07-14',
        'endDate': '2018-07-14',
        // 'categories': ['', '']

    }).on('success', function (res) {
        console.log(res);
        /*YOUR CODE GOES HERE*/ 
    }).on('error', function (res) {
        console.log('Error');
        /*YOUR CODE GOES HERE*/ 
});
  }
  

//   var url = "https://api.foursquare.com/v2/venues/explore?client_id=C3RL0TDP2E1I4JKKVUIGQGK41LS3L3QIUZGKI1DQWI0RZTOC&client_secret=B4OJE5X30WB2PC41CIIYOMJORHM1TN4M31NAOFUQZEJSAYL4&ll="+x+","+y+"&section=outdoors"+"&v=20180713";

//   var url = "https://api.foursquare.com/v2/venues/explore?client_id=C3RL0TDP2E1I4JKKVUIGQGK41LS3L3QIUZGKI1DQWI0RZTOC&client_secret=B4OJE5X30WB2PC41CIIYOMJORHM1TN4M31NAOFUQZEJSAYL4&ll="+x+","+y+"&v=20180713";

//   https://api.foursquare.com/v2/venues/search?client_id=C3RL0TDP2E1I4JKKVUIGQGK41LS3L3QIUZGKI1DQWI0RZTOC&client_secret=B4OJE5X30WB2PC41CIIYOMJORHM1TN4M31NAOFUQZEJSAYL4&ll=37.7749,122.4194&query=sushi%20&v=20180713

// var APIKey = "A62VTLTSJ426S2K2IW7J";

// function events (x,y){
// var queryURL = "https://www.eventbriteapi.com/v3/events/search/"+"token="+APIKey;
// $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function(response) {

//     // Create CODE HERE to Log the queryURL
//     console.log(response)
//   });
// }

// function events() {
//     $.ajax({ 
//       url: "https://www.eventbriteapi.com/v3/events/search",
//       dataType: 'json',
//       headers: {
//         'Content-Type': 'text/html; charset=utf-8'
//       },
//       // data: {
//       //   location: [
//       //     {
//       //       latitude: lat,
//       //       longitude: lon
//       //     }
//       //   ],
//       // },
//       async: true,
//       beforeSend: function(xhr){xhr.setRequestHeader('token', 
//       'A62VTLTSJ426S2K2IW7J');}, // This inserts the api key into the HTTP header
//       success: function(response) { 
//         console.log(response) 
//       } });
//   }

// var map, infoWindow;
//     function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -34.397, lng: 150.644},
//           zoom: 15
//         });
//         infoWindow = new google.maps.InfoWindow;

//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(function(position) {
//             var pos = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             };

//             infoWindow.setPosition(pos);
//             infoWindow.setContent('Location found.');
//             infoWindow.open(map);
//             map.setCenter(pos);
//           }, function() {
//             handleLocationError(true, infoWindow, map.getCenter());
//           });
//         } else {
//           // Browser doesn't support Geolocation
//           handleLocationError(false, infoWindow, map.getCenter());
//         }
//       }

//       function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//         infoWindow.setPosition(pos);
//         infoWindow.setContent(browserHasGeolocation ?
//                               'Error: The Geolocation service failed.' :
//                               'Error: Your browser doesn\'t support geolocation.');
//         infoWindow.open(map);
//     }



