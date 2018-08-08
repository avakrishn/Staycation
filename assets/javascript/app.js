
// function is executed when entire page loads
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('#favorites, #favR, #favE, #favA, #restaurants, #events, #attractions, #weather, #accordion').hide();
    $('#search').on('click', function(){
        event.preventDefault();
        if( $('#userInput input[type= "checkbox"]').is(':checked')){
            getLocation();  
        }
        else{
            alert('Please enable your location.');
        }

    })
});

// current geolocation of user is determined
function getLocation() {
    event.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }  
}
// current latitude and longitude of user is determined
function showPosition(position) {
   var lat = position.coords.latitude;
   var lon = position.coords.longitude;
   console.log(lat , lon);

    // get current date and time (UTC) of user
    var date = new Date().toUTCString();

    // user's name
    var name = $('#userInput input[type= "text"]').val().trim();
 
    // store user's name, latitude, longitude, and current date and time in firebase
    database.ref('/user').push({
        name: name,
        lat: lat,
        lon: lon, 
        date: date,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });


    
    // call functions which display necessary information based on user's latitude and longitude
    weather(lat, lon);
    restaurant(lat, lon);
    yelpAttractions(lat, lon);
    yelpEvents(lat, lon, date);

    display();
}

// hides the intro cards and displays the accordion and favorites sections which contain information about the weather and nearby restaurants, events, and attractions
function display(){
    $('.hide').hide();
    $('#weather, #restaurants, #events, #attractions').empty();
    $('#favorites, #favR, #favE, #favA, #restaurants, #events, #attractions, #weather, #accordion').show();
    
}

// when executed this function, using information from zomato api, will create individual cards for each restaurant including the restaurant name, image, type of cuisine, address (opens to maps when clicked on), and link to restaurant page
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
            for(var i=0; i < 15; i++){
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

// when executed this function, using information from openweathermap api will display the current city of the user along with the current temperature and weather icon and description for the current city
function weather(x,y){
var APIKey = "3cde5a9db34a7bc318d935fbac26a604";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+x+"&"+"lon="+y+"&APPID="+APIKey;
console.log(queryURL);
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response)
    var iconURL = response.weather[0].icon;
    var weatherIcon = $('<img>').attr('src','https://openweathermap.org/img/w/'+iconURL+'.png').addClass('weatherIcon mr-2').css('float', 'right').css('margin-top','-10px');;
    var Ktemp = response.main.temp;
    var Ftemp = parseInt((((Ktemp-273.15)*1.8)+32));
    var temp = $('<span>').html(Ftemp + "&#8457;  ").css('float', 'right').addClass('mr-2');
    var description = $('<span>').html(response.weather[0].description).css('float', 'right');;
    cityDisplay = $('<div>').html("City: "+ response.name).css('display', 'inline-block');
    var weatherDiv = $('<div>').append(description, temp, weatherIcon);
    $('#weather').append(weatherDiv, cityDisplay );

  });
}


// when executed this function, using information from yelp api, will create individual cards for each attraction including the attraction name, image, category type, address (opens to maps when clicked on), and link to the yelp page
function yelpAttractions(x,y){
var rapid = new RapidAPI('default-application_5b4a33cae4b004833ec270ad', '3ad9125a-b897-4679-9417-020f62576786');

rapid.call('YelpAPI', 'getBusinesses', { 
    'term': 'attractions',
    // 'openNow': 'true',
    'accessToken': '3h3aitdeSr9OUymm7UYBzQbS1AqxncwCG_Ieoxc_iL1lAXM9w-sGH53FIWZn0LO_z-IVNFX3NZ6JDTZ01NKd5pcvmsgbT2S1_U3d95ARe4DBsBz6zgREijpNSDdKW3Yx',
    'latitude': x,
    'longitude': y,
    'attributes': ['', '']


}).on('success', function(response){
    console.log(response);
    for(var i=0; i < 15; i++){
        var aCard = $('<div>').addClass('w3-panel w3-card-4 text-center p-3 mr-4 aCard align-middle myTrigger').attr({
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
        var aName = $('<h5>').html(response.businesses[i].name);
        var aImage = $('<img>').attr({
            src: response.businesses[i].image_url,
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
        var aAddress = $('<a>').attr('href', "http://maps.google.com/?q="+location).attr('target','_blank').html(location + '</br>');
        var isClosed = response.businesses[i].is_closed.toString();
        var openClosed = '';
        if (isClosed == 'false'){
            var openClosed = $('<p>').html('Open Now').css('color', 'green');
        } else {
            var openClosed = $('<p>').html('Closed Now').css('color', 'red');
        }
        var aYelp = $('<a>').html("Yelp Page").attr({
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
        aCard.append(icon, aName, aImage, categories, aAddress, aYelp, openClosed);
        $('#attractions').append(aCard);
    } 
    
}
).on('error', function(res){
    console.log('Error');
});

}

// when executed this function, using information from yelp api, will create individual cards for each event including the event name, image, category type, address (opens to maps when clicked on), cost, date and time, and link to the yelp page
function yelpEvents(x,y,z){
var rapid = new RapidAPI("default-application_5b4a341ce4b0fd573002f094", "deaaa550-92ad-4d67-8742-180e2230c626");

var coordinate = x + ", " + y;

rapid.call('YelpAPI', 'searchEvent', { 
    'coordinates': coordinate,
    'accessToken': '3h3aitdeSr9OUymm7UYBzQbS1AqxncwCG_Ieoxc_iL1lAXM9w-sGH53FIWZn0LO_z-IVNFX3NZ6JDTZ01NKd5pcvmsgbT2S1_U3d95ARe4DBsBz6zgREijpNSDdKW3Yx',
    'limit': '20',
    'sortOn': 'time_start',
    'radius': '10000',
    'startDate': z,
    'endDate': z

}).on('success', function (response) {
    console.log(response);
    for(var i=0; i < 15; i++){
        var eCard = $('<div>').addClass('w3-panel w3-card-4 text-center p-3 mr-4 eCard align-middle myTrigger').attr({
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
            target: '_blank',
            height: '100px',
            id: 'image'+i
        });
        var categoryReplace = response.events[i].category;
        categoryReplace = categoryReplace.replace(/-/g, ' ') 
        var category = $('<p>').html(categoryReplace).css("margin-bottom", '0.5rem').css("text-transform", "capitalize");
        var location = "";
        var displayAddress = response.events[i].location.display_address;
        for (var j=0; j<displayAddress.length; j++){
            location = location + " " + displayAddress[j];
        }
        var eAddress = $('<a>').attr('href', "http://maps.google.com/?q="+location).attr('target','_blank').html(location + '</br>');
            if (response.events[i].cost == null){
                var cost = $('<p>').html('Free').css('color', 'green');
            } else {
                var cost = $('<p>').html('$' + response.events[i].cost).css('color', 'red');
            }
        if(response.events[i].time_start != null){
            var startSlice = response.events[i].time_start;
            var start = startSlice.slice(5);
            var startStr = $('<p>').html('Time Start: ' + start);
        }
        else{
            var startStr = "";  
        }
        if(response.events[i].time_end != null ){
            var endSlice = response.events[i].time_end;
            var end = endSlice.slice(5);
            var endStr = $('<p>').html('Time End: ' + end);
        }
        else{
            var endStr = "";
        }
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
        eCard.append(icon, eName, eImage, category, eAddress, cost, startStr, endStr, eEvent);
        $('#events').append(eCard);
    } 
}).on('error', function (res) {
    console.log('Error');
});
}
