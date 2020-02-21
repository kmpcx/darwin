<template>
  <div id="app">
    <v-app-bar color="blue darken-3" dense dark>
      <v-btn v-if="this.$route.path === '/'" icon tile onclick="location.reload(true)">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn v-else icon tile :to="{ path: '/'}">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title>DARWIN</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-title>{{username}}</v-toolbar-title>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-if="isAdmin > 0" href="/admin">
            <v-list-item-title>
              <a>Admin Bereich</a>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <a @click="logout">Logout</a>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import Vue from "vue";
import VueMoment from "vue-moment";

Vue.use(VueMoment);

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    authStatus: function() {
      return this.$store.getters.authStatus;
    },
    getUserId: function() {
      return this.$store.getters.getUserId;
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  },
  beforeMount() {
    this.username = this.$store.getters.getUsername;
    this.isAdmin = this.$store.getters.getIsAdmin;
  },
  data() {
    return {
      open: false,
      username: "",
      isAdmin: 0
    };
  }
};
</script>
