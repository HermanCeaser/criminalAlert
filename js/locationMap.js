

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
	var markerArray = [
		{
		coords:{lat:32.496600263535846,lng:-116.96271654107},
		content:'<h1>Asalto a mano armada</h1>'
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