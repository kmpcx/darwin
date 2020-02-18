<template>
  <div id="app">
    <v-app-bar color="blue darken-3" dense dark>
      <v-toolbar-title>DARWIN</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            {{username}}
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title><a @click="logout">Logout</a></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import Vue from 'vue';
import VueMoment from 'vue-moment';

Vue.use(VueMoment);

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    authStatus : function(){ return this.$store.getters.authStatus},
    getUserId : function(){ return this.$store.getters.getUserId}
  },
  methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
        this.$router.push('/login')
      })
    }
  },
  beforeMount() {
      this.username = this.$store.getters.getUsername
  },
  data() {
    return {
      open: false,
      username: 'Te'
    };
  }
};
</script>
