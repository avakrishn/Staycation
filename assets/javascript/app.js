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


var lat;
var lon;


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
