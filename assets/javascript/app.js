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
    $('#favorites, #favR, #favE, #favA, #restaurants, #events, #attractions, #weather').addClass('hide');
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

    var date = new Date().toISOString().split('T')[0];
    
    

    $.ajax({ url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&sensor=true',
         success: function(data){
             console.log(data);
             var fullAddress = data.results[0].formatted_address;
             var cityState = data.results[2].formatted_address;
             var city = data.results[0].address_components[3].long_name;
            yelpEvents(cityState, date);
         }
    });
    // console.log(city);
//    setTimeout(function(){
        weather(lat, lon);
        restaurant(lat, lon);
        // getFoursquare(lat, lon); 
        yelpLocations(lat, lon);
        // yelpEvents(city, date);
        display();
       
    // }, 6000);
}

function display(){
    $('#hide').hide();
    $('#weather, #restaurants, #events, #attractions').empty();
    $('#favorites, #favR, #favE, #favA, #restaurants, #events, #attractions, #weather').removeClass('hide');
    
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
            for(var i=0; i < 10; i++){
                // var dragIcon = <i class="fas fa-ellipsis-v"></i>
                var rCard = $('<div>').addClass('w3-panel w3-card-4 text-center p-3 mr-4 rCard align-middle myTrigger').attr({
                    href: response.restaurants[i].restaurant.url,
                    draggable: "true",
                    ondragstart: "drag(event)",
                    ondrop:"return false",
                    ondragover:"return false",
                    "data-append": "green",
                    id: "dragR"+i
                }).css({
                    "min-width": '250px',
                    height:'330px',
                    position: 'relative'
                });
                var icon = $('<p>').html('<i class="fas fa-ellipsis-v fa-lg float-left mr-2 icon"></i>').css('color', 'grey');
                var rName = $('<h5>').html(response.restaurants[i].restaurant.name);
                if(response.restaurants[i].restaurant.featured_image !== ""){
                    var rImage = $('<img>').attr({
                        src: response.restaurants[i].restaurant.featured_image,
                        href:  response.restaurants[i].restaurant.url,
                        target: '_blank',
                        height: '100px',
                        id: 'image'+i
                    });
                }
                else{
                    var rImage = $('<img>').css('height', '100px').attr({
                        src: 'assets/images/image-filler.jpg',
                        href: response.restaurants[i].restaurant.url,
                        target:'_blank',
                        id: 'image' +i
                    });
                    
                }
                
                var rCuisine = $('<p>').html(response.restaurants[i].restaurant.cuisines).css("margin-bottom", '0.5rem');
                var location = response.restaurants[i].restaurant.location.address;
                var rLocation = $('<a>').attr('href', "http://maps.google.com/?q="+location).attr('target','_blank').html(location + '</br>');
                var rMenu = $('<a>').html(response.restaurants[i].restaurant.name + " Menu").attr({
                    href: response.restaurants[i].restaurant.menu_url,
                    target: '_blank',
                }).css({
                    color: 'orange',
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    left: '0',
                    'margin-bottom': '0.5rem',
                    'margin-top': '0.5rem'
                });
                rCard.append(icon, rName, rImage, rCuisine, rLocation, rMenu);
                $('#restaurants').append(rCard);
            } 
            
        } });

}



function allowDrop(ev) {
    ev.preventDefault();

}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// function drop(ev) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text");
//     ev.target.appendChild(document.getElementById(data));
// }

function dropR(ev, el){
    
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    
    // console.log(child.childNodes[5]);
    if(ev.target.getAttribute('data-append') == document.getElementById(data).getAttribute('data-append')){
        var child = document.getElementById(data);
        child.childNodes[2].style.display = "inline-flex";
        // child.childNodes[5].style.display = "block";
        child.style.width = "fit-content";
        child.style.height = "330px";
        console.log(child);
        el.appendChild(child);
    }
  }

