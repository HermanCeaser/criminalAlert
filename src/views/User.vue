<template>
  <b-overlay :show="loadingPage" :opacity="1" rounded="sm">
    <div id="user">
      <div id="gradientBackground" class="gradient-custom"></div>
      <div id="userInfoTop">
        <b-row>
          <b-col md="1"></b-col>
          <b-col md="2">
            <b-row>
              <b-col>
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
                      <div class="card-fields">
                        <input
                          v-show="isEditing"
                          type="file"
                          class="card-input"
                          @change="uploadImage"
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
                    <button
                      v-on:click="editContent"
                      class="card-button card-edit"
                    >
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
            </b-row>
            <br /><br />
            <b-row>
              <b-overlay
                :show="loadingDataComment"
                rounded="sm"
                class="comments"
              >
                <b-col>
                  <b-card
                    id="criminalCard"
                    header="CriminalAlert"
                    header-tag="header"
                    footer=""
                    footer-tag="footer"
                    title="Comentarios"
                  >
                    <b-form>
                      <b-row>
                        <b-col>
                          <b-form-group
                            class="crimenStyle"
                            label="Bríndanos una breve opinión sobre tu experiencia con la pagina."
                          >
                            <b-form-textarea
                              id="textarea"
                              placeholder="opinion..."
                              rows="3"
                              v-model="comment"
                              max-rows="6"
                            ></b-form-textarea>
                          </b-form-group>
                          <b-form-group>
                            <h4>Califíquenos</h4>
                          </b-form-group>
                          <b-form-group
                            label="Proporcione una calificacion de su experiencia con la pagina"
                            v-slot="{ ariaDescribedby }"
                          >
                            <b-form-rating
                              v-model="valueRating"
                              color="rgb(64, 192, 128)"
                              :aria-describedby="ariaDescribedby"
                              class="mb-2"
                            ></b-form-rating>
                          </b-form-group>
                        </b-col>
                        <b-button
                          id="show-btn"
                          pill
                          block
                          variant="info"
                          @click="saveUserComments"
                          >guardar</b-button
                        >
                      </b-row>
                    </b-form>
                  </b-card>
                </b-col>
              </b-overlay>
            </b-row>
          </b-col>
          <b-col md="8">
            <b-row>
              <b-table
                sticky-header="400px"
                :fields="fields"
                :items="items"
                ref="selectableTable"
                selectable
                @row-selected="onRowSelected"
                hover
                fixed
                responsive
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
            <b-row>
              <b-button
                id="show-btn"
                pill
                block
                variant="info"
                v-b-modal.modal-update
                >actualizar</b-button
              >
              <b-modal
                ref="my-update"
                hide-footer
                id="modal-update"
                centered
                title="Registros seran actualizados"
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
                    <h4>Seleccione registros para actualizar</h4>
                  </div>
                </div>
                <b-button
                  class="mt-3"
                  variant="outline-danger"
                  block
                  @click="updateSelected"
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
              <b-modal
                ref="my-update-second"
                hide-footer
                id="modal-update-second"
                scrollable
                centered
                title="Registros"
              >
                <div class="d-block text-center">
                  <div v-if="formObjects.length > 0">
                    <div :key="i" v-for="(item, i) in formObjects">
                      <b-card
                        title="Reporte"
                        tag="article"
                        style="max-width: 30rem"
                        class="mb-2"
                      >
                        {{ i + 1 }}
                        <b-form>
                          <b-row>
                            <b-col>
                              <b-form-group
                                class=""
                                label="Descripción del reporte"
                              >
                                <b-form-textarea
                                  id="textarea"
                                  placeholder="describir crimen..."
                                  v-model="formObjects[i].descripcion"
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
                                  :min="minDate"
                                  :max="maxDate"
                                  class="mb-2"
                                  v-model="formObjects[i].fecha"
                                  placeholder="Ingrese una fecha"
                                ></b-form-datepicker>
                                <b-form-timepicker
                                  locale="en"
                                  placeholder="Ingrese una hora"
                                  v-model="formObjects[i].hora"
                                ></b-form-timepicker>
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col>
                              <b-form-group
                                class="estatusStyle"
                                label="Estatus del reporte"
                              >
                                <b-form-select
                                  v-model="selectedState"
                                  :options="optionState"
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
                                  v-model="formObjects[i].referencia"
                                  placeholder="link de la noticia o referencia"
                                ></b-form-input>
                              </b-form-group>
                            </b-col>
                          </b-row>
                        </b-form>
                      </b-card>
                    </div>
                  </div>
                  <div v-else>
                    <h4>Seleccione registros para actualizar</h4>
                  </div>
                  <div>
                    <b-card
                      title=""
                      tag="article"
                      style="max-width: 30rem"
                      class="mb-2"
                    >
                      <b-card-text>
                        <h3>Seguridad</h3>
                        <b-alert
                          id="alert"
                          variant="info"
                          dismissible
                          fade
                          :show="showDismissibleAlert"
                          @dismissed="showDismissibleAlert = false"
                        >
                          {{ alertMsm }}
                        </b-alert>
                      </b-card-text>
                      <b-form>
                        <b-form-group
                          id="fieldset-2"
                          label="Ingrese su correo  para poder realizar la actualizacion"
                          label-for="input-1"
                          valid-feedback="Thank you!"
                        >
                          <b-form-input
                            id="input-1"
                            type="email"
                            v-model="email"
                            placeholder="email@mail.com"
                            trim
                          ></b-form-input>
                        </b-form-group>
                      </b-form>
                      <b-button
                        class="mt-3"
                        variant="outline-danger"
                        @click="editReport"
                        block
                        >Continuar</b-button
                      >
                    </b-card>
                  </div>
                </div>
              </b-modal>
            </b-row>
            <br />
            <b-row>
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
                <b-card
                  title=""
                  tag="article"
                  style="max-width: 30rem"
                  class="mb-2"
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
                  <br />
                  <b-card-text>
                    <b-alert
                      id="alert"
                      variant="info"
                      dismissible
                      fade
                      :show="showDismissibleAlert"
                      @dismissed="showDismissibleAlert = false"
                    >
                      {{ alertMsm }}
                    </b-alert>
                  </b-card-text>
                  <b-form>
                    <b-form-group
                      id="fieldset-2"
                      label="Ingrese su correo  para poder realizar la actualizacion"
                      label-for="input-1"
                      valid-feedback="Thank you!"
                    >
                      <b-form-input
                        id="input-1"
                        type="email"
                        v-model="email"
                        placeholder="email@mail.com"
                        trim
                      ></b-form-input>
                    </b-form-group>
                  </b-form>
                  <b-button
                    class="mt-3"
                    variant="outline-danger"
                    @click="deleteSelected"
                    block
                    >Continuar</b-button
                  >
                  <b-button
                    class="mt-2"
                    variant="outline-warning"
                    block
                    @click="closeModal"
                    >Cancelar</b-button
                  >
                </b-card>
              </b-modal>
            </b-row>
            <br />
            <b-row>
              <b-col sm="4"></b-col>
              <b-col sm="5">
                <b-card no-body class="overflow-hidden card_link" hover>
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img
                        src="https://picsum.photos/400/400/?image=20"
                        alt="Image"
                        class="rounded-0"
                      ></b-card-img>
                    </b-col>
                    <b-col md="6">
                      <b-card-body title="Criminal Alert">
                        <b-card-text>
                          Descarga nuestra web App, para dispositivos móviles
                          Android o IPhone.
                          <b-link
                            href="https://gonative.io/share/onyzqw"
                            target="_blank"
                            >Link</b-link
                          >
                        </b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
              <b-col sm="3"></b-col>
            </b-row>
          </b-col>
          <b-col> </b-col>
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
        Se ha actualizado su información de usuario
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
    email: "",
    showDismissibleAlert: false,
    alertMsm: null,
    isShelfOpen: false,
    isEditing: false,
    selectedFile: "",
    userID: null,
    userRef: null,
    userTemp: null,
    isBusy: true,
    showTop: false,
    toastId: "-1",
    loadingDataComment: false,
    verificationMsm: "",
    loadingData: false,
    loadingPage: false,
    formObjects: [],
    dismissSecs: 5,
    valueRating: 0,
    comment: "",
    formData: {
      descripcion: "",
      fecha: "",
      hora: "",
      selected: "",
      referencia: "",
    },
    userData: {
      nick: "",
      correo: "nicholas.cage@theone.com",
      reportes: "0",
      avatar:
        "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-hand-drawn-modern-vector-id1273297997?b=1&k=6&m=1273297997&s=612x612&w=0&h=W0mwZseX1YEUPH8BJ9ra2Y-VeaUOi0nSLfQJWExiLsQ=",
    },
    fields: ["Selected", "descripcion", "fecha", "hora", "estatus"],
    items: [
      {
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
        descripcion: "",
        fecha: "",
        hora: "",
        estatus: "",
        referencia: "",
        id: "",
      },
    ],
    selected: [],
    selectedUpdate: [
      {
        descripcion: "",
        fecha: "",
        hora: "",
        estatus: "",
        referencia: "",
        id: "",
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
    minDate: new Date("January 01, 2021 00:00:00"),
    maxDate: new Date("December 31, 2021 11:59:59"),
    selectedState: null,
    optionState: [
      { value: null, text: "Seleccione una opcion" },
      { value: "sin detenidos", text: "sin detenidos" },
      { value: "en proceso", text: "en proceso" },
      { value: "en carcel", text: "en carcel" },
    ],
    selectedStar: [], // Must be an array reference!
    optionsStar: [
      { text: "★", value: "1" },
      { text: "★", value: "2" },
      { text: "★", value: "3" },
      { text: "★", value: "4" },
    ],
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

    closeModal() {
      this.$refs["my-modal"].hide();
      this.$refs["my-update"].hide();

      for (let index = 0; index < this.selected.length; index++) {
        console.log(this.selected[index]);
      }
    },
    updateSelected() {
      if (this.selected.length <= 0) {
        this.$refs["my-modal"].hide();
        this.$refs["my-update"].hide();
        return;
      }
      this.formObjects = [];
      for (let index = 0; index < this.selected.length; index++) {
        this.formObjects.push(this.selected[index]);
      }

      console.log(this.formObjects);
      this.showUpdateModal();
    },
    showUpdateModal() {
      this.$refs["my-update"].hide();
      this.$refs["my-update-second"].show();
    },
    deleteSelected() {
      if (this.selected.length <= 0) {
        this.$refs["my-modal"].hide();
        this.$refs["my-update"].hide();
        return;
      }

      if (this.verifyCorrectInputData()) return;
      if (!this.verifyEmail()) return;

      let ids = [];
      for (let index = 0; index < this.selected.length; index++) {
        ids[index] = this.selected[index].id;
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
    editReport() {
      if (this.verifyCorrectInputData()) return;
      if (!this.verifyEmail()) return;

      if (this.formObjects.length > 0) {
        for (let index = 0; index < this.formObjects.length; index++) {
          let criminalInfo = db
            .collection("criminalInfo")
            .doc(this.formObjects[index].id)
            .update({
              descripcion: this.formObjects[index].descripcion,
              fecha: this.formObjects[index].fecha,
              hora: this.formObjects[index].hora,
              estatus: this.formObjects[index].estatus,
              referencia: this.formObjects[index].referencia,
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
      }

      this.$refs["my-update-second"].hide();
      return;
    },
    verifyCorrectInputData: function () {
      if (!this.email) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm = "¡Debe ingresar su correo para continuar!";
        return true;
      }
      return false;
    },
    verifyEmail: function () {
      if (this.email.localeCompare(this.userTemp.email) == 0) {
        return true;
      }
      this.showDismissibleAlert = this.dismissSecs;
      this.alertMsm = "¡Su correo no concuerda con nuestros registros!";
      return false;
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
        })
        .catch((error) => {
          console.error("Error loggin out: ", error);
        });
    },
    uploadImage(e) {
      if (e.target.files[0]) {
        this.loadingData = true;
        let file = e.target.files[0];
        if (!this.validateImage(file)) {
          this.loadingData = false;
          return;
        }

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
    validateImage(file) {
      let formData = new FormData();
      formData.append("Filedata", file);

      let t = file.type.split("/").pop().toLowerCase();
      if (t != "jpeg" && t != "jpg" && t != "png" && t != "bmp" && t != "gif") {
        alert("Por favor escoja una imagen valida");
        return false;
      }
      return true;
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
                    if (index == 0) {
                      this.setDataTable(index, schemeItems);
                    } else {
                      if (key === "criminal") this.items.push(schemeItems);
                      else this.itemsLostPerson.push(schemeItems);
                    }
                    //will get the state  of the criminal en added to our chart
                    this.setCriminalStatus(doc.data().estatus);
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

    setCriminalStatus: function (estatus) {
      switch (estatus) {
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
          console.log("estatus no encotrado");
          break;
      }
    },
    setDataTable: function (index, schemeItems) {
      this.items[index].nombre = schemeItems.nombre;
      this.items[index].descripcion = schemeItems.descripcion;
      this.items[index].fecha = schemeItems.fecha;
      this.items[index].hora = schemeItems.hora;
      this.items[index].estatus = schemeItems.estatus;
      this.items[index].referencia = schemeItems.referencia;
      this.items[index].id = schemeItems.id;
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import "@/scss/user.scss";

@media screen and (max-width: 759px) {
  #card {
    position: absolute;
    margin-top: -50%;
    margin-left: 20%;
    z-index: 100;
  }
  .comments {
    position: absolute;
    margin-top: -5%;
    margin-left: 20%;
    z-index: 100;
    padding-bottom: 10px;
  }

  .card_link {
    max-width: 550px;
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
