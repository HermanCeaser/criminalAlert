<template>
  <div id="home" class="">
    <div id="gradientBackground">
      <div class="gradient-custom"></div>
    </div>
    <div id="pageContainer">
      <b-row id="mapContainer">
        <b-col></b-col>
        <b-col sm>
          <b-card
            title="Criminales"
            sub-title="registrados"
            class="animate__animated animate__backInUp delay-1"
          >
            <b-row no-gutters>
              <b-col md="6">
                <b-card-text>
                  <h4>{{ regCriminals }}</h4>
                </b-card-text>
              </b-col>
              <b-col md="6"
                ><b-avatar
                  icon="people-fill"
                  size="4em"
                  variant="info "
                ></b-avatar
              ></b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col sm>
          <b-card
            title="Usuarios"
            sub-title="totales"
            class="animate__animated animate__backInUp delay-2"
          >
            <b-row no-gutters>
              <b-col md="6">
                <b-card-text>
                  <h4 id="usuariosCount">{{ totalUsers }}</h4>
                </b-card-text>
              </b-col>
              <b-col md="6"
                ><b-avatar
                  icon="emoji-sunglasses-fill"
                  size="4em"
                  variant="info "
                ></b-avatar
              ></b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col sm>
          <b-card
            title="Destacado"
            sub-title="usuario "
            class="animate__animated animate__backInUp delay-3"
          >
            <b-row no-gutters>
              <b-col md="6">
                <b-card-text>
                  <p>{{ userStar }}</p>
                </b-card-text>
              </b-col>
              <b-col md="6"
                ><b-avatar
                  icon="star-fill"
                  size="4em"
                  variant="info "
                ></b-avatar
              ></b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col></b-col>
      </b-row>
      <br />
      <b-row>
        <b-col></b-col>
        <b-col md="10">
          <div id="" class="shadow p-2 mb-5 bg-white rounded">
            <b-overlay :show="mapLoading" rounded="sm">
              <GmapMap
                id="mapID"
                :center="{ lat: 32.513, lng: -117.05 }"
                :zoom="12"
                map-type-id="roadmap"
                :options="{
                  zoomControl: true,
                  mapTypeControl: true,
                  scaleControl: false,
                  streetViewControl: true,
                  rotateControl: false,
                  fullscreenControl: false,
                  disableDefaultUI: false,
                }"
              >
                <div v-if="savedLocations.length > 0">
                  <GmapMarker
                    :key="index"
                    v-for="(l, index) in savedLocations"
                    :position="{
                      lat: l.geoPoint.latitude,
                      lng: l.geoPoint.longitude,
                    }"
                    :clickable="true"
                    :draggable="false"
                    @click="openInfoWindowTemplate(index)"
                    :animation="2"
                    ref="markers"
                    :icon="{ url: require('../assets/criIcon.png') }"
                  />

                  <gmap-info-window
                    :options="{
                      maxWidth: 300,
                      pixelOffset: { width: 0, height: -35 },
                    }"
                    :position="infoWindow.position"
                    :opened="infoWindow.open"
                    @closeclick="infoWindow.open = false"
                  >
                    <div v-html="infoWindow.template"></div>
                  </gmap-info-window>
                </div>
                <div v-if="userLocation.length > 0">
                  <GmapMarker
                    :key="index"
                    v-for="(l, index) in userLocation"
                    :position="{
                      lat: l.geoPoint.latitude,
                      lng: l.geoPoint.longitude,
                    }"
                    :icon="{ url: require('../assets/user.png') }"
                  />
                </div>
                <div v-if="userLocation.length > 0">
                  <GmapCircle
                    v-for="(l, index) in userLocation"
                    :key="index"
                    :center="
                      (position = {
                        lat: l.geoPoint.latitude,
                        lng: l.geoPoint.longitude,
                      })
                    "
                    :radius="2000"
                    :visible="true"
                    :options="{
                      fillColor: 'red',
                      fillOpacity: 0.3,
                      strokeColor: 'red',
                      zIndex: 0.0,
                    }"
                  />
                </div>
              </GmapMap>
            </b-overlay>
          </div>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row>
        <b-col></b-col>
        <b-col>
          <b-button v-on:click="locatorButtonPressed" variant="danger">
            Activar ubicación
          </b-button>
        </b-col>
        <b-col></b-col>
      </b-row>
      <br /><br />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../main";
