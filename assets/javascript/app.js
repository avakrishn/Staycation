// $(document).ready(function(){
//     // Get the modal
//     var modal = $('#myModal');

//     // Get the button that opens the modal
//     var btn = $("#prepare");

//     // Get the <span> element that closes the modal
//     var close = $('.close');

//     btn.on('click', function(){
//         modal.css('display', 'block');
//     });

//     close.on('click', function(){
//         modal.css('display', 'none');  
//     })

// });

// $(window).on('click', function(event){
//     var modal = $('#myModal');
//     if (event.target == modal) {
//         modal.css('display', 'none'); 
//     }

// })


 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAqCpGYf4cTEVY92frXrlHvt4sCN4RrsVw",
    authDomain: "travel-app-410d0.firebaseapp.com",
    databaseURL: "https://travel-app-410d0.firebaseio.com",
    projectId: "travel-app-410d0",
    storageBucket: "travel-app-410d0.appspot.com",
    messagingSenderId: "979814528498"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

var name;
var lat;
var lon;

$(document).ready(function(){
    $('#checkbox').change(function(){
        event.preventDefault();
        if( $('#checkbox').is(':checked')){
            getLocation();
        }
    });

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
}

$(document).on('click', '#search', function(){
    event.preventDefault();
    if($('#name').val().trim() !== ""){
        name = $('#name').val().trim();
    }

    database.ref('/user').push({
        name: name,
        lat: lat,
        lon: lon, 
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    
    window.location.href = "https://avakrishn.github.io/travel-app/info.html";
    
});

function api(){
    restaurant();
}

function restaurant() {
    $.ajax({  
        url: "https://developers.zomato.com/api/v2.1/search",
        dataType: 'json',
        data: { 
            lat: lat, 
            lon: lon
        },
        async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 
        'faafc11160a617b55a560feef06b483c');},  // This inserts the api key into the HTTP header
        success: function(response) { 
            console.log(response) 
    } });
}



 



