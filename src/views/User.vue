<template>
  <b-overlay :show="loadingPage" :variant="light" :opacity="1" rounded="sm">
    <div id="user">
      <div id="gradientBackground" class="gradient-custom"></div>
      <div id="userInfoTop">
        <b-row>
          <b-col md="1"></b-col>
          <b-col md="2">
            <b-overlay :show="loadingData" rounded="sm">
              <div id="card" v-bind:class="cardStates" class="card">
                <div class="card-info">
                  <div class="card-image">
                    <img
                      v-bind:src="userData.avatar"
                      class="card-avatar card-avatar--circle"
                    />
                  </div>
                  <div class="card-fields">
                    <h1 v-show="!isEditing" class="card-name">
                      {{ userData.nick }}
                    </h1>
                    <input
                      v-show="isEditing"
                      type="text"
                      v-model="userData.nick"
                      class="card-input"
                      placeholder="Ingrese su nick"
                    />
                  </div>
                  <button
                    v-on:click="shelfToggle"
                    v-bind:disabled="isEditing"
                    v-bind:class="toggleOpen"
                    class="card-button card-expander"
                    aria-label="expand-shelf"
                  >
                    <i class="material-icons" aria-hidden="true">add</i>
                  </button>
                </div>
                <div class="card-shelf" v-bind:class="shelfIsOpen">
                  <div class="card-content">
                    <div class="card-fields">
                      <p v-show="!isEditing" class="card-bio">
                        Haz reportado a {{ userData.reportes }} criminales
                      </p>
                    </div>
                  </div>
                </div>
                <button v-on:click="editContent" class="card-button card-edit">
                  <i
                    v-show="!isEditing"
                    class="material-icons"
                    aria-hidden="true"
                    >create</i
                  >
                  <i
                    v-show="isEditing"
                    class="material-icons"
                    aria-hidden="true"
                    >save</i
                  >
                </button>
              </div>
            </b-overlay>
          </b-col>
          <b-col md="8">
            <b-row>
              <b-table
                sticky-header
                :fields="fields"
                :items="items"
                ref="selectableTable"
                selectable
                @row-selected="onRowSelected"
                hover
                responsive
                head-variant="light"
                class="tableCriminals"
              >
                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>
              </b-table>
            </b-row>
            <div>
              <b-button
                id="show-btn"
                pill
                block
                variant="danger"
                v-b-modal.modal-center
                @click="showModal"
                >Borrar</b-button
              >
              <b-modal
                ref="my-modal"
                hide-footer
                id="modal-center"
                centered
                title="Reportes seran borados de la base de datos"
              >
                <div class="d-block text-center">
                  <div v-if="selected.length > 0">
                    <div :key="index" v-for="(item, index) in selected">
                      {{ index + 1 }} - {{ item.nombre }} fecha:
                      {{ item.fecha }} estatus:
                      {{ item.estatus }}
                    </div>
                  </div>
                  <div v-else>
                    <h4>Seleccione registros a borrar</h4>
                  </div>
                </div>
                <b-button
                  class="mt-3"
                  variant="outline-danger"
                  block
                  @click="deleteSelected"
                  >Continuar</b-button
                >
                <b-button
                  class="mt-2"
                  variant="outline-warning"
                  block
                  @click="closeModal"
                  >Cancelar</b-button
                >
              </b-modal>
            </div>
          </b-col>
          <b-col md="1"> </b-col>
        </b-row>
        <br />
        <br />
        <br />
        <!--
        <b-row>
          <b-col md="1"></b-col>
          <b-col md="2">
            <b-card no-body class="overflow-hidden shadow bg-white rounded">
              <b-card-body title="Reportes de personas desaparecidas">
                <b-card-text>
                  Por el momento no se pueden eliminar reportes de personas
                  desaparecidas, le agradecemos comprensión.
                </b-card-text>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col sm>
            <b-row>
              <b-table
                sticky-header
                :fields="fields"
                :items="itemsLostPerson"
                hover
                responsive
                head-variant="light"
                class="tableCriminals"
              >
              </b-table> </b-row
          ></b-col>
          <b-col md="1"></b-col>
        </b-row>
        -->
        <br />
      </div>
      <div id="logOut">
        <b-button @click="signOut" variant="info">Sign out</b-button>
      </div>
      <b-alert
        v-model="showTop"
        class="position-fixed fixed-top m-0 rounded-0"
        style="z-index: 2000"
        variant="danger"
        dismissible
      >
        {{ verificationMsm }}
      </b-alert>
      <b-toast id="my-toast" variant="success" solid>
        <template #toast-title>
          <div class="d-flex flex-grow-1 align-items-baseline">
            <b-img
              blank
              blank-color="#81c784"
              class="mr-2"
              width="12"
              height="12"
            ></b-img>
            <strong class="mr-auto">Notice!</strong>
          </div>
        </template>
        Se ha actualizado su information de usuario
      </b-toast>
    </div>
    <template #overlay>
      <div class="text-center">
        <b-icon
          icon="stopwatch"
          font-scale="3"
          animation="cylon"
          variant="danger"
        ></b-icon>
        <p id="cancel-label">Please wait...</p>
      </div>
    </template>
  </b-overlay>
