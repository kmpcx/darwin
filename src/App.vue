<template>
  <div id="app">
    <component :is="layout">
      <span v-if="isLoggedIn"> <a @click="logout">Logout for UserId: {{getUserId}}</a></span>
      <span v-else> <router-link to="/login">Login</router-link></span>
      <router-view/>
    </component>
  </div>
</template>

<script>
const default_layout = "default";
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
  created() {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout)
        }
        throw err;
      });
    });
    console.log(this.$route, this.$route.meta.layout);
  },
  updated() {
    // something defined here whatever the this.$route.path
    console.log(this.$route, this.$route.meta.layout);
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>