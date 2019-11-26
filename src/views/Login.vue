<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step editable color="#283593" step="0">
          <router-link to="/login">Login</router-link>
        </v-stepper-step>

        <v-stepper-step editable color="#283593" step="1">
          <router-link to="/">Home</router-link>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable color="#283593" step="2">
          <router-link to="/order">Order</router-link>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">
          <router-link to="/selection">Selection</router-link>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable color="#283593" step="4">
          <router-link to="/process">Process</router-link>
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <h1>Login</h1>
    <v-form @submit.prevent="login">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="email"
            label="E-mail"
            required
            type="email"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="password"
            label="Passwort"
            required
            type="password"
            placeholder="Passwort"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
        <button type="submit">Login</button>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        email : "",
        password : ""
      }
    },
    methods: {
      login: function () {
        let email = this.email 
        let password = this.password
        this.$store.dispatch('login', { email, password })
       .then(() => this.$router.push('/login'))
       .catch(err => console.log(err))
      }
    }
  }
</script>