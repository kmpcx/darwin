<template>
  <div id="app">
    <v-system-bar color="red lighten-2">
      <v-icon>mdi-arrow-collapse-all</v-icon>
      <span>DARWIN</span>
      <v-spacer></v-spacer>
      <span v-if="isLoggedIn"> <a @click="logout">Logout for UserId: {{getUserId}}</a></span>
      <span v-else> <router-link to="/login"></router-link></span>
    </v-system-bar>
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
    },
  },
  data() {
    return {
      open: false
    };
  }
};
</script>
