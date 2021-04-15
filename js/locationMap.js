

let map;


function initMap() {

	//Map options, will display the location for Tijuana BC MX
	const options = {
		zoom:10,
		center: {lat: 32.533, lng: -117.05},
		
	}

	//Will create the map, with options for the locations
  	map = new google.maps.Map(document.getElementById('map'), options);
  	
 	// We crate and array of markers
 	const geocoder = new google.maps.Geocoder();
  		document.getElementById("submit").addEventListener("click", () => {
    	geocodeAddress(geocoder, map);
  	});
 	
	var markerArray = [
		{
		coords:{lat:32.45849968609627,lng:-116.96405351357521},
		content:createCrimeInformation(),
		},
		{
		coords:{lat:32.50947562858828,lng:-117.03839447402427},
		content:'<h1>Asesianto</h1>'
		}
	];
	


	console.log(markerArray.length);
	//We will iterate the aray to add all the markers. 
	for (var i = 0; i < markerArray.length; i++) {
		addMarker(markerArray[i]);
	}


	
	getUserLocations();
}


// add markr function
function addMarker(properties){
	var marker = new google.maps.Marker({
	    position: properties.coords,
	    map: map,
	    draggable: false,
   		animation: google.maps.Animation.DROP,
	    icon: 'img/criminal.png'

	});

	//cherk if there is information about the criminial 
	if(properties.content){
		var infoWindow = new google.maps.InfoWindow({
			content:properties.content
		}); 

		marker.addListener('click', () => { infoWindow.open(map, marker);});
	}

	marker.addListener("click", () => {
		if (marker.getAnimation() !== null) {
	    	marker.setAnimation(null);
	  	} else {
	    	marker.setAnimation(google.maps.Animation.BOUNCE);
	  	}
	});

	
	
}


function getUserLocations(){
 
  let infoWindow = new google.maps.InfoWindow();
  //We create the button to get the location of the user, and will added to the map
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

  //will add the event listener to the button 
  locationButton.addEventListener('click', () => {
  		//Will get the geoLocation using HTML5
  		if(navigator.geolocation){
  			navigator.geolocation.getCurrentPosition(
  				(position) => {
  					const pos = {
  						lat: position.coords.latitude,
            			lng: position.coords.longitude,
  					};
  					infoWindow.setPosition(pos);
  					infoWindow.setContent("Location found.");
  					infoWindow.open(map);
  					map.setCenter(pos);
  					var marker = new google.maps.Marker({
					    position: pos,
					    map: map,
					    draggable: false,
				   		animation: google.maps.Animation.DROP,
					    icon: 'img/user.png'
					    

					});
					addMarkerIcon(marker);
  				},
  				() => {
  					handleLocationError(true, infoWindow, map.getCenter());
  				}
  			);
  		}else{
  			// Browser doesn't support Geolocation
  			handleLocationError(false, infoWindow, map.getCenter());
  		}
  });

 


}

function addMarkerIcon(marker){
	 marker.addListener("click", () => {
		if (marker.getAnimation() !== null) {
	    	marker.setAnimation(null);
	  	} else {
	    	marker.setAnimation(google.maps.Animation.BOUNCE);
	  	}
	});
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}


function createCrimeInformation(){
	 console.log("key point")
	//we are going to create the information so we can display to the user
	//the crime commited
	var contentString = 
	'<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">Asesinan a mujer</h1>' +
    '<div id="bodyContent">' +
    "<p>Una mujer fue asesinada a tiros, minutos después del mediodía sobre" +
    "la vía pública en <b>Tijuana</b>" +
    "Los hechos se reportaron alrededor de las 12:20 horas." +
    '<p>status:No se reportan personas detenidas por este hecho</p>'+
    '<p>referencia:<a href="https://www.elimparcial.com/tijuana/policiaca/Asesinan-a-mujer-a-tiros-en-via-publica-de-Tijuana-20210407-0024.html"> ' +
    "https://www.elimparcial.com/tijuana/policiaca</a> " +
    "(fecha del crimen  07 de Abril).</p>" +
    "</div>" +
    "</div>";

    return contentString;
}


function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("address").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}