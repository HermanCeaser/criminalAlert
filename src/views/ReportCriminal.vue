<template>
  <div id="report">
    <div id="gradientBackground" class="gradient-custom"></div>
    <div id="avatarPick" class="">
      <b-avatar id="avatarID" src="" size="17rem">
        <b-overlay :show="avatarLoading" rounded="sm">
          <img v-bind:src="userAvatar" class="avatar" />
        </b-overlay>
      </b-avatar>
    </div>
    <div class="formContainer">
      <b-row>
        <b-col></b-col>
        <b-col md="6">
          <b-card
            id="criminalCard"
            header="featured"
            header-tag="header"
            footer=""
            footer-tag="footer"
            title="Reporte"
          >
            <br />
            <b-form @submit.prevent="handleFormSubmit">
              <b-overlay :show="loadingData" rounded="sm">
                <b-row>
                  <b-col>
                    <b-form-group
                      class="crimenStyle"
                      label="Descripción del reporte"
                    >
                      <b-form-textarea
                        id="textarea"
                        v-model="formData.descripcion"
                        placeholder="describir crimen..."
                        rows="3"
                        max-rows="6"
                      ></b-form-textarea>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      class="fechaHoraStyle"
                      label="Fecha y hora"
                      description="Ingresar fecha y hora de cuando ocurrió el suceso"
                    >
                      <b-form-datepicker
                        id="example-datepicker"
                        v-model="formData.fecha"
                        :min="minDate"
                        :max="maxDate"
                        class="mb-2"
                        placeholder="Ingrese una fecha"
                      ></b-form-datepicker>
                      <b-form-timepicker
                        v-model="formData.hora"
                        locale="en"
                        placeholder="Ingrese una hora"
                      ></b-form-timepicker>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      class="direccionStyle"
                      label="Dirección"
                      description="Si no se cuenta con el numero o codigo postal ingresar 0"
                    >
                      <b-form-input
                        placeholder="colonia "
                        v-model="formData.colonia"
                      ></b-form-input>
                      <b-form-input
                        placeholder="calle"
                        v-model="formData.calle"
                      ></b-form-input>
                      <b-form-input
                        placeholder="#numero"
                        type="number"
                        v-model="formData.numero"
                      ></b-form-input>
                      <b-form-input
                        placeholder="codigo postal"
                        type="number"
                        v-model="formData.postal"
                      ></b-form-input>
                    </b-form-group>
                    <b-alert
                      :show="dismissCountDown"
                      dismissible
                      variant="warning"
                      @dismissed="dismissCountDown = 0"
                      @dismiss-count-down="countDownChanged"
                    >
                      <p>
                        {{ imputSearchMsm }}
                      </p>
                    </b-alert>
                    <b-button v-on:click="checkMap" variant="outline-primary"
                      >Buscar</b-button
                    >
                    <b-overlay :show="mapSearch" rounded="sm">
                      <GmapMap
                        id="mapID"
                        :center="{ lat: 32.513, lng: -117.05 }"
                        :zoom="11"
                        map-type-id="roadmap"
                      >
                        <div v-if="savedLocations.length > 0">
                          <GmapMarker
                            :key="index"
                            v-for="(l, index) in savedLocations"
                            :position="{
                              lat: l.geoPoint.latitude,
                              lng: l.geoPoint.longitude,
                            }"
                          />
                        </div>
                      </GmapMap>
                    </b-overlay>
                  </b-col>
                </b-row>
                <br />
                <b-row>
                  <b-col>
                    <b-form-group
                      class="estatusStyle"
                      label="Estatus del reporte"
                    >
                      <b-form-select
                        v-model="selected"
                        :options="options"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group class="estatusStyle" label="Tipo de caso">
                      <b-form-select
                        v-model="selectedType"
                        :options="optionTypeCrime"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      class="estatusStyle"
                      label="Sexo de la victima"
                    >
                      <b-form-select
                        v-model="selectedSex"
                        :options="optionSex"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      class="referenciaStyle"
                      label="Referencia"
                      description="La referencia debe ser de sitios confiables: zetatijuana, elsoldetijuana, tijuanainformativo, elimparcial, alfredoalvarez, afntijuana, milenio"
                    >
                      <b-form-input
                        placeholder="link de la noticia o referencia"
                        v-model="formData.referencia"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-alert
                      :show="dismissFormCount"
                      dismissible
                      variant="danger"
                      @dismissed="dismissFormCount = 0"
                      @dismiss-count-down="countDownFormChanged"
                    >
                      <p>
                        {{ inputMsm }}
                      </p>
                    </b-alert>
                    <b-button type="submit" variant="danger">Reportar</b-button>
                  </b-col>
                </b-row>
              </b-overlay>
            </b-form>
          </b-card>
        </b-col>
        <b-col></b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../main";
import ReportJs from "../js/reportCriminal.js";
import firebase from "firebase";
require("firebase/auth");

