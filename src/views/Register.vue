<template>
  <div id="register" class="">
    <div id="gradientBackground" class="gradient-custom"></div>
    <div class="">
      <b-row>
        <b-col></b-col>
        <b-col md="4">
          <div class="regCard">
            <b-card id="cardID" class="shadow p-3 mb-5 bg-white rounded">
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
                  <h1>Registro</h1>
                </b-card-text>
                <b-form @submit.prevent="pressed">
                  <b-row>
                    <b-col>
                      <b-form-group
                        id="fieldset-1"
                        label="Ingrese su correo electronico"
                        label-for="input-1"
                        valid-feedback="Thank you!"
                        :invalid-feedback="invalidFeedbackEmail"
                      >
                        <b-form-input
                          id="input-1"
                          type="email"
                          v-model="formData.correo"
                          :state="stateEmail"
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
                        :invalid-feedback="invalidPassFeedback"
                      >
                        <b-form-input
                          id="input-1"
                          type="password"
                          v-model="formData.password"
                          :state="statePassword"
                          trim
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-button
                        class="colorBotton"
                        type="submit"
                        block
                        variant="danger"
                        >Guardar</b-button
                      >
                    </b-col>
                  </b-row>
                </b-form>
                <br />
                <b-row>
                  <b-col> <p>tienes cuenta?</p> </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <router-link to="/login">ingresa</router-link>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </div>
        </b-col>
        <b-col></b-col>
      </b-row>
    </div>
  </div>
</template>



<script>
import firebase from "firebase";
import { db } from "../main";
require("firebase/auth");

export default {
  name: "register",
  data: () => ({
    showDismissibleAlert: false,
    alertMsm: null,
    dismissSecs: 5,
    formData: {
      correo: "",
      password: "",
    },
  }),
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
        this.alertMsm = "Debe ingresar correo  y contraseña para continuar!";
        return;
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.formData.correo,
          this.formData.password
        )
        .then(() => {
          this.$router.replace({ name: "user" });
          let user = firebase.auth().currentUser;
          user
            .sendEmailVerification()
            .then(() => {})
            .catch((error) => (this.error = error));
        })
        .catch((error) => (this.error = error));
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");

h1 {
  color: #ec407a;
  font-family: "Roboto", sans-serif;
}

#fieldset-1,
#fieldset-2 {
  color: #ec407a;
  font-family: "Roboto", sans-serif;
  text-align: left;
}

.colorBotton {
  background-color: #ec407a;
}

.colorBotton:hover {
  background-color: #ce1a56;
}

.regCard {
  margin-top: -25%;
}

p {
  color: #ff99bb;
}

#register {
  overflow: hidden;
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
</style>