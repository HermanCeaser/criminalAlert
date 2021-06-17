<template>
  <div id="home" class="">
    <div id="gradientBackground" class="gradient-custom"></div>

    <b-row id="mapContainer">
      <b-col></b-col>
      <b-col sm>
        <b-card title="Criminales" sub-title="registrados">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-text>
                <h4>{{ regCriminals }}</h4>
              </b-card-text>
            </b-col>
            <b-col md="6"
              ><b-avatar icon="people-fill" size="4em" variant="info "></b-avatar
            ></b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col sm>
        <b-card title="Usuarios" sub-title="totales">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-text>
                <h4 id="usuariosCount">{{ totalUsers }}</h4>
              </b-card-text>
            </b-col>
            <b-col md="6"
              ><b-avatar icon="emoji-sunglasses-fill" size="4em" variant="info "></b-avatar
            ></b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col sm>
        <b-card title="Destacado" sub-title="usuario ">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-text>
                <p>{{ userStar }}</p>
              </b-card-text>
            </b-col>
            <b-col md="6"
              ><b-avatar icon="star-fill" size="4em" variant="info "  ></b-avatar
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
          </GmapMap>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
  </div>
</template>

<script>
import { db } from "../main";
export default {
  name: "home",
  data: () => ({
    savedLocations: [],
    regCriminals: 0,
    totalUsers: 0,
    totalReportUser: 0,
    userID: null,
    userStar: "Don Puerko",
    infoWindow: {
      position: { lat: 0, lng: 0 },
      open: false,
      template: "",
    },
  }),
  async beforeMount() {
    const snap = await db.collection("criminalInfo").get();
    const userSnap = await db.collection("user").get();
    const userCriminalSnap = await db.collection("userCriminalInfo").get();

    if (snap.empty) {
      console.log("No such document!");
      return;
    }

    snap.docs.forEach((doc) => {
      this.savedLocations.push(doc.data());
    });

    userCriminalSnap.docs.forEach((doc) => {
      const tempCriminalUserArray = doc.data();
      if (tempCriminalUserArray.criminalsID.length > this.totalReportUser) {
        this.totalReportUser = tempCriminalUserArray.criminalsID.length;
        this.userID = doc.id;
      }
    });

    userSnap.docs.forEach((doc) => {
      if (this.userID === doc.id) {
        this.userStar = doc.data().correo;
      }
      this.totalUsers++;
    });

    this.regCriminals = this.savedLocations.length;
  },
  methods: {
    openInfoWindowTemplate: function (index) {
      const {
        nombre,
        descripcion,
        fecha,
        hora,
        geoPoint = [latitude, longitude],
        estatus,
        referencia,
      } = this.savedLocations[index];
      console.log("test home data: " + referencia);

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
      //this.$refs.markers[index].$markerObject.setAnimation(google.maps.Animation.BOUNCE)
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
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

#gradientBackground {
  z-index: 1;
}

p {
  color: #5c6bc0;
}

h4 {
  color: #26418f;
}




.gradient-custom {
  width: 100%;
  height: 400px;
  /* fallback for old browsers */
  background: #37ecba;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(
    to right,
    rgba(55, 236, 186, 1),
    rgba(114, 175, 211, 1)
  );

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(
    to right,
    rgba(55, 236, 186, 1),
    rgba(114, 175, 211, 1)
  );
}

@media screen and (max-width: 759px) {
  #mapID {
    width: 100%;
    height: 500px;
    z-index: 3;
  }
}
</style>