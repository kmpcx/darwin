<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step color="blue darken-3" step="L">Login</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card tile>
      <v-card-title class="headline">Login</v-card-title>
        <v-row>
          <v-col cols="12">
            <v-form @submit.prevent="login">
              <v-container>
                <v-row>
                  <v-col cols="12" md="5">
                    <v-text-field v-model="username" label="Benutzername" required type="text"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="password"
                      label="Passwort"
                      required
                      type="password"
                      placeholder="Passwort"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <button type="submit">Login</button>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-col>
        </v-row>
    </v-card>
    <br />
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
.btn-outter-left {
  position: relative;
  padding-right: 350px;
  padding-top: 200px;
}

.btn-outter-right {
  position: relative;
  padding-left: 350px;
  padding-top: 200px;
}
</style>