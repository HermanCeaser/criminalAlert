

let map;


function initMap() {

	//Map options, will display the location for Tijuana BC MX
	const testLocation = { lat: 32.496600263535846, lng: -116.96271654107 };

	const options = {
		zoom:10,
		center: {lat: 32.533, lng: -117.05}
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

	//cher if there is information about the criminial 
	if(properties.content){
		var infoWindow = new google.maps.InfoWindow({
			content:properties.content
		}); 

		marker.addListener('click',function(){
			infoWindow.open(map, marker);
		});
	}

	marker.addListener("click", function(){
		if (marker.getAnimation() !== null) {
	    	marker.setAnimation(null);
	  	} else {
	    	marker.setAnimation(google.maps.Animation.BOUNCE);
	  	}
	});

	
	
}