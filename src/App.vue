<template>
  <div id="app">
    <ResponsiveNavigation
      id="testNav"
      :nav-links="navLinks"
      :image-path="require('./assets/criminalIcon.png')"
      link-color="#fff"
      hoverBackground="#a98274"
    />
    <router-view />
  </div>
</template>

<script>
import ResponsiveNavigation from "@/components/ResponsiveNavigation";
export default {
  components: {
    ResponsiveNavigation,
  },
  data: () => ({
    navLinks: [
      {
        text: "Mapa",
        path: "/map",
        icon: "ion-ios-navigate",
      },
      {
        text: "Reportar",
        path: "/reportCriminal",
        icon: "ion-ios-create",
      },
      {
        text: "Nosotros",
        path: "/about",
        icon: "ion-ios-people",
      },
      {
        text: "Ingresar",
        path: "/login",
        icon: "ion-md-contact",
      },
      {
        text: "usuario",
        path: "/user",
        icon: "ion-ios-walk",
      },
    ],
  }),

};
</script>

<style lang="scss">
@import "https://unpkg.com/ionicons@4.2.2/dist/css/ionicons.min.css";

figure {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 10px;
  margin-inline-end: 0;
}

body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
