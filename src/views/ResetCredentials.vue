<template>
  <div id="login" class="">
    <div id="gradientBackground" class="gradient-custom"></div>
    <div class="warginCard">
      <b-row>
        <b-col></b-col>
        <b-col md="4">
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
                <h1>Olvidaste tu contraseña?</h1>
              </b-card-text>
              <b-form @submit.prevent="pressed">
                <b-row>
                  <b-col>
                    <p>
                      Por favor ingrese su correo electrónico y le enviaremos
                      información para recuperar su cuenta.
                    </p>
                  </b-col>
                </b-row>
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
                <br />
                <b-row>
                  <b-col>
                    <b-button
                      class="colorBotton"
                      type="submit"
                      block
                      variant="danger"
                      >Restablecer contraseña</b-button
                    >
                  </b-col>
                </b-row>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col></b-col>
      </b-row>
    </div>
    <b-modal
      ref="my-modal"
      hide-footer
      id="modal-center"
      centered
      title="Confirmacion"
    >
      <div>
        <h5>
          <p>
            Se ha enviado el correo exitosamente, revise su bandeja de entrada
            para continuar.
          </p>
        </h5>
      </div>
      <b-button
        class="mt-3"
        variant="outline-success"
        size="sm"
        block
        @click="continuar"
        >Continuar</b-button
      >
    </b-modal>
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
    },
  }),
  beforeMount() {},
  computed: {
    stateEmail() {
      return this.formData.correo.length >= 4;
    },
    invalidFeedbackEmail() {
      if (this.formData.correo.length > 0) {
        return "";
      }
      return "Porfavor ingrese  un correo ejemplo: mail@gmail.com";
    },
  },
  methods: {
    pressed: async function () {
      if (!this.formData.correo) {
        this.showDismissibleAlert = this.dismissSecs;
        this.alertMsm = "Debe ingresar su correo para continuar!";

        return;
      }
      firebase
        .auth()
        .sendPasswordResetEmail(this.formData.correo)
        .then(() => {
          this.showModal();
        })
        .catch((error) => {
          this.showDismissibleAlert = this.dismissSecs;
          this.error = error;
          this.alertMsm = "Correo no se encunetra registrado.";
        });
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    continuar(){
        this.$router.replace({ name: "login" });
    }
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

#routerClass {
  color: #ec407a;
}

p {
  color: #ff99bb;
}

.sesionCard {
  margin-top: -30%;
  transition: 0.3s;
}

.sesionCard:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.colorBotton {
  background-color: #ec407a;
}

.atteClass {
  color: #ec407a;
  font-family: "Roboto", sans-serif;
}

.attPclass {
  color: #ffffff;
}

.colorBotton:hover {
  background-color: #ce1a56;
}

.imgCard {
  margin-left: -30px;
  max-width: 100%;
  max-height: 100%;
}

#cardOne {
  z-index: -1;
  margin-top: 5%;
}

.warginCard {
  margin-top: 5%;
}

#login {
  overflow: hidden;
  font-family: "Roboto", sans-serif;
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

@media screen and (max-width: 770px) {
  .imgCard {
    width: 100%;
    height: auto;
    margin: auto;
    margin-top: 10px;
  }
}
</style>