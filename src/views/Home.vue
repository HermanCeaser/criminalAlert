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
                  <p>
                    <strong>{{ userStar }}</strong> con un total de
                    {{ totalReportUser }} reportes
                  </p>
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
                    <div>
                      <p>Califica la veracidad de esta noticia:</p>
                      <b-button
                        @click="saveUserLike(true)"
                        class="material-icons"
                        aria-hidden="true"
                        pill
                        variant="outline-success"
                        :disabled="isActiveLike"
                      >
                        thumb_up
                      </b-button>
                      <b-button
                        @click="saveUserLike(false)"
                        class="material-icons"
                        pill
                        variant="outline-danger"
                        aria-hidden="true"
                        :disabled="isActiveDislike"
                      >
                        thumb_down
                      </b-button>
                      <h4>
                        <b-badge pill class="bagde_thumb_up_color">{{
                          like
                        }}</b-badge>
                        <b-badge pill class="bagde_thumb_down_color">{{
                          dislike
                        }}</b-badge>
                      </h4>
                    </div>
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
                            id="narcotrafico"
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
    <div>
      <b-modal
        ref="user-msn"
        hide-footer
        id="modal-center"
        centered
        title="Reporte"
      >
        <div class="d-block text-center">
          <h4>
            <p>{{ likeMsm }}</p>
          </h4>
        </div>
        <b-button
          @click="closeModalRating"
          class="mt-3"
          variant="outline-primary"
          block
          >cerrar</b-button
        >
      </b-modal>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import HomeJs from "../js/home.js";
