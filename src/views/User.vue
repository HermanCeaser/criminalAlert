<template>
  <div id="user">
    <div id="gradientBackground" class="gradient-custom"></div>
    <div id="userInfoTop">
      <b-row>
        <b-col md="1"></b-col>
        <b-col md="2">
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
                  v-model="userData.nick"
                  type="email"
                  class="card-input"
                  placeholder="Ingrese su nick"
                />
              </div>
              <div class="card-fields">
                <h2 v-show="!isEditing" class="card-email">
                  {{ userData.correo }}
                </h2>
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
        </b-col>
        <b-col md="8">
          <b-row>
            <b-table
              class="tableCriminals"
              :items="items"
              :busy="isBusy"
              hover
              outlined
              responsive
            >
              <template #table-busy>
                <div class="text-left text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>
            </b-table>
          </b-row>
        </b-col>
        <b-col md="1"></b-col>
      </b-row>
      <b-row>
        <b-col></b-col>
        <b-col></b-col>
        <b-col>
          <b-card>
            <b-icon
              icon="exclamation-circle-fill"
              variant="warning"
              font-scale="4"
            ></b-icon>
            <b-card-text>
              <p>Registros criminales en proceso {{ chart.enProceso }}</p>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col>
          <b-card>
            <b-icon
              icon="exclamation-circle-fill"
              variant="danger"
              font-scale="4"
            ></b-icon>
            <b-card-text>
              <p>Registros criminales sin detenidos {{ chart.sinDetenidos }}</p>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col>
          <b-card>
            <b-icon
              icon="exclamation-circle-fill"
              variant="success"
              font-scale="4"
            ></b-icon>
            <b-card-text>
              <p>Registros criminales detenidos {{ chart.enCarcel }}</p>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col></b-col>
        <b-col></b-col>
      </b-row>
    </div>
    <div id="logOut">
      <b-button @click="signOut" variant="info">Sign out</b-button>
    </div>
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
    userData: {
      nick: "Nicholas",
      correo: "nicholas.cage@theone.com",
      reportes: "0",
      avatar:
        "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
    },
    items: [
      {
        nombre: "",
        descripcion: "",
        fecha: "",
        hora: "",
        estatus: "",
        referencia: "",
      },
    ],
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
      console.log("id user: " + this.userID);
      this.userRef = db.collection("user").doc(this.userID);
      this.userRef.get().then(async (docSnapshot) => {
        if (docSnapshot.exists) {
          console.log("existe!");
          this.setUserData();
        } else {
          console.log("no existe!");
          let data = {
            nick: "",
            correo: this.userTemp.email,
            avatar:
              "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
            reportes: 0,
          };
          db.collection("user").doc(this.userID).set(data);
          this.userRef = db.collection("user").doc(this.userID);
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
            console.log("Document exist!");
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
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
        const res = this.userRef
          .update({
            nick: this.userData.nick,
          })
          .then(() => {
            alert("Document successfully updated!");
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
            console.log("Document exist para la tabla! ");
            let data = doc.data().criminalsID;

            for (let index = 0; index < data.length; index++) {
              const criminalInfo = db
                .collection("criminalInfo")
                .doc(data[index]);
              criminalInfo
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    console.log("Document exist!");
                    let data = doc.data();
                    this.items.push(data);
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
                  } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                  }
                })
                .catch((error) => {
                  console.log("Error getting document:", error);
                });
            }
            this.isBusy = false;
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
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

#logOut{
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
