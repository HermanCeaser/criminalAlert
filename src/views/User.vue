<template>
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
                    type="file"
                    @change="uploadImage"
                    class="card-input card-input--inline"
                    placeholder="change profile pic..."
                  />
                  <input
                    v-show="isEditing"
                    type="text"
                    v-model="userData.nick"
                    class="card-input"
                    placeholder="Ingrese su nick"
                  />
                </div>
                <div class="card-fields">
                  <input
                    v-show="isEditing"
                    v-model="userData.correo"
                    type="email"
                    class="card-input"
                    placeholder="Enter new email..."
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
                <i v-show="!isEditing" class="material-icons" aria-hidden="true"
                  >create</i
                >
                <i v-show="isEditing" class="material-icons" aria-hidden="true"
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
</template>

<script>
import firebase from "firebase";
import { db } from "../main";

require("firebase/auth");
export default {
  name: "User",
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

    this.checkUser();
    this.setupFirebase();
    this.fillTable();
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
            nick: "",
            correo: this.userTemp.email,
            avatar:
              "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
            reportes: 0,
          };
          db.collection("user").doc(this.userID).set(data);
          this.userRef = db.collection("user").doc(this.userID);
          this.showTop = true;
          this.verificationMsm =
            "Se ha enviado un correo para verificar su email, revise su bandeja de entrada para activar su cuenta.";
          this.setUserData();
        }
      });
    },
    setUserData() {
      this.userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.userData.nick = doc.data().nick;
            this.userData.correo = doc.data().correo;
            this.userData.reportes = doc.data().reportes;
            this.userData.avatar = doc.data().avatar;
            if (!this.showTop && !this.userTemp.emailVerified) {
              this.showToast();
            }
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
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
    shelfToggle() {
      this.isShelfOpen = !this.isShelfOpen;
    },
    editContent() {
      if (!this.isEditing) {
        this.isEditing = !this.isEditing;
        this.isShelfOpen = true;
      } else {
        this.isEditing = !this.isEditing;
        this.isShelfOpen = false;
        this.loadingData = true;
        const res = this.userRef
          .update({
            nick: this.userData.nick,
          })
          .then(() => {
            this.$bvToast.show("my-toast");
            this.loadingData = false;
          })
          .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    },
    uploadImage(e) {
      if (e.target.files[0]) {
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
                  alert("Document successfully updated!");
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
    fillTable() {
      const criminalInfoIDs = db
        .collection("userCriminalInfo")
        .doc(this.userID);
      criminalInfoIDs
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data().criminalsID;
            console.log(data[0]);
            for (let index = 0; index < data.length; index++) {
              let criminalInfo = db.collection("criminalInfo").doc(data[index]);
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
                    this.items.push(schemeItems);
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
            this.isBusy = false;
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    onRowSelected(items) {
      this.selected = items;
    },
    closeModal() {
      this.$refs.selectableTable.clearSelected();
      this.$refs["my-modal"].hide();
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
                //this.fillTable();
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
    showModal() {
      this.$refs["my-modal"].show();
    },
    showToast() {
      const h = this.$createElement;
      const id = this.toastId;
      const vNodesTitle = h(
        "div",
        { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] },
        [h("strong", { class: "mr-2" }, "Su correo aún no ha sido verificado!")]
      );

      // Create the custom  button
      const $closeButton = h(
        "b-button",
        {
          on: { click: () => this.sendEmail() },
        },
        [h("strong", { class: "mr-2" }, "Enviar correo de verificación")],
        "enviar"
      );
      // Create the toast
      this.$bvToast.toast([$closeButton], {
        id: id,
        title: [vNodesTitle],
        solid: true,
        variant: "danger",
      });
    },
    sendEmail() {
      this.$bvToast.hide(this.toastId);
      const h = this.$createElement;
      const vNodesMsg = h("p", { class: ["text-center", "mb-0"] }, [
        h("strong", "Correo enviado!"),
      ]);
      this.$bvToast.toast([vNodesMsg], {
        title: "Estatus",
        solid: true,
        variant: "success",
      });
      let user = firebase.auth().currentUser;
      user
        .sendEmailVerification()
        .then(() => {})
        .catch((error) => (this.error = error));
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");

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

#logOut {
  position: absolute;
  top: 60px;
  right: 150px;
}

.card {
  align-items: center;
  background: #fff;
  border-radius: 0.3em;
  border: 0.0625em solid mix(#fff, #abbaab, 20%);
  box-shadow: 0 0 1.7em 0 rgba(#abbaab, 0.55);
  display: flex;
  flex-direction: column;
  max-width: 18em;
  position: relative;
  width: 100%;
}

.tableCriminals {
  background: #fff;
  box-shadow: 0 0 1.7em 0 rgba(#abbaab, 0.55);
}

.tableCard {
  width: 700px;
}

p {
  color: #b6b6b6;
}

.card-info {
  padding: 1.2em 1em;
  position: relative;
  text-align: center;
  width: 100%;
}

.card-image {
  margin: auto;
  max-width: ((128px/16px) * 1em);
}

.card--is-edit .card-image {
  margin-bottom: 1em;
}

.card-avatar {
  display: block;
  height: 130px;
  width: 100%;
}

.card-avatar--circle {
  border-radius: 50%;
}

.card-name {
  font-size: 1.8em;
  margin-bottom: 0.2em;
}

.card-email {
  font-size: 1.2em;
  font-weight: 400;
  margin-top: 0;
}

.card-button {
  align-items: center;
  border: 0;
  cursor: pointer;
  display: flex;
  user-select: none;

  > .material-icons {
    font-size: inherit;
  }
}

.card-button[disabled] {
  cursor: stop;
  opacity: 0.6;
  pointer-events: none;
}

.card-expander {
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 0.75em 0 rgba(#abbaab, 0.55);
  bottom: 0;
  color: coral;
  font-size: 1.5em;
  left: 50%;
  padding: 0.5em;
  position: absolute;
  transform: translate3d(-50%, 50%, 0);
  transition: all 0.175s ease-in-out;

  &:hover,
  &:focus {
    box-shadow: 0 0.3em 2em 0 rgba(#abbaab, 0.75);
  }
}

.card-expander--is-open {
  background: coral;
  color: white;
  transform: translate3d(-50%, 50%, 0) rotate(-225deg);

  &:hover,
  &:focus {
    box-shadow: 0.15em -0.3em 2em 0 rgba(#abbaab, 0.75);
  }
}

.card-edit {
  background: transparent;
  border-radius: 0.2em;
  color: #bbb;
  padding: 0.25em;
  position: absolute;
  right: 0.5em;
  top: 0.5em;

  &:hover,
  &:focus {
    background: #eee;
    color: coral;
  }
}

.card-shelf {
  max-height: 0;
  overflow: auto;
  transition: all 0.175s ease-in-out;
  width: 100%;
}

.card-shelf--is-open {
  margin-top: 1em;
  max-height: inherit;
}

.card--is-edit .card-shelf--is-open {
  margin-top: 0;
}

.card-content {
  padding: 1em;
}

.card-bio {
  margin-top: 0;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
}

.card-fields {
  display: flex;
  justify-content: center;
}

.card-input {
  background: mix(#fff, #abbaab, 90%);
  border: 0.0625em solid mix(#fff, #abbaab, 30%);
  border-radius: 0.3em;
  margin: 0.25em;
  padding: 0.5em 1em;
  width: 100%;
}

.card-input--inline {
  display: inline-block;
  width: 50%;
}

.wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100vh;
  background: radial-gradient(circle, #ffffff, #abbaab);
}

#userInfoTop {
  margin-top: -10%;
}

#user {
  overflow: hidden;
}
</style>
