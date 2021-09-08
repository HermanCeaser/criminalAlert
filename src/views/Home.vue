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
                    @click="openInfoWindowTemplate(index, 0)"
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
                <div v-if="lostPersonLocations.length > 0">
                  <GmapMarker
                    :key="index"
                    v-for="(l, index) in lostPersonLocations"
                    :position="{
                      lat: l.geoPoint.latitude,
                      lng: l.geoPoint.longitude,
                    }"
                    :clickable="true"
                    :draggable="false"
                    @click="openInfoWindowTemplate(index, 1)"
                    :animation="1"
                    ref="markersLostPerson"
                    :icon="{ url: require('../assets/lost.png') }"
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
      <b-row>
        <b-col md="2"></b-col>
        <b-col sm>
          <b-overlay :show="mapLoading" rounded="sm">
            <b-card no-body class="overflow-hidden shadow bg-white rounded">
              <b-row no-gutters>
                <b-col md="2"></b-col>
                <b-col sm>
                  <b-card-body title="Reportes">
                    <b-card-text> </b-card-text>
                    <b-row>
                      <b-col>
                        <b-card-body title="Asesinato">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/2323/2323041.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy> </b-card-body
                        ><strong>
                          {{
                            (
                              (statusReportCount[0] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        ></b-col
                      >
                      <b-col>
                        <b-card-body title="Violacion">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/4741/4741147.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            (
                              (statusReportCount[1] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Asalto">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/340/340504.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            (
                              (statusReportCount[2] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Agresion">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/3348/3348151.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            (
                              (statusReportCount[3] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Homicidio">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/4063/4063024.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            (
                              (statusReportCount[4] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="AsaltoSexual">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/1754/1754638.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            (
                              (statusReportCount[5] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Robo">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/1576/1576513.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            (
                              (statusReportCount[7] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Narcotrafico">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/1546/1546140.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            (
                              (statusReportCount[9] * 100) /
                              regCriminals
                            ).toFixed(2)
                          }}
                          %</strong
                        >
                      </b-col>
                    </b-row>
                  </b-card-body>
                </b-col>
                <b-col md="2"></b-col>
              </b-row>
            </b-card>
          </b-overlay>
        </b-col>
        <b-col md="2"></b-col>
      </b-row>
      <br />
      <b-row>
        <b-col md="2"></b-col>
        <b-col sm>
          <b-overlay :show="mapLoading" rounded="sm">
            <b-card no-body class="overflow-hidden shadow bg-white rounded">
              <b-row no-gutters>
                <b-col md="2"></b-col>
                <b-col sm>
                  <b-card-body title="Victimas">
                    <b-card-text>
                      De acuerdo con nuestros datos sobre él incide de victimas
                      afectadas, tenemos que en promedio los más afectados por
                      actividades delictivas son <strong>{{ victima }}</strong>
                    </b-card-text>
                    <b-row>
                      <b-col>
                        <b-card-body title="Hombre">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/265/265674.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy> </b-card-body
                        ><strong>
                          {{
                            ((victimaHombre * 100) / regCriminals).toFixed(2)
                          }}
                          %</strong
                        ></b-col
                      >
                      <b-col>
                        <b-card-body title="Mujer">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/3220/3220315.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{ ((victimaMUjer * 100) / regCriminals).toFixed(2) }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Otro">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/4696/4696345.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{ ((victimaOtros * 100) / regCriminals).toFixed(2) }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Sin registro">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/2544/2544199.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{ ((victimaNA * 100) / regCriminals).toFixed(2) }}
                          %</strong
                        >
                      </b-col>
                    </b-row>
                  </b-card-body>
                </b-col>
                <b-col md="2"></b-col>
              </b-row>
            </b-card>
          </b-overlay>
        </b-col>
        <b-col md="2"></b-col>
      </b-row>
      <br />
      <b-row>
        <b-col md="2"></b-col>
        <b-col sm>
          <b-overlay :show="mapLoading" rounded="sm">
            <b-card no-body class="overflow-hidden shadow bg-white rounded">
              <b-row no-gutters>
                <b-col md="2"></b-col>
                <b-col sm>
                  <b-card-body title="Hora  promedio ">
                    <b-card-text>
                      Se desplegara la hora en que se cometieron actos
                      delictivos, para obtener un estimado de la hora del día
                      donde es más peligroso transitar.
                    </b-card-text>
                    <b-row>
                      <b-col>
                        <b-card-body title="Hora de 0 a 10">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/1113/1113776.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{
                            ((morningReports * 100) / regCriminals).toFixed(2)
                          }}
                          %</strong
                        ></b-col
                      >
                      <b-col>
                        <b-card-body title="Hora de 11 a  18">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/4517/4517048.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{ ((noonReports * 100) / regCriminals).toFixed(2) }}
                          %</strong
                        >
                      </b-col>
                      <b-col>
                        <b-card-body title="Hora de 19 a  24">
                          <b-img-lazy
                            src="https://image.flaticon.com/icons/png/512/5438/5438725.png"
                            class="victimImg"
                            thumbnail
                            fluid
                            rounded="circle"
                            alt="Responsive image"
                          ></b-img-lazy>
                        </b-card-body>
                        <strong>
                          {{ ((nightReports * 100) / regCriminals).toFixed(2) }}
                          %</strong
                        >
                      </b-col>
                    </b-row>
                  </b-card-body>
                </b-col>
                <b-col md="2"></b-col>
              </b-row>
            </b-card>
          </b-overlay>
        </b-col>
        <b-col md="2"></b-col>
      </b-row>

      <br /><br />
    </div>
    <div>
      <div class="fluid-container footer">
        <p class="text-center">Copyright copy 2021</p>
      </div>
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
    lostPersonLocations: [],
    criminalsNearUser: [],
    statusReportCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    regCriminals: 0,
    totalUsers: 0,
    totalReportUser: 0,
    userID: null,
    isBusy: false,
    mapLoading: false,
    userStar: "Don Señor",
    icon: "../assets/criIcon.png",
    count: 0,
    victima: "TODOS",
    victimaHombre: 0,
    victimaMUjer: 0,
    victimaOtros: 0,
    victimaNA: 0,
    morningReports: 0,
    noonReports: 0,
    nightReports: 0,
    infoWindow: {
      position: { lat: 0, lng: 0 },
      open: false,
      template: "",
    },
  }),
  async beforeMount() {
    //get a request with the information of the criminals
    this.getCriminalLocations();

    //get a request with the information of the lost Persons
    this.getLostPersonLocation();

    //Find out ho has reported the most criminals
    this.getTotalReports();
  },
  methods: {
    getCriminalLocations: async function () {
      this.mapLoading = true;
      let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/criminalMapInfo"
      );
      if (data === "NO RESULTS") {
        console.log("problem with map loading");
      } else {
        this.mapLoading = false;
        this.savedLocations = data;
        //set a counter for all the criminals register
        this.regCriminals = this.savedLocations.length;
        // get the report status of every crime
        this.getReportStatus(this.savedLocations);
        this.getSexReportStatus(this.savedLocations);
        this.getHourReportStatus(this.savedLocations);
      }
    },
    getLostPersonLocation: async function () {
      //this.mapLoading = true;
      let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/lostPersonMapInfo"
      );
      if (data === "NO RESULTS") {
        //this.mapLoading = false;
      } else {
        //this.mapLoading = false;
        this.lostPersonLocations = data;
      }
    },
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
    getReportStatus: async function (data) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].tipoCrimen == "asesinato") {
          this.statusReportCount[0]++;
          console.log("hola ase");
        } else if (data[index].tipoCrimen == "violación") {
          this.statusReportCount[1]++;
          console.log("hola vio");
        } else if (data[index].tipoCrimen == "asalto") {
          this.statusReportCount[2]++;
          console.log("hola asalto");
        } else if (data[index].tipoCrimen == "agresión") {
          this.statusReportCount[3]++;
          console.log("hola agre");
        } else if (data[index].tipoCrimen == "homicidio") {
          this.statusReportCount[4]++;
          console.log("hola hom");
        } else if (data[index].tipoCrimen == "asaltoSexual") {
          this.statusReportCount[5]++;
          console.log("hola asalSe");
        } else if (data[index].tipoCrimen == "violenciaDomestica") {
          this.statusReportCount[6]++;
          console.log("hola violenci");
        } else if (data[index].tipoCrimen == "robo") {
          this.statusReportCount[7]++;
          console.log("hola robo");
        } else if (data[index].tipoCrimen == "secuestro") {
          this.statusReportCount[8]++;
          console.log("hola secue");
        } else if (data[index].tipoCrimen == "narcotráfico") {
          this.statusReportCount[9]++;
          console.log("hola narci");
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
    getHourReportStatus: async function (data) {
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
    getTheMostAfectedPerson: function (list) {
      var temp = Math.max(...list);
      if (this.victimaHombre == temp) {
        return "hombres";
      } else if (this.victimaMUjer == temp) {
        return "Mujeres";
      } else {
        return "LGBT+";
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
          <h4 style="color:#ec407a;"> ${text} ${tempData.nombre}</h4>
          <p style="color:#ec407a;"><strong>${tempData.estatus}</strong></p>
          <p style="font-size: 15px;">${tempData.descripcion}</p>
          <b style="color:#9e9e9e;"> Reportado ${tempData.fecha} a las ${tempData.hora}</b>
          <a href="${tempData.referencia}" target="_blank">Referencia.</a>
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
        variant: "danger",
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
@import '@/scss/homePage.scss';

@media screen and (max-width: 759px) {
  #mapID {
    width: 100%;
    height: 500px;
    z-index: 3;
  }

  .thumbnail {
    width: 100%;
    height: auto;
  }
}
</style>