export default {
  name: "home",
  data: () => ({
    savedLocations: [],
    userLocation: [],
    criminalsNearUser: [],
    regCriminals: 0,
    totalUsers: 0,
    totalReportUser: 0,
    userID: null,
    isBusy: false,
    mapLoading: false,
    markerAnimationState: 0,
    warningMsm: "",
    userStar: "Don Puerko",
    icon: "../assets/criIcon.png",
    count: 0,
    infoWindow: {
      position: { lat: 0, lng: 0 },
      open: false,
      template: "",
    },
  }),
  async beforeMount() {
    //get a request with the information of the criminals
    this.mapLoading = true;
    let { data } = await axios.post(
      "https://us-central1-criminalalertdb.cloudfunctions.net/criminalMapInfo"
    );
    if (data === "NO RESULTS") {
      console.log("problem with map loading");
    } else {
      this.mapLoading = false;
    }
    this.savedLocations = data;

    //Find out ho has reported the most criminals
    this.getTotalReports();

    //set a counter for all the criminals register
    this.regCriminals = this.savedLocations.length;
  },
  methods: {
    getTotalReports: async function () {
      //Find out ho has reported the most criminals
      let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/userCriminalInfo"
      );
      if (data === "NO RESULTS") {
        console.log("problem with map loading");
      }

      //Get all the  user register on the app, and get the email of the
      //user ho has reported the most criminasl
      this.totalUsers = data.totalUsers;
      this.userStar = data.userStar;
      this.userID = data.userID;
    },
    openInfoWindowTemplate: function (index) {
      if (
        this.$refs.markers[
          this.markerAnimationState
        ].$markerObject.getAnimation() !== null
      ) {
        this.$refs.markers[
          this.markerAnimationState
        ].$markerObject.setAnimation(null);
      }

      if (this.markerAnimationState === index) {
        this.$refs.markers[
          this.markerAnimationState
        ].$markerObject.setAnimation(null);
        this.markerAnimationState = 0;
        console.log("repetido");
        return;
      }

      this.markerAnimationState = index;
      this.$refs.markers[index].$markerObject.setAnimation(
        google.maps.Animation.BOUNCE
      );

      const {
        nombre,
        descripcion,
        fecha,
        hora,
        geoPoint = [latitude, longitude],
        estatus,
        referencia,
      } = this.savedLocations[index];

      this.infoWindow.position = {
        lat: geoPoint.latitude,
        lng: geoPoint.longitude,
      };

      let displayInfo = `<div id="infoCriminal">
          <h4 style="color:#ec407a;">Criminal ${nombre}</h4>
          <p style="color:#ec407a;"><strong>${estatus}</strong></p>
          <p style="font-size: 15px;">${descripcion}</p>
          <b style="color:#9e9e9e;"> Reportado ${fecha} a las ${hora}</b>
          <a href="${referencia}" target="_blank">Referencia.</a>
        </div>`;
      this.infoWindow.template = displayInfo;
      this.infoWindow.open = true;
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
    haversine_distance: function () {
      //we dont have to look everytime, if there aren't any updates
      //we are going to check if the criminalsNearUser is equal to 0
      if (this.criminalsNearUser.length > 0) {
        for (let index = 0; index < this.criminalsNearUser.length; index++) {
          this.craeteToast(
            this.criminalsNearUser[index].fecha,
            this.criminalsNearUser[index].hora
          );
        }
        return;
      }

      var R = 6371.071; // Radius of the Earth in kilometers
      var rlat1 = this.userLocation[0].geoPoint.latitude * (Math.PI / 180); // Convert degrees to radians of the user location
      for (let index = 0; index < this.savedLocations.length; index++) {
        var rlat2 =
          this.savedLocations[index].geoPoint.latitude * (Math.PI / 180); // Convert degrees to radians
        var difflat = rlat2 - rlat1; // Radian difference (latitudes)
        var difflon =
          (this.savedLocations[index].geoPoint.longitude -
            this.userLocation[0].geoPoint.longitude) *
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
            this.savedLocations[index].fecha,
            this.savedLocations[index].hora
          );
          this.criminalsNearUser.push(this.savedLocations[index]);
        }
      }
    },
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
        variant: "warning",
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
#mapID {
  width: 100%;
  height: 600px;
}

#mapContainer {
  z-index: 3;
  margin-top: -16%;
}

#home {
  overflow: hidden;
  font-family: "Roboto", sans-serif;
}

.ui.button,
.dot.circle.icon {
  background-color: #ff5a5f;
  color: white;
}

#gradientBackground {
  background-image: url("https://cdn.pixabay.com/photo/2015/04/20/13/17/work-731198_960_720.jpg");
  /* Create the parallax scrolling effect */
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

p {
  color: #5c6bc0;
}

h4 {
  color: #26418f;
}

.delay-1 {
  animation-delay: 0.25s;
}
.delay-2 {
  animation-delay: 0.5s;
}
.delay-3 {
  animation-delay: 0.75s;
}

.gradient-custom {
  z-index: 1;
  width: 100%;
  height: 500px;
  /* fallback for old browsers */
  background: #37ecba;
  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(
    to right,
    rgba(55, 236, 186, 0.4),
    rgba(114, 175, 211, 0.4)
  );
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(
    to right,
    rgba(55, 236, 186, 0.4),
    rgba(114, 175, 211, 0.4)
  );
}

.imgHome {
}

@media screen and (max-width: 759px) {
  #mapID {
    width: 100%;
    height: 500px;
    z-index: 3;
  }
}
</style>