import { db } from "../main";
import firebase from "firebase";
require("firebase/auth");
export default {
  name: "home",
  mixins: [HomeJs],
  data: () => ({
    savedLocations: [],
    savedLocationsIds: [],
    userLocation: [],
    likeMsm: "",
    lostPersonLocations: [],
    criminalsNearUser: [],
    statusReportCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    regCriminals: 0,
    totalUsers: 0,
    totalReportUser: 0,
    userID: null,
    userAddress: "",
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
    counter: 0,
    currentReportSelected: 0,
    userLike: false,
    like: 0,
    isActiveLike: false,
    isActiveDislike: false,
    dislike: 0,
    infoWindow: {
      position: { lat: 0, lng: 0 },
      open: false,
      template: "",
    },
    userIds: [],
    key: false,
    userDireccionData: {
      colonia: "",
      calle: "",
      numero: "",
      zip: "",
    },
    ratingArray: [
      {
        id: "",
        likes: 0,
        dislikes: 0,
      },
    ],
    currentUser: null,
    userRef: null,
    userCriminalRatings: [],
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
        this.mapLoading = false;
        return;
      } else if (data == undefined) {
        console.log("problem with map loading");
        this.mapLoading = false;
        return;
      } else {
        this.mapLoading = false;
        this.savedLocations = data.location;
        this.savedLocationsIds = data.id;
        this.userIds = data.userIds;
        //set a counter for all the criminals register
        this.regCriminals = this.savedLocations.length;

        // get the report status of every crime
        this.getReportStatus(
          this.savedLocations == null ? 0 : this.savedLocations
        );
        this.getSexReportStatus(
          this.savedLocations == null ? 0 : this.savedLocations
        );
        this.getHourReportStatus(
          this.savedLocations == null ? 0 : this.savedLocations
        );
        //get report rating
        this.getReportsRatings(this.userIds);
        this.currentUser = await firebase.auth().currentUser;
        if (this.currentUser !== null) {
          this.userRef = await db
            .collection("userCriminalRatings")
            .doc(this.currentUser.uid);
          await this.getUserRatingSnapShoot();
        }
      }
    },
    getReportsRatings: async function (userIds) {
      this.ratingArray = [];
      const ratingRef = await db.collection("userCriminalRatings").get();
      ratingRef.docs.forEach((doc) => {
        for (let index = 0; index < userIds.length; index++) {
          if (userIds[index] == doc.id) {
            for (
              let index = 0;
              index < doc.data().criminalsID.length;
              index++
            ) {
              let data = doc.data().criminalsID[index];
              let isThere = false;
              let tempIndex = 0;
              for (let index = 0; index < this.ratingArray.length; index++) {
                if (this.ratingArray[index].id == data.id) {
                  isThere = true;
                  tempIndex = index;
                  break;
                }
              }
              if (!isThere) {
                let temp = {
                  id: data.id,
                  likes: data.like,
                  dislikes: data.dislike,
                };
                this.ratingArray.push(temp);
              } else {
                this.ratingArray[tempIndex].likes += data.like;
                this.ratingArray[tempIndex].dislikes += data.dislike;
              }
            }
          }
        }
      });
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
      this.totalReportUser = data.regCriminals;
      this.userID = data.userID;
    },
    myFunction: function () {
      alert("hola test");
    },

    getUserRatingSnapShoot: function () {
      this.userCriminalRatings = [];
      this.userRef.get().then(async (docSnapshot) => {
        if (docSnapshot.exists) {
          if (docSnapshot.data().criminalsID.length > 0) {
            this.userCriminalRatings = docSnapshot.data();
          }
        }
      });
    },

    verifyIfUserAlreadyVoted: function (userRating) {
      if (this.userCriminalRatings.criminalsID === undefined) {
        return false;
      }
      console.log("Test:" + this.userCriminalRatings.criminalsID);
      console.log("Test2:" + this.userCriminalRatings);
      for (
        let index = 0;
        index < this.userCriminalRatings.criminalsID.length;
        index++
      ) {
        if (
          this.userCriminalRatings.criminalsID[index].id ==
          this.savedLocationsIds[this.currentReportSelected]
        ) {
          if (
            this.userCriminalRatings.criminalsID[index].rating == userRating
          ) {
            return true;
          }
        }
      }
      return false;
    },

    saveUserLike: async function (userRating) {
      this.key = false;
      if (this.currentUser == null) {
        this.likeMsm = "Dede  ingresar a su cuenta para calificar noticias";
        this.$refs["user-msn"].show();
        return;
      }

      if (this.verifyIfUserAlreadyVoted(userRating)) {
        this.likeMsm =
          "No se permiten realizar más de un voto por la misma opción";
        this.$refs["user-msn"].show();
        return;
      }

      if (userRating) {
        this.like += 1;
        if (this.dislike > 0) {
          this.dislike -= 1;
        }
      } else {
        this.dislike += 1;
        if (this.like > 0) {
          this.like -= 1;
        }
      }

      /*let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/userCriminalRatings",
        {
          reportId: this.savedLocationsIds[this.currentReportSelected],
          userReportState: userRating,
          userId: currentUser.uid,
        }
      );
      if (data) {
        //create toast
        this.ratingStateToast(true);
      } else {
        this.ratingStateToast(false);
      }*/
      if (this.userCriminalRatings.criminalsID === undefined) {
        let criminalsID = {
          id: this.savedLocationsIds[this.currentReportSelected],
          like: userRating ? 1 : 0,
          dislike: userRating ? 0 : 1,
          rating: userRating,
        };
        let data = {
          criminalsID: [criminalsID],
        };
        const newUser = db
          .collection("userCriminalRatings")
          .doc(this.currentUser.uid)
          .set(data)
          .then(() => {
            this.getCriminalLocations();
            return;
          });
        return;
      }

      if (this.userCriminalRatings.criminalsID.length > 0) {
        for (
          let index = 0;
          index < this.userCriminalRatings.criminalsID.length;
          index++
        ) {
          if (
            this.userCriminalRatings.criminalsID[index].id ==
            this.savedLocationsIds[this.currentReportSelected]
          ) {
            this.key = true;
            this.userCriminalRatings.criminalsID[index].rating = userRating;
            this.userCriminalRatings.criminalsID[index].dislike = userRating
              ? this.userCriminalRatings.criminalsID[index].dislike - 1
              : this.userCriminalRatings.criminalsID[index].dislike + 1;

            this.userCriminalRatings.criminalsID[index].like = userRating
              ? this.userCriminalRatings.criminalsID[index].like + 1
              : this.userCriminalRatings.criminalsID[index].like - 1;

            this.userRef
              .update({
                criminalsID: this.userCriminalRatings.criminalsID,
              })
              .then(() => {
                this.getCriminalLocations();
              });
          }
        }
        if (!this.key) {
          this.userRef
            .update({
              criminalsID: firebase.firestore.FieldValue.arrayUnion({
                id: this.savedLocationsIds[this.currentReportSelected],
                like: userRating ? 1 : 0,
                dislike: userRating ? 0 : 1,
                rating: userRating,
              }),
            })
            .then(() => {
              this.getCriminalLocations();
            });
        }
      } else {
        let criminalsID = {
          id: this.savedLocationsIds[this.currentReportSelected],
          like: userRating ? 1 : 0,
          dislike: userRating ? 0 : 1,
          rating: userRating,
        };
        let data = {
          criminalsID: [criminalsID],
        };
        const newUser = db
          .collection("userCriminalRatings")
          .doc(this.currentUser.uid)
          .set(data)
          .then(() => {
            this.getCriminalLocations();
          });
      }

      //this.getReportsRatings(this.userIds);
      //this.getUserRatingSnapShoot();
    },

    closeModalRating: function () {
      this.$refs["user-msn"].hide();
    },
    checAddress: async function () {
      this.mapLoading = true;
      if (this.isUserLocation()) return;

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
      if (this.verifyDataState(data)) return;
      this.setUserLocation(data);
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import "@/scss/homePage.scss";
div.image:before {
  content: url(http://placehold.it/350x150);
}
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