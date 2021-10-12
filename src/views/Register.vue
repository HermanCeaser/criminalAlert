<template>
  <div id="register" class="">
    <div id="gradientBackground" class="gradient-custom"></div>
    <div class="">
      <b-row>
        <b-col></b-col>
        <b-col md="5">
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
                      <b-form-group
                        id="fieldset-2"
                        label="Confirmar contraseña"
                        label-for="input-1"
                        valid-feedback="Thank you!"
                        :invalid-feedback="invalidConfirmPassFeedback"
                      >
                        <b-form-input
                          id="input-1"
                          type="password"
                          v-model="formData.confirmPassword"
                          :state="stateConfrimPassword"
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
                        >Registrar</b-button
                      >
                    </b-col>
                  </b-row>
                </b-form>
                <br />
                <b-row>
                  <b-col> <p>¿Tienes cuenta?</p> </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <router-link to="/login">Ingresa</router-link>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </div>
        </b-col>
        <b-col></b-col>
      </b-row>
      <div>
        <b-modal
          ref="my-modal"
          hide-footer
          id="modal-center"
          centered
          title="Confirmacion"
        >
          <div class="d-block text-center">
            <h4>
              <p>
                Se ha enviado un correo, por favor revise su bandeja de entrada
                para validar
              </p>
            </h4>
          </div>
          <b-button
            class="mt-3"
            variant="outline-primary"
            block
            @click="mesajeVerificacion"
            >Continuar</b-button
          >
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
import Regiser from "../js/register.js";
require("firebase/auth");
export default {
  name: "register",
  mixins: [Regiser],
  data: () => ({
    showDismissibleAlert: false,
    alertMsm: null,
    dismissSecs: 5,
    formData: {
      correo: "",
      password: "",
      confirmPassword: "",
    },
  }),
  computed: {
    stateEmail() {
      return this.validEmail(this.formData.correo);
    },
    statePassword() {
      return this.formData.password.length >= 8;
    },
    stateConfrimPassword() {
      return (
        this.formData.password === this.formData.confirmPassword &&
        this.formData.password >= 8
      );
    },
    invalidPassFeedback() {
      if (this.formData.password.length > 0) {
        return "Por favor ingrese contraseña mínima 8 caracteres";
      }
      return "Por favor ingrese  una contraseña de 8 caracteres";
    },
    invalidConfirmPassFeedback() {
      return "Por favor ingrese  la misma contraseña";
    },

    invalidFeedbackEmail() {
      if (this.formData.correo > 0) {
        return "";
      }
      return "Por favor ingrese  un correo ejemplo: correo@gmail.com";
    },
  },
  methods: {
    pressed: async function () {
      if (!this.formData.correo || !this.formData.password) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm = "¡Debe ingresar correo y contraseña para continuar!";
        return;
      } else if (this.formData.password !== this.formData.confirmPassword) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm = "Las dos contraseñas deben coincidir ";
        return;
      } else if (!this.validEmail(this.formData.correo)) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm = "Ingrese un correo válido";
        return;
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.formData.correo,
          this.formData.password
        )
        .then(() => {
          this.$refs["my-modal"].show();
          let user = firebase.auth().currentUser;
          user
            .sendEmailVerification()
            .then(() => {})
            .catch((error) => (this.error = error));
        })
        .catch((error) => {
          this.error = error;
          this.emailAlreadyUseMsm();
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import "@/scss/credentialsPages.scss";
</style>