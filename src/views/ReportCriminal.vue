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
                      class="nameCriminal"
                      label="Nombre  del criminal"
                    >
                      <b-form-input
                        placeholder="nombre criminal"
                        v-model="formData.nameCri"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      class="crimenStyle"
                      label="Descripcion del crimen"
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
                    <b-form-group class="fechaHoraStyle" label="Fecha y hora">
                      <b-form-datepicker
                        id="example-datepicker"
                        v-model="formData.fecha"
                        class="mb-2"
                      ></b-form-datepicker>
                      <b-form-timepicker
                        v-model="formData.hora"
                        locale="en"
                      ></b-form-timepicker>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      class="direccionStyle"
                      label="Direccion"
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
                        v-model="formData.numero"
                      ></b-form-input>
                      <b-form-input
                        placeholder="codigo postal"
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
                        Debe ingresar la colonia, calle, numero exterior y
                        codigo postal para continuar con la busqueda.
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
                    <b-form-group class="estatusStyle" label="Estatus criminal">
                      <b-form-select
                        v-model="selected"
                        :options="options"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group class="estatusStyle" label="Tipo de crimen">
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
                    <b-form-group class="referenciaStyle" label="Referencia">
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
import firebase from "firebase";
require("firebase/auth");

export default {
  name: "checkDirrecion",
  data: () => ({
    userTag: null,
    savedLocations: [],
    user: null,
    showDismissibleAlert: false,
    loadingData: false,
    mapSearch: false,
    dismissSecs: 5,
    dismissCountDown: 0,
    dismissFormCount: 0,
    count: 0,
    avatarLoading: true,
    inputMsm:
      " Debe ingresar todos los datos del formulario, para poder realizar un reporte.",
    userAvatar:
      "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
    formData: {
      nameCri: "",
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
      { value: "asalto exual", text: "asalto sexual" },
      { value: "violencia domestica", text: "violencia doméstica" },
      { value: "robo", text: "robo" },
    ],
    selectedSex: null,
    optionSex: [
      { value: null, text: "Seleccione una opcion" },
      { value: "hombre", text: "hombre" },
      { value: "mujer", text: "mujer" },
    ],
  }),
  beforeMount() {
    this.user = firebase.auth().currentUser;
    if (this.user != null) {
      var email = this.user.email;
      let userSepatator = email.split("@");
      this.userTag = userSepatator[0];
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
    checkMap: async function (event) {
      this.savedLocations = []; // we empty the array
      if (
        !this.formData.colonia ||
        !this.formData.calle ||
        !this.formData.numero ||
        !this.formData.postal
      ) {
        this.dismissCountDown = this.dismissSecs;
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
      if (data === "No Results") {
        alert("No hay resultados de la direccion");
        this.mapSearch = false;
        return;
      } else {
        this.mapSearch = false;
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
    async handleFormSubmit() {
      if (
        !this.formData.colonia ||
        !this.formData.calle ||
        !this.formData.numero ||
        !this.formData.postal ||
        !this.formData.nameCri ||
        !this.formData.descripcion ||
        !this.formData.fecha ||
        !this.formData.hora ||
        !this.selected ||
        !this.formData.referencia
      ) {
        this.dismissFormCount = this.dismissSecs;
        this.loadingData = false;
        this.inputMsm =
          "Debe ingresar todos los datos del formulario, para poder realizar un reporte.";
        return;
      }
      let res = this.formData.referencia.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      if (res === null) {
        this.dismissFormCount = this.dismissSecs;
        this.loadingData = false;
        this.inputMsm =
          "Debe ingresar  url valido para continuar ejemlo: www.google.com";
        return;
      }
      this.loadingData = true;
      //Will show a message, to let knmow the user the data
      //is  bieng loadded
      var uid = this.user.uid;
      let { data } = await axios.post(
        "https://us-central1-criminalalertdb.cloudfunctions.net/criminalFormData",
        {
          criminalName: this.formData.nameCri,
          descripcion: this.formData.descripcion,
          fecha: this.formData.fecha,
          hora: this.formData.hora,
          status: this.selected,
          referencia: this.formData.referencia,
          latitude: this.savedLocations[0].geoPoint.latitude,
          longitude: this.savedLocations[0].geoPoint.longitude,
          currentUserID: uid,
        }
      );

      if (data === "No Results") {
        alert("Problemas al ingresar los datos a la base de datos");
        return;
      } else if (data === "TERROR") {
        alert("Problema con la busqueda de  user criminal ");
      } else {
        //increment te report's from the user
        const userRef = db.collection("user").doc(uid);
        // Atomically increment the population of the city by 50.
        const res = await userRef
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
      }

      this.formData.colonia = "";
      this.formData.calle = "";
      this.formData.numero = "";
      this.formData.postal = "";
      this.formData.nameCri = "";
      this.formData.descripcion = "";
      this.formData.fecha = "";
      this.formData.hora = "";
      this.selected = "";
      this.formData.referencia = "";
      this.savedLocations = []; // we empty the array
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    countDownFormChanged(dismissFormCount) {
      this.dismissFormCount = dismissFormCount;
    },
    showToast() {
      // Use a shorter name for this.$createElement
      const h = this.$createElement;
      // Increment the toast count
      this.count++;
      // Create the message
      const vNodesMsg = h("p", { class: ["text-center", "mb-0"] }, [
        h("b-spinner", { props: { type: "grow", small: true } }),
        " Registro ",
        h("strong", "exitoso!"),
        ` # ${this.count} `,
        h("b-spinner", { props: { type: "grow", small: true } }),
      ]);
      // Create the title
      const vNodesTitle = h(
        "div",
        { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] },
        [
          h("strong", { class: "mr-2" }, "The Title"),
          h("small", { class: "ml-auto text-italics" }, "42 seconds ago"),
        ]
      );
      // Pass the VNodes as an array for message and title
      this.$bvToast.toast([vNodesMsg], {
        title: [vNodesTitle],
        solid: true,
        variant: "info",
      });
    },
    showMapDisplay() {
      const h = this.$createElement;
    },
  },
};
</script>



<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");

.nameCriminal,
.fechaHoraStyle,
.direccionStyle,
.estatusStyle,
.referenciaStyle,
.crimenStyle {
  color: #ec407a;
  font-family: "Roboto", sans-serif;
  text-align: left;
}

header {
  background-color: #ec407a;
  color: #ec407a;
}

#criminalCard {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  color: #ec407a;
}

#criminalCard:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

#mapID {
  width: 100%;
  height: 400px;
  margin-top: 30px;
}

#report {
  overflow: hidden;
}

.formContainer {
  margin-top: -5%;
  margin-bottom: 3%;
}

#userName {
  text-align: center;
  font-size: 20px;
}

#avatarID {
  z-index: 2;
  border: 15px solid white;
  background: #ec407a;
}

#avatarPick {
  margin-top: 9%;
  position: absolute;
  right: 20%;
  top: -0%;
  left: 21%;
}

.avatar {
  width: 100%;
  height: 300px;
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
    height: 400px;
  }

  #avatarID {
    z-index: 2;
    border: 15px solid white;
    background: #ffffff;
  }

  #avatarPick {
    margin-top: 20%;
    position: absolute;
    right: 20%;
    top: -0%;
    left: 21%;
  }

  .avatar {
    width: 100%;
    height: 300px;
  }

  .formContainer {
    margin-top: -40%;
    margin-bottom: 3%;
  }
  
}
</style>