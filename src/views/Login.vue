<template>
  <div id="login" class="">
    <div id="gradientBackground" class="gradient-custom"></div>
    <div class="warginCard">
      <b-row>
        <b-col></b-col>
        <b-col md="5">
          <b-card no-body class="sesionCard shadow p-3 mb-5 bg-white rounded">
            <b-card-body>
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
                <h1>Iniciar sesión</h1>
              </b-card-text>
              <b-form @submit.prevent="pressed">
                <b-row>
                  <b-col>
                    <b-form-group
                      id="fieldset-1"
                      label="Correo electrónico"
                      label-for="input-1"
                      valid-feedback="Thank you!"
                    >
                      <b-form-input
                        id="input-1"
                        type="email"
                        v-model="formData.correo"
                        placeholder="email@mail.com"
                        trim
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      id="fieldset-2"
                      label="Contraseña"
                      label-for="input-1"
                      valid-feedback="Thank you!"
                    >
                      <b-form-input
                        id="input-1"
                        type="password"
                        v-model="formData.password"
                        placeholder="••••••••"
                        trim
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <br />
                <b-row>
                  <b-col>
                    <b-button
                      class="colorBotton"
                      type="submit"
                      block
                      variant="danger"
                      >ingresar</b-button
                    >
                  </b-col>
                </b-row>
              </b-form>
              <br />
              <b-row>
                <b-col>
                  <p>
                    ¿Olvidaste
                    <router-link class="routerClass" to="/resetCredentials"
                      >contraseña?</router-link
                    >
                  </p>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <router-link to="/register">Registrar</router-link>
                </b-col>
              </b-row>
              <b-row><br /></b-row>
              <b-row>
                <b-col> </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col></b-col>
      </b-row>
    </div>
    <div>
      <b-modal
        ref="user-msn"
        hide-footer
        id="modal-center"
        centered
        title="Confirmacion"
      >
        <div class="d-block text-center">
          <h4>
            <p>Usuario activo, se redirigirá a pagina de usuario</p>
          </h4>
        </div>
        <b-button
          class="mt-3"
          variant="outline-primary"
          block
          @click="redirectUser"
          >Continuar</b-button
        >
      </b-modal>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
require("firebase/auth");
export default {
  name: "Login",
  data: () => ({
    showDismissibleAlert: false,
    alertMsm: null,
    dismissSecs: 5,
    userSignin: false,
    currentUser: null,
    newUer: null,
    error: "",
    formData: {
      correo: "",
      password: "",
    },
  }),
  beforeMount() {
    this.showDismissibleAlert = this.dismissSecs;
    this.alertMsm =
      "Para poder reportar criminales o ingresar a usuario, tienes que estar registrado.";
  },
  computed: {},
  methods: {
    pressed: async function () {
      if (this.verifyCorrectInputData()) return;

      this.currentUser = firebase.auth().currentUser;
      if (firebase.auth().currentUser == null) {
        this.userSignin = false;
      } else {
        this.userSignin = true;
      }

      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.formData.correo,
          this.formData.password
        )
        .then((data) => {
          this.newUer = firebase.auth().currentUser;
          const emailVerified = firebase.auth().currentUser.emailVerified;
          this.verifyUserEmailState(emailVerified);
        })
        .catch((error) => {
          this.showDismissibleAlert = this.dismissSecs;
          this.error = error;
          this.alertMsm = "¡Usuario o contraseña incorrectos!";
        });
    },
    verifyCorrectInputData: function () {
      if (!this.formData.correo || !this.formData.password) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm = "¡Debe ingresar usuario y contraseña para continuar!";
        return true;
      }
      return false;
    },
    verifyUserEmailState: function (emailVerified) {
      if (!emailVerified) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm =
          "Su correo aún no ha sido verificado, por favor revise su bandeja de entrada.";
      } else {
        if (this.userSignin) {
          if (this.currentUser.email.localeCompare(this.newUer.email) == 0){
            this.$refs["user-msn"].show();
          }else{
            this.$router.replace({ name: "user" });
          }
        } else {
          this.$router.replace({ name: "user" });
        }
      }
    },
    redirectUser: function () {
      this.$router.replace({ name: "user" });
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import "@/scss/credentialsPages.scss";
@media screen and (max-width: 770px) {
  .imgCard {
    width: 100%;
    height: auto;
    margin: auto;
    margin-top: 10px;
  }
}
</style>