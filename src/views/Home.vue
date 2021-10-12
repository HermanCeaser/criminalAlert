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
            title="Crimenes"
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
        <b-col md="2"></b-col>
        <b-col sm>
          <b-form-group>
            <b-card
              title="Localizar ubicación"
              class="overflow-hidden shadow bg-white rounded"
            >
              <b-row>
                <b-col md="3"></b-col>
                <b-col sm>
                  <b-card-text>
                    Ingrese los datos lo más específicos posibles para localizar
                    su ubicación.
                  </b-card-text>
                </b-col>

                <b-col md="3"></b-col>
              </b-row>
              <b-row>
                <b-col md="3"
                  ><b-form-input
                    placeholder="colonia"
                    v-model="userDireccionData.colonia"
                  ></b-form-input
                ></b-col>
                <b-col md="3"
                  ><b-form-input
                    placeholder="calle"
                    v-model="userDireccionData.calle"
                  ></b-form-input
                ></b-col>
                <b-col md="2"
                  ><b-form-input
                    placeholder="#numero"
                    v-model="userDireccionData.numero"
                    type="number"
                  ></b-form-input
                ></b-col>
                <b-col md="2"
                  ><b-form-input
                    placeholder="codigo postal"
                    v-model="userDireccionData.zip"
                    type="number"
                  ></b-form-input
                ></b-col>
                <b-col md="1">
                  <b-button v-on:click="checAddress()" variant="outline-primary"
                    >Buscar</b-button
                  >
                </b-col>
              </b-row>
            </b-card>
          </b-form-group>
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
                          {{ statusReportCount[0] }}
                        </strong></b-col
                      >
                      <b-col>
                        <b-card-body title="Violación">
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
                          {{ statusReportCount[1] }}
                        </strong>
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
                          {{ statusReportCount[2] }}
                        </strong>
                      </b-col>
                      <b-col>
                        <b-card-body title="Agresión">
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
                          {{ statusReportCount[3] }}
                        </strong>
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
                          {{ statusReportCount[4] }}
                        </strong>
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
                          {{ statusReportCount[5] }}
                        </strong>
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
                          {{ statusReportCount[7] }}
                        </strong>
                      </b-col>
                      <b-col>
                        <b-card-body title="Narcotráfico">
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
                          {{ statusReportCount[9] }}
                        </strong>
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
                      De acuerdo con nuestros datos sobre él incide de víctimas
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
                          {{ victimaHombre }}
                        </strong></b-col
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
                          {{ victimaMUjer }}
                        </strong>
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
                          {{ victimaOtros }}
                        </strong>
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
                          {{ victimaNA }}
                        </strong>
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
                        <b-card-body title="Hora de 0 am a 10:59 am">
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
                          {{ morningReports }}
                        </strong></b-col
                      >
                      <b-col>
                        <b-card-body title="Hora de 11 am a  18:59 pm">
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
                          {{ noonReports }}
                        </strong>
                      </b-col>
                      <b-col>
                        <b-card-body title="Hora de 19 pm a  24:59 pm">
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
                          {{ nightReports }}
                        </strong>
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
import HomeJs from "../js/home.js";
import { db } from "../main";
export default {
  name: "home",
  components: {},
  mixins: [HomeJs],
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
    userAddress: "",
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
    userDireccionData: {
      colonia: "",
      calle: "",
      numero: "",
      zip: "",
    },
  }),
  async beforeMount() {
    //get a request with the information of the criminals
    this.getCriminalLocations();

    //get a request with the information of the lost Persons
    //this.getLostPersonLocation();

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

    checAddress: async function () {
      this.mapLoading = true;
      if (this.userLocation.length > 0) {
        let tempAddres = `${this.userDireccionData.colonia}, ${this.userDireccionData.calle}, ${this.userDireccionData.numero}, ${this.userDireccionData.zip} ,Tijuana, MX`;
        if (tempAddres.includes(this.userAddress)) {
          alert("La ubicacion ya fue ingresada");
          this.mapLoading = false;
          return;
        } else {
          this.userLocation = [];
          this.mapLoading = false;
        }
      }

      if (
        this.checAddressString(
          this.userDireccionData.colonia,
          this.userDireccionData.calle,
          this.userDireccionData.numero,
          this.userDireccionData.zip
        )
      ) {
        this.mapLoading = false;
        return;
      }

      this.userAddress = `${this.userDireccionData.colonia}, ${this.userDireccionData.calle}, ${this.userDireccionData.numero}, ${this.userDireccionData.zip} ,Tijuana, MX`;
      let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/criminalGetLocation",
        {
          address: this.userAddress,
        }
      );
      if (data === "No Results") {
        alert("No hay resultados de la direccion");
        this.mapLoading = true;
        return;
      }

      if (data.address == "Tijuana, Baja California, Mexico") {
        alert("Direccion no localizada");
        this.mapLoading = false;
        return;
      }

      let obj = {
        geoPoint: {
          latitude: data.geoPoint._latitude,
          longitude: data.geoPoint._longitude,
        },
        address: data.address,
      };
      this.userLocation.push(obj);
      this.mapLoading = false;
      this.haversine_distance(
        this.savedLocations,
        this.criminalsNearUser,
        this.userLocation
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
@import "@/scss/homePage.scss";
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