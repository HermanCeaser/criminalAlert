import Vue from 'vue'
import App from './App.vue'
import router from './router'


//bootstrap vue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

//Google Maps
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCpXRhDjJhzU-ffxgMdD9-1R8TgkkDuKPk',
  },
})

//firebase
import firebase from 'firebase'
import "firebase/auth"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyB33MGZGbLE4NT49e2VZ0Y9eQ1nQT2d-8E",
  authDomain: "criminalalertdb.firebaseapp.com",
  projectId: "criminalalertdb",
  storageBucket: "criminalalertdb.appspot.com",
  messagingSenderId: "477286683416",
  appId: "1:477286683416:web:a0e062358932a37a0e446d",
  measurementId: "G-MQY67FPPFJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const Firestore = firebase.firestore;
export const db = Firestore();

//router
Vue.config.productionTip = false

let app;

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }
});

