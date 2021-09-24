
export default {
    methods: {
        craeteToast: function (fecha, hora) {
            // Use a shorter name for this.$createElement
            const h = this.$createElement;
            // Increment the toast count
            this.count++;
            // Create the message
            const vNodesMsg = h("div", { class: ["text-center", "mb-0"] }, [
                h("b-spinner", {
                    props: { type: "grow", small: true, variant: "danger" },
                }),
                " Se han localizado  ",
                h("strong", " actividad "),
                `delictiva  ` + " fecha  de reporte " + fecha + " a las " + hora,
            ]);
            // Create the title
            const vNodesTitle = h(
                "div",
                { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] },
                [
                    h("strong", { class: "mr-2" }, "Warning!"),
                    h("small", { class: "ml-auto text-italics" }, "5 seconds ago"),
                ]
            );
            // Pass the VNodes as an array for message and title
            this.$bvToast.toast([vNodesMsg], {
                title: [vNodesTitle],
                solid: true,
                variant: "danger",
            });
        },
        getReportStatus: async function (data) {
            for (let index = 0; index < data.length; index++) {
                if (data[index].tipoCrimen == "asesinato") {
                    this.statusReportCount[0]++;
                } else if (data[index].tipoCrimen == "violación") {
                    this.statusReportCount[1]++;
                } else if (data[index].tipoCrimen == "asalto") {
                    this.statusReportCount[2]++;
                } else if (data[index].tipoCrimen == "agresión") {
                    this.statusReportCount[3]++;
                } else if (data[index].tipoCrimen == "homicidio") {
                    this.statusReportCount[4]++;
                } else if (data[index].tipoCrimen == "asaltoSexual") {
                    this.statusReportCount[5]++;
                } else if (data[index].tipoCrimen == "violenciaDomestica") {
                    this.statusReportCount[6]++;
                } else if (data[index].tipoCrimen == "robo") {
                    this.statusReportCount[7]++;
                } else if (data[index].tipoCrimen == "secuestro") {
                    this.statusReportCount[8]++;
                } else if (data[index].tipoCrimen == "narcotráfico") {
                    this.statusReportCount[9]++;
                }
            }
        },
        getSexReportStatus: async function (data) {
            for (let index = 0; index < data.length; index++) {
                if (data[index].tipoSexo == "hombre") {
                    this.victimaHombre++;
                } else if (data[index].tipoSexo == "mujer") {
                    this.victimaMUjer++;
                } else if (data[index].tipoSexo == "otro") {
                    this.victimaOtros++;
                } else if (data[index].tipoSexo == "ninguna") {
                    this.victimaNA++;
                }
            }
            this.victima = this.getTheMostAfectedPerson([
                this.victimaHombre,
                this.victimaMUjer,
                this.victimaOtros,
            ]);
        },

        getTheMostAfectedPerson: function (list) {
            if (list == undefined || list.length < 0)
                return false;
            let temp = Math.max(...list);
            if (this.victimaHombre == temp) {
                return "hombres";
            } else if (this.victimaMUjer == temp) {
                return "Mujeres";
            } else {
                return "LGBT+";
            }
        },
        getHourReportStatus: async function (data) {
            if (data == undefined || data.length == 0)
                return 0;
            for (let index = 0; index < data.length; index++) {
                var str = data[index].hora.slice(0, 2);
                var hour = parseInt(str);
                //cases reported around midnight an morning
                if (hour >= 0 && hour <= 10) {
                    this.morningReports++;
                } else if (hour >= 11 && hour <= 18) {
                    // cases around 11 to 6 pm
                    this.noonReports++;
                } else if (hour >= 19 && hour <= 24) {
                    // cases around 7 to midight
                    this.nightReports++;
                }
            }
        },
        locatorButtonPressed: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let obj = {
                            geoPoint: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            },
                        };
                        if (this.userLocation.length > 0) {
                            this.userLocation = [];
                        } else {
                            this.userLocation.push(obj);
                            this.haversine_distance();
                        }
                    },
                    (error) => {
                        console.log(error.message);
                    }
                );
            } else {
                alert("Tu brower no soporta geolocalizacion API");
            }
        },
        haversine_distance: function (savedLocations, criminalsNearUser, userLocation) {
            //we dont have to look everytime, if there aren't any updates
            //we are going to check if the criminalsNearUser is equal to 0
            if (criminalsNearUser.length > 0) {
                for (let index = 0; index < criminalsNearUser.length; index++) {
                    this.craeteToast(
                        criminalsNearUser[index].fecha,
                        criminalsNearUser[index].hora
                    );
                }
                return;
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
                    this.craeteToast(
                        savedLocations[index].fecha,
                        savedLocations[index].hora
                    );
                    criminalsNearUser.push(savedLocations[index]);
                }
            }
        },
        openInfoWindowTemplate: function (index, key) {
            /* this.markerAnimationState = index;
            this.$refs.markers[index].$markerObject.setAnimation(
              google.maps.Animation.BOUNCE
            );*/
            let tempData;
            var text = "";
            if (key == 0) {
                tempData = this.savedLocations[index];
                text = "Criminal";
            } else {
                tempData = this.lostPersonLocations[index];
            }
            this.infoWindow.position = {
                lat: tempData.geoPoint.latitude,
                lng: tempData.geoPoint.longitude,
            };
            let displayInfo = `<div id="infoCriminal">
                <h4 style="color:#ec407a;"> ${tempData.estatus.toUpperCase()} </h4>
                <p style="font-size: 15px;">${tempData.descripcion}</p>
                <b style="color:#9e9e9e;"> Reportado ${tempData.fecha} a las ${tempData.hora}</b>
                <a href="${tempData.referencia}" target="_blank">Referencia.</a>
              </div>`;
            this.infoWindow.template = displayInfo;
            this.infoWindow.open = true;
        },
        checAddressString: function (colonia, calle, numero, postal) {
            if (colonia == "" || calle == "" || numero == "" || postal == "") {
                alert("Debe ingresar una todos los campos");
                return true;
            }
            if (isNaN(numero) || isNaN(postal)) {
                alert("Debe ingresar datos  numericos en nummero y codigo postal");
                return true;
            }
            if (numero < 0 || postal < 0) {
                alert("No se permiten numeros negativos");
                return true;
            }
            if(numero.toString().length > 10 || postal.toString().length > 6){
                alert("No se permiten numeros muy grandes");
                return true;
            }
            if((numero % 1) != 0 || (postal % 1) != 0 ){
                alert("No se permiten numeros decimales");
                return true;
            }

            return false;
        },
    }

}