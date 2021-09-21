
const checAddressString = function (colonia, calle, numero, postal) {
    if (colonia == '' || calle == '' || numero == '' || postal == '') {
        //alert("Debe ingresar una todos los campos");
        return true;
    }

    if (isNaN(numero) || isNaN(postal)) {
        //alert("Debe ingresar campos  numericos");
        return true;
    }

    if (numero < 0 || postal < 0) {
        //alert("No se permiten numeros negativos");
        return true;
    }
    if (numero.toString().length > 10 || postal.toString().length > 6) {
        //alert("No se permiten numeros muy grandes");
        return true;
    }
    if ((numero % 1) != 0 || (postal % 1) != 0) {
        //alert("No se permiten numeros decimales");
        return true;
    }

    return false;
}

const getTheMostAfectedPerson = function (array, men, women) {

    if (array == undefined || array.length < 0)
        return false;

    let temp = Math.max(...array);
    if (men == temp) {
        return "hombres";
    } else if (women == temp) {
        return "Mujeres";
    } else {
        return "LGBT+";
    }
}

const getSexReportStatus = function (data) {
    if (data == undefined || data.length == 0)
        return false;
    let victimaHombre = 0, victimaMUjer = 0, victimaOtros = 0, victimaNA = 0
    for (let index = 0; index < data.length; index++) {
        if (data[index] == "hombre") {
            victimaHombre++;
        } else if (data[index] == "mujer") {
            victimaMUjer++;
        } else if (data[index] == "otro") {
            victimaOtros++;
        } else if (data[index] == "ninguna") {
            victimaNA++;
        }
    }

    return [victimaHombre, victimaMUjer, victimaOtros, victimaNA]
}

const getHourReportStatus = function (data) {
    if (data == undefined || data.length == 0)
        return false;
    let morningReports = 0, noonReports = 0, nightReports = 0
    for (let index = 0; index < data.length; index++) {
        var str = data[index].hora.slice(0, 2);
        var hour = parseInt(str);
        //cases reported around midnight an morning
        if (hour >= 0 && hour <= 10) {
            morningReports++;
        } else if (hour >= 11 && hour <= 18) {
            // cases around 11 to 6 pm
            noonReports++;
        } else if (hour >= 19 && hour <= 24) {
            // cases around 7 to midight
            nightReports++;
        }
    }
    return [morningReports, noonReports, nightReports]
}


const haversineDistance = function (savedLocations, criminalsNearUser, userLocation) {
    //we dont have to look everytime, if there aren't any updates
    //we are going to check if the criminalsNearUser is equal to 0
    if (criminalsNearUser.length > 0) {

        return 0;
    }

    var R = 6371.071; // Radius of the Earth in kilometers
    var rlat1 = userLocation[0].geoPoint.latitude * (Math.PI / 180); // Convert degrees to radians of the user location
    for (let index = 0; index < savedLocations.length; index++) {
        var rlat2 =
            savedLocations[index].geoPoint.latitude * (Math.PI / 180); // Convert degrees to radians
        var difflat = rlat2 - rlat1; // Radian difference (latitudes)
        var difflon =
            (savedLocations[index].geoPoint.longitude -
                userLocation[0].geoPoint.longitude) *
            (Math.PI / 180); // Radian difference (longitudes)
        var d =
            2 *
            R *
            Math.asin(
                Math.sqrt(
                    Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                    Math.cos(rlat1) *
                    Math.cos(rlat2) *
                    Math.sin(difflon / 2) *
                    Math.sin(difflon / 2)
                )
            );
        if (d <= 2) {
            // if  the distance is equal or less than  2 kilometros we are going to let the user know
            criminalsNearUser.push(savedLocations[index]);
        }
    }
}



module.exports = {
    checAddressString,
    getTheMostAfectedPerson,
    getSexReportStatus,
    getHourReportStatus,
    haversineDistance,
}