</template>

<script>
import firebase from "firebase";
import { db } from "../main";
import User from "../js/user.js";
require("firebase/auth");
export default {
  name: "User",
  mixins: [User],
  data: () => ({
    loggedIn: false,
    email: "nicholas.cage@theone.com",
    bio: "Back in my day...",
    isShelfOpen: false,
    isEditing: false,
    userID: null,
    userRef: null,
    userTemp: null,
    isBusy: true,
    showTop: false,
    toastId: "-1",
    verificationMsm: "",
    loadingData: false,
    loadingPage: false,
    userData: {
      nick: "",
      correo: "nicholas.cage@theone.com",
      reportes: "0",
      avatar:
        "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
    },
    fields: [
      "selected",
      "nombre",
      "descripcion",
      "fecha",
      "hora",
      "estatus",
      "referencia",
    ],
    items: [
      {
        nombre: "",
        descripcion: "",
        fecha: "",
        hora: "",
        estatus: "",
        referencia: "",
        id: "",
      },
    ],
    itemsLostPerson: [
      {
        nombre: "",
        descripcion: "",
        fecha: "",
        hora: "",
        estatus: "",
        referencia: "",
        id: "",
      },
    ],
    selected: [],
    chart: [
      {
        sinDetenidos: 0,
        enProceso: 0,
        enCarcel: 0,
      },
    ],
    tempSinDetenidos: 0,
    indexEnProceso: 0,
    indexEnCarcel: 0,
  }),
  mounted() {
    this.userTemp = firebase.auth().currentUser;
    this.userID = this.userTemp.uid;
    this.loadingPage = true;
    this.checkUser();
    this.setupFirebase();
    this.fillTable("criminal");
    //this.fillTable("lostPerson");
  },
  computed: {
    cardStates() {
      return {
        "card--is-open": this.isShelfOpen,
        "card--is-edit": this.isEditing,
      };
    },
    toggleOpen() {
      if (!this.isEditing) {
        return {
          "card-expander--is-open": this.isShelfOpen,
        };
      }
    },
    shelfIsOpen() {
      return {
        "card-shelf--is-open": this.isShelfOpen,
      };
    },
  },
  methods: {
    checkUser() {
      //we are going to check is the user exist on the data base
      this.userRef = db.collection("user").doc(this.userID);
      this.userRef.get().then(async (docSnapshot) => {
        if (docSnapshot.exists) {
          this.setUserData();
        } else {
          let data = {
            nick: "SugarCube",
            correo: this.userTemp.email,
            avatar:
              "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
            reportes: 0,
          };
          db.collection("user").doc(this.userID).set(data);
          this.userRef = db.collection("user").doc(this.userID);
          /*if (!this.userRef.emailVerified) {
            this.showTop = true;
            this.verificationMsm =
              "Se ha enviado un correo para verificar su email, revise su bandeja de entrada para activar su cuenta.";
          }*/
          this.setUserData();
        }
      });
    },
    deleteSelected() {
      if (this.selected.length <= 0) {
        this.$refs["my-modal"].hide();
        return;
      }

      let ids = [];
      for (let index = 0; index < this.selected.length; index++) {
        ids[index] = this.selected[index].id;
      }
      console.log("user id:" + this.userID);
      for (let index = 0; index < ids.length; index++) {
        console.log(" id " + index + " " + ids[index]);
      }

      //first  we're going to delete the id fonr tue user list
      const criminalInfoIDs = db
        .collection("userCriminalInfo")
        .doc(this.userID);
      for (let index = 0; index < ids.length; index++) {
        criminalInfoIDs
          .update({
            criminalsID: firebase.firestore.FieldValue.arrayRemove(ids[index]),
          })
          .then(() => {
            //second we are going to  decrement the user criminal count
            this.userRef
              .update({
                reportes: firebase.firestore.FieldValue.increment(-1),
              })
              .then(() => {
                //Third we are going to delete from the criminal databasse
                let criminalInfo = db
                  .collection("criminalInfo")
                  .doc(ids[index])
                  .delete();

                alert("Document successfully updated!");
                this.$refs["my-modal"].hide();
                this.items = [];
                this.fillTable("criminal");
              })
              .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });
          })
          .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    },
    setupFirebase() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          //user signed in.
          this.loggedIn = true;
        } else {
          // no user is signed in
          this.loggedIn = false;
        }
      });
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({ name: "login" });
        });
    },
    uploadImage(e) {
      if (e.target.files[0]) {
        this.loadingData = true;
        let file = e.target.files[0];
        var storageRef = firebase
          .storage()
          .ref("userProfilePic/" + this.userID + "_" + file.name);
        let uploadTask = storageRef.put(file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.userData.avatar = downloadURL;
              const res = this.userRef
                .update({
                  avatar: this.userData.avatar,
                })
                .then(() => {
                  this.loadingData = false;
                })
                .catch((error) => {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
                });
            });
          }
        );
      }
    },
    fillTable(key) {
      this.loadingPage = true;
      const criminalInfoIDs = db
        .collection("userCriminalInfo")
        .doc(this.userID);
      criminalInfoIDs
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data().criminalsID;
            console.log(data.length);
            let criminalInfo;
            for (let index = 0; index < data.length; index++) {
              if (key === "criminal")
                criminalInfo = db.collection("criminalInfo").doc(data[index]);
              else
                criminalInfo = db.collection("lostPersondata").doc(data[index]);
              criminalInfo
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    let data = doc.data();
                    let id = doc.id;
                    let schemeItems = {
                      nombre: data.nombre,
                      descripcion: data.descripcion,
                      fecha: data.fecha,
                      hora: data.hora,
                      estatus: data.estatus,
                      referencia: data.referencia,
                      id: id,
                    };
                    if (key === "criminal") this.items.push(schemeItems);
                    else this.itemsLostPerson.push(schemeItems);
                    //will get the state  of the criminal en added to our chart
                    switch (doc.data().estatus) {
                      case "sin detenidos":
                        this.tempSinDetenidos++;
                        this.chart.sinDetenidos = this.tempSinDetenidos;
                        break;
                      case "en proceso":
                        this.indexEnProceso++;
                        this.chart.enProceso = this.indexEnProceso;
                        break;
                      case "en carcel":
                        this.indexEnCarcel++;
                        this.chart.enCarcel = this.indexEnCarcel;
                        break;
                      default:
                        break;
                    }
                  }
                })
                .catch((error) => {
                  console.log("Error getting document:", error);
                });
            }
            this.loadingPage = false;
            this.isBusy = false;
          } else {
            this.loadingPage = false;
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import "@/scss/user.scss";

@media screen and (max-width: 759px) {
  #card {
    position: absolute;
    margin-top: -55%;
    margin-left: 18%;
    z-index: 100;
  }

  #logOut {
    position: absolute;
    top: 98%;
    right: 0px;
    width: 100%;
    z-index: 100;
    padding-bottom: 5%;
  }
}
</style>
