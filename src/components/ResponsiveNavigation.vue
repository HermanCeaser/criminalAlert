<template>
  <nav>
    <b-row>
      <b-col>
        <ul ref="nav">
          <figure class="image-logo" @click="toggleNav">
            <img :src="imagePath" height="43px" width="40px" />
          </figure>

          <li v-for="(link, index) in navLinks" :key="index">
            <router-link
              :to="link.path"
              :style="{ color: linkColor || '#DDD' }"
            >
              {{ link.text }}
              <i :class="link.icon" />
            </router-link>
          </li>
        </ul>
      </b-col>
      <b-col>
        <div class="title">
          <h1>CriminalAlert</h1>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
  </nav>
</template>

<script>
export default {
  props: ["navLinks", "linkColor", "hoverBackground", "imagePath"],
  methods: {
    toggleNav() {
      const nav = this.$refs.nav.classList;
      nav.contains("active") ? nav.remove("active") : nav.add("active");
    },
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");

nav {
  height: 60px;
  width: 100%;
  position: fixed;
  z-index: 999;
  /* fallback for old browsers */
  background: #37ecba;
  font-family: "Roboto", sans-serif;

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

  ul {
    display: flex;
    height: 100%;
    align-items: center;
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;

    z-index: 999;
    figure {
      cursor: pointer;
      margin-right: 10px;
    }

    a {
      text-decoration: none;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }

    i {
      margin-right: 10px;
      font-size: 22px;
    }

    li {
      list-style-type: none;
      padding: 10px 20px;
      transition: 0.3s;
      :hover {
        background: rgb(255, 255, 255, 0.3);
        color: rgb(236, 83, 109);
      }
    }
  }
}

.title {
  color: aliceblue;
  padding-top: 5px;
  font-family: "Roboto", sans-serif;
  display: none;
}



@media screen and (max-width: 759px) {
  nav {
    z-index: 999;
    /* fallback for old browsers */
    background: rgba(114, 175, 211, 1);

    ul {
      position: absolute;
      width: 250px;
      height: 1470px;
      flex-direction: column;
      left: -250px;
      transition: 300ms ease all;
      top: 60px;
      background: rgba(114, 175, 211, 1);
      &.active {
        left: 0px;
      }

      figure {
        position: fixed;
        z-index: 1;
        top: 10px;
        left: 5px;
      }

      li {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
        :hover {
          background: rgb(255, 255, 255, 0.4);
        }
      }

      a {
        flex-direction: row;
        margin-left: 20px;
        justify-content: space-between;
        margin-right: 13px;
      }
    }
  }

  .title {
    color: aliceblue;
    padding-top: 5px;
    font-family: "Roboto", sans-serif;
    display: inline;
  }
}
</style>
