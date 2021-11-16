<template>
  <div id="about">
    <div id="gradientBackground">
      <div class="gradient-custom"></div>
    </div>
    <div>
      <b-row>
        <b-col md="1"></b-col>
        <b-col md="1"></b-col>
        <b-col md="8">
          <b-card no-body class="sesionCard shadow p-3 mb-5 bg-white rounded">
            <b-card-body>
              <b-row>
                <b-col>
                  <h1>Tu opinion nos importa</h1>
                  <h3>
                    Con tu opinión nos ayudas a mejorar el servicio que
                    brindamos, cada comentario es tomado en cuenta para realizar
                    mejoras necesarias. Tomate unos minutos para dejarnos un
                    comentario desde tu página de usuario. El equipo de
                    criminalAlert te da las gracias.
                  </h3>
                </b-col>
              </b-row>
              <br /><br />
              <b-row>
                <b-col md="">
                  <div class="">
                    <div v-if="usersComments.length > 0">
                      <div :key="index" v-for="(item, index) in usersComments">
                        <b-list-group style="max-width: 100%">
                          <b-row>
                            <b-list-group-item
                              class="d-flex align-items-center userComment"
                            >
                              <b-col sm="2">
                                <b-avatar class="mr-3 avatarT">
                                  <img
                                    v-bind:src="usersComments[index].avatar"
                                    class="avatar"
                                  />
                                </b-avatar>
                              </b-col>
                              <b-col sm="2"
                                ><span class="mr-auto">
                                  <h5>{{ item.nick }}</h5>
                                </span></b-col
                              >
                              <b-col sm="7"
                                ><span class="mr-auto"
                                  ><h3>{{ item.comentario }} </h3>
                                </span></b-col
                              >
                              <b-col sm="1">
                                <b-badge class="badge">
                                  <h4>{{ item.calificación }} ★</h4>
                                </b-badge>
                              </b-col>
                            </b-list-group-item>
                          </b-row>
                        </b-list-group>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col> </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col md="1"></b-col>
        <b-col md="1"></b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { db } from "../main";
import ReportJs from "../js/reportCriminal.js";
import firebase from "firebase";
require("firebase/auth");
export default {
  name: "Comments",
  data: () => ({
    userRef: "",
    usersComments: [],
  }),
  async beforeMount() {
    const userSnap = await db.collection("user").get();
    userSnap.docs.forEach((doc) => {
      if (doc.data().comentario != null) {
        this.usersComments.push(doc.data());
      }
    });
    console.log(this.usersComments[0]);
  },
  methods: {},
};
</script>
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import "@/scss/comments.scss";
@media screen and (max-width: 759px) {
  h3 {
    font-family: "Quicksand", sans-serif;
    font-size: 1.2rem;
  }
  .userComment {
    width: 100%;
    height: 300px;
  }
}
</style>
