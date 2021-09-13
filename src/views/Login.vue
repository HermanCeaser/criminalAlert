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
                <h1>Iniciar sesion</h1>
              </b-card-text>
              <b-form @submit.prevent="pressed">
                <b-row>
                  <b-col>
                    <b-form-group
                      id="fieldset-1"
                      label="Correo electronico "
                      label-for="input-1"
                      valid-feedback="Thank you!"
                    >
                      <b-form-input
                        id="input-1"
                        type="email"
                        v-model="formData.correo"
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
                    Olvidaste
                    <router-link class="routerClass" to="/resetCredentials"
                      >contreaseña?</router-link
                    >
                  </p>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <router-link to="/register">Registrate</router-link>
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
    formData: {
      correo: "",
      password: "",
    },
  }),
  beforeMount() {
    this.showDismissibleAlert = this.dismissSecs;
    this.alertMsm =
      "Para poder reportar criminales o ingresar a usuario, tienes que estar registrado";
  },
  computed: {
    stateEmail() {
      return this.formData.correo.length >= 4;
    },
    statePassword() {
      return this.formData.password.length >= 8;
    },
    invalidPassFeedback() {
      if (this.formData.password.length > 0) {
        return "Porfavor ingrese contraseña minimo 8 caracteres";
      }
      return "Porfavor ingrese  una conttraseña";
    },
    invalidFeedbackEmail() {
      if (this.formData.correo.length > 0) {
        return "";
      }
      return "Porfavor ingrese  un correo ejemplo: flores@gmail.com";
    },
  },
  methods: {
    pressed: async function () {
      if (!this.formData.correo || !this.formData.password) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm = "Debe ingresar usuario  y contraseña para continuar!";
        return;
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.formData.correo,
          this.formData.password
        )
        .then((data) => {
          const user = firebase.auth().currentUser.emailVerified;
          if (!user) {
            this.showDismissibleAlert = this.dismissSecs;
            this.alertMsm =
              "Su correo aún no ha sido verificado, por favor revise su bandeja de entrada";
          } else {
            this.$router.replace({ name: "user" });
          }
        })
        .catch((error) => {
          this.showDismissibleAlert = this.dismissSecs;
          this.error = error;
          this.alertMsm = "usuario o contraseña incorrectos!";
        });
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