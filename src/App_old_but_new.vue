<template>
 <div id="app">
    <v-app-bar color="deep-purple accent-4" dark>

      <v-toolbar-title>DARWIN</v-toolbar-title>

      <v-spacer></v-spacer>

      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <span v-if="isLoggedIn"> <a @click="logout">Logout</a></span>
        <span v-else> <router-link to="/login">Login</router-link> </span>
      </div>

      <v-btn icon>
        <v-icon>mdi-account-check-outline</v-icon>
      </v-btn>

    </v-app-bar>
    
        
      
    
    <router-view/>
  </div>
</template>

<script>
  export default {
    computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      },
    },
   created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout)
        }
        throw err;
      });
    });
  } 
  }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #FFFFFF;

    &.router-link-exact-active {
      color: #FFFFFF;
    }
  }
}
</style>