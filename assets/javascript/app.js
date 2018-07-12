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
var long;


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
   long = position.coords.longitude;
   console.log(lat , long);
}