function dropF(ev, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if(ev.target.getAttribute('data-append') == document.getElementById(data).getAttribute('data-append')){
        var child = document.getElementById(data);
        child.childNodes[2].style.display = "none";
        // child.childNodes[5].style.display = "none";

        child.style.width = "100%";

        if(document.getElementById(data).getAttribute('data-append') == 'green'){
            child.style.height = '150px';
        }else{
            child.style.height = "fit-content";
            }
        // console.log(child.childNodes[2]);
        // console.log(child.childNodes[5]);
        el.appendChild(child);
    }

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
    var weatherIcon = $('<img>').attr('src','http://openweathermap.org/img/w/'+iconURL+'.png').addClass('weatherIcon mr-2').css('float', 'right');;
    var Ktemp = response.main.temp;
    var Ftemp = parseInt((((Ktemp-273.15)*1.8)+32));
    var temp = $('<span>').html(Ftemp + "&#8457;  ").css('float', 'right').addClass('mr-2');
    var description = $('<span>').html(response.weather[0].description).css('float', 'right');;
    cityDisplay = $('<div>').html("City: "+ response.name).css('display', 'inline-block');
    var weatherDiv = $('<div>').append(description, temp, weatherIcon);
    $('#weather').append(weatherDiv, cityDisplay );

  });
}