export default {
  name: "checkDirrecion",
  mixins: [ReportJs],
  data: () => ({
    userTag: null,
    savedLocations: [],
    user: null,
    loadingData: false,
    mapSearch: false,
    dismissSecs: 5,
    dismissCountDown: 0,
    dismissFormCount: 0,
    count: 0,
    avatarLoading: true,
    inputMsm:
      " Debe ingresar todos los datos del formulario, para poder realizar un reporte.",
    imputSearchMsm: "",
    userAvatar:
      "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
    formData: {
      descripcion: "",
      fecha: "",
      hora: "",
      colonia: "",
      calle: "",
      numero: "",
      postal: "",
      selected: "",
      referencia: "",
    },
    selected: null,
    options: [
      { value: null, text: "Seleccione una opcion" },
      { value: "sin detenidos", text: "sin detenidos" },
      { value: "en proceso", text: "en proceso" },
      { value: "en carcel", text: "en carcel" },
    ],
    selectedType: null,
    optionTypeCrime: [
      { value: null, text: "Seleccione una opcion" },
      { value: "asesinato", text: "asesinato" },
      { value: "violación", text: "violación" },
      { value: "asalto", text: "asalto" },
      { value: "agresión", text: "agresión" },
      { value: "homicidio", text: "homicidio" },
      { value: "asaltoSexual", text: "asalto sexual" },
      { value: "violenciaDomestica", text: "violencia doméstica" },
      { value: "robo", text: "robo" },
      { value: "otro", text: "otro" },
    ],
    selectedSex: null,
    optionSex: [
      { value: null, text: "Seleccione una opcion" },
      { value: "hombre", text: "hombre" },
      { value: "mujer", text: "mujer" },
      { value: "otro", text: "otro" },
      { value: "noIdentificado", text: "sin indetificar" },
      { value: "ninguna", text: "ninguna victima" },
    ],
    minDate: new Date("January 01, 2021 00:00:00"),
    maxDate: new Date("December 31, 2021 11:59:59"),
  }),
  beforeMount() {
    //will get te currnet user , so we can get his avatar to display
    this.user = firebase.auth().currentUser;
    if (this.user != null) {
      let email = this.user.email;
      let userSepatator = email.split("@");
      this.userTag = userSepatator[0];
    } else {
      console.log("user do not exist");
    }

    const userRef = db.collection("user").doc(this.user.uid);
    userRef.get().then(async (docSnapshot) => {
      if (docSnapshot.exists) {
        this.userAvatar = docSnapshot.data().avatar;
        this.avatarLoading = false;
      } else {
        console.log("no existe!");
      }
    });
  },
  methods: {
    checkMap: async function () {
      this.savedLocations = []; // we empty the array
      if (
        this.emptyInputSearchData(
          this.formData.colonia,
          this.formData.calle,
          this.formData.numero,
          this.formData.postal
        )
      ) {
        return;
      }
      this.mapSearch = true;
      //Will make the request
      let address = `${this.formData.colonia} ${this.formData.calle} ${this.formData.numero},Tijuana, MX, ${this.formData.postal}`;
      let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/criminalGetLocation",
        {
          address: address,
        }
      );
      if (data == "No Results") {
        alert("No hay resultados de la direccion");
        this.mapSearch = false;
        return;
      } else if (data.address == "Tijuana, Baja California, Mexico") {
        this.dismissCountDown = this.dismissSecs;
        this.imputSearchMsm =
          "Direccion no localizada, debe ingresar una datos validos";
        this.mapSearch = false;
        return;
      } else {
        this.mapSearch = false;
        console.log(data.address);
      }

      //Will massage data
      let obj = {
        address: data.address,
        geoPoint: {
          latitude: data.geoPoint._latitude,
          longitude: data.geoPoint._longitude,
        },
      };
      //add to saved locations to update map
      this.savedLocations.push(obj);
    },
    handleFormSubmit: async function () {
      if (
        !this.formData.descripcion ||
        !this.formData.fecha ||
        !this.formData.hora ||
        !this.formData.referencia ||
        !this.selected ||
        !this.selectedType ||
        !this.selectedSex
      ) {
        this.dismissFormCount = this.dismissSecs;
        this.loadingData = false;

        this.inputMsm =
          "Debe ingresar todos los datos del formulario, para poder realizar un reporte.";
        return;
      }

      if (this.savedLocations.length <= 0) {
        this.dismissFormCount = this.dismissSecs;
        this.inputMsm = "Debe ingresar una ubicacion valida, para continuar";
        return;
      }

      if (this.validateDescriptionWhiteSpaces(this.formData.descripcion)) {
        this.dismissFormCount = this.dismissSecs;
        this.inputMsm =
          "Debe ingresar todos los datos del formulario, para poder realizar un reporte.";
        return;
      }

      //Valite if the user ener a valid http address
      if (!this.referenceVerification(this.formData.referencia)) {
        this.dismissFormCount = this.dismissSecs;
        this.loadingData = false;
        return;
      }
      //Will show a message, to let know the user the data
      //is  bieng loadded
      this.loadingData = true;
      let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/criminalFormData",
        {
          descripcion: this.formData.descripcion,
          fecha: this.formData.fecha,
          hora: this.formData.hora,
          status: this.selected,
          referencia: this.formData.referencia,
          latitude: this.savedLocations[0].geoPoint.latitude,
          longitude: this.savedLocations[0].geoPoint.longitude,
          currentUserID: this.user.uid,
          typeCrime: this.selectedType,
          typeSex: this.selectedSex,
        }
      );
      if (data == undefined) {
        alert("Problemas al ingresar los datos a la base de datos");
        return;
      }
      if (data === "No Results") {
        alert("Problemas al ingresar los datos a la base de datos");
        return;
      }
      //increment te report's from the user
      const userRef = db.collection("user").doc(this.user.uid);
      const resTem = await userRef
        .update({
          reportes: firebase.firestore.FieldValue.increment(1),
        })
        .then(() => {
          this.showToast();
          this.loadingData = false;
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });

      this.cleanForm();
    },
  },
};
</script>



<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import "@/scss/reportCriminal.scss";

@media screen and (max-width: 759px) {
  #mapID {
    width: 100%;
    height: 400px;
  }
  #avatarID {
    z-index: 2;
    border: 15px solid white;
    background: #ffffff;
  }

  #avatarPick {
    margin-top: 13%;
    position: absolute;
    right: 20%;
    top: -0%;
    left: 21%;
  }
  .avatar {
    width: 100%;
    height: 380px;
  }
  .formContainer {
    margin-top: -40%;
    margin-bottom: 3%;
  }
}
</style>