// function getFoursquare(x,y){
//     var url = "https://api.foursquare.com/v2/venues/categories?client_id=C3RL0TDP2E1I4JKKVUIGQGK41LS3L3QIUZGKI1DQWI0RZTOC&client_secret=B4OJE5X30WB2PC41CIIYOMJORHM1TN4M31NAOFUQZEJSAYL4&ll="+x+","+y+"&v=20180713";
//     $.ajax({
//       url: url,
//       dataType: 'json',
//       data: { 
//         lat: x, 
//         lng: y
//         },
//       success: function(response){
//       console.log(response) 
//       }
//     });
//   };

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


    }).on('success', function(response){
        console.log(response);
        for(var i=0; i < 10; i++){
            // var dragIcon = <i class="fas fa-ellipsis-v"></i>
            var yCard = $('<div>').addClass('w3-panel w3-card-4 text-center p-3 mr-4 yCard align-middle myTrigger').attr({
                // href: response.restaurants[i].restaurant.url,
                draggable: "true",
                ondragstart: "drag(event)",
                ondrop:"return false",
                ondragover:"return false",
                "data-append": "red",
                id: "dragY"+i
            }).css({
                "min-width": '250px',
                height:'330px',
                position: 'relative'
            });
            var icon = $('<span>').html('<i class="fas fa-ellipsis-v fa-lg float-left mr-2 icon"></i>').css('color', 'grey');
            var yName = $('<h5>').html(response.businesses[i].name);
                var yImage = $('<img>').attr({
                    src: response.businesses[i].image_url,
                    // href:  response.restaurants[i].restaurant.url,
                    target: '_blank',
                    height: '100px',
                    id: 'image'+i
                });
            
            var categories = $('<p>').html(response.businesses[i].categories[0].title).css("margin-bottom", '0.5rem');
            var location = "";
            var displayAddress = response.businesses[i].location.display_address;
            for (var j=0; j<displayAddress.length; j++){
                location += displayAddress[j] + " ";
            }
            // var location = response.businesses[i].location.display_address[0] + " " + response.businesses[i].location.display_address[1];
            var yAddress = $('<a>').attr('href', "http://maps.google.com/?q="+location).attr('target','_blank').html(location + '</br>');
            var option = response.businesses[i].is_closed.toString();
            var yAppend = '';
            if (option == 'false'){
                yAppend = $('<p>').html('Open Now').css('color', 'green');
            } else {
                yAppend = $('<p>').html('Closed Now').css('color', 'red');
            }
            var yelpBusiness = $('<a>').html("Yelp Page").attr({
                href: response.businesses[i].url,
                target: '_blank',
            }).css({
                color: 'orange',
                position: 'absolute',
                bottom: '0',
                right: '0',
                left: '0',
                'margin-bottom': '0.5rem'
            });
            yCard.append(icon, yName, yImage, categories, yAddress, yelpBusiness, yAppend);
            $('#attractions').append(yCard);
        } 
        
    }
        /*YOUR CODE GOES HERE*/ 
    ).on('error', function(res){
        /*YOUR CODE GOES HERE*/ 
        console.log('Error');
    });

  }

  function yelpEvents(x,y){
    var rapid = new RapidAPI("default-application_5b4a341ce4b0fd573002f094", "deaaa550-92ad-4d67-8742-180e2230c626");

    rapid.call('YelpAPI', 'searchEvent', { 
        // 'coordinates': x,y,
        // 'latitude': x,
        // 'longitude': y,
        'location': x,
        'accessToken': '3h3aitdeSr9OUymm7UYBzQbS1AqxncwCG_Ieoxc_iL1lAXM9w-sGH53FIWZn0LO_z-IVNFX3NZ6JDTZ01NKd5pcvmsgbT2S1_U3d95ARe4DBsBz6zgREijpNSDdKW3Yx',
        'limit': '20',
        // 'sortOn': 'time_start',
        'radius': '10000',
        'startDate': y,
        'endDate': y,
        // 'categories': ['', '']

    }).on('success', function (response) {
        console.log(response);
        for(var i=0; i < 10; i++){
            // var dragIcon = <i class="fas fa-ellipsis-v"></i>
            var eCard = $('<div>').addClass('w3-panel w3-card-4 text-center p-3 mr-4 eCard align-middle myTrigger').attr({
                // href: response.restaurants[i].restaurant.url,
                draggable: "true",
                ondragstart: "drag(event)",
                ondrop:"return false",
                ondragover:"return false",
                "data-append": "blue",
                id: "dragE"+i
            }).css({
                "min-width": '250px',
                height:'390px',
                position: 'relative'
            });
            var icon = $('<span>').html('<i class="fas fa-ellipsis-v fa-lg float-left mr-2 icon"></i>').css('color', 'grey');
            var eName = $('<h5>').html(response.events[i].name);
            var eImage = $('<img>').attr({
                src: response.events[i].image_url,
                // href:  response.restaurants[i].restaurant.url,
                target: '_blank',
                height: '100px',
                id: 'image'+i
            });
            var categoryReplace = response.events[i].category;
            categoryReplace = categoryReplace.replace(/-/g, ' ') 
            var category = $('<p>').html(categoryReplace).css("margin-bottom", '0.5rem').css("text-transform", "capitalize");
            // var location = response.events[i].location.display_address[0] + " " + response.events[i].location.display_address[1];
            var location = "";
            var displayAddress = response.events[i].location.display_address;
            for (var j=0; j<displayAddress.length; j++){
                location = location + " " + displayAddress[j];
            }
            var eAddress = $('<a>').attr('href', "http://maps.google.com/?q="+location).attr('target','_blank').html(location + '</br>');
            var cost = $('<p>').html('$ ' + response.events[i].cost);
                if (response.events[i].cost == null){
                    eAppend = $('<p>').html('Free').css('color', 'green');
                } else {
                    eAppend = $('<p>').html('$' + response.events[i].cost).css('color', 'red');
                }
            var startSlice = response.events[i].time_start;
            var start = startSlice.slice(5);
            var endSlice = response.events[i].time_end;
            var end = endSlice.slice(5);
            var startStr = $('<p>').html('Time Start: ' + start);
            var endStr = $('<p>').html('Time End: ' + end);
            if (response.events[i].time_end == null){
                endStr = "";
            }
            // var option = response.businesses[i].is_closed.toString();
            // var eAppend = '';
            // if (option == 'false'){
            //     eAppend = $('<p>').html('Open Now').css('color', 'green');
            // } else {
            //     eAppend = $('<p>').html('Closed Now').css('color', 'red');
            // }
            var eEvent = $('<a>').html("Yelp Event Page").attr({
                href: response.events[i].event_site_url,
                target: '_blank',
            }).css({
                color: 'orange',
                position: 'absolute',
                bottom: '0',
                right: '0',
                left: '0',
                'margin-bottom': '0.5rem'
            });
            eCard.append(icon, eName, eImage, category, eAddress, eAppend, startStr, endStr, eEvent);
            $('#events').append(eCard);
        } 
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



