<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step color="blue darken-3" step="L">Login</v-stepper-step>
      </v-stepper-header>
    </v-stepper>

    <div>
      <v-row>
        <v-col cols="12">
          <div>
            <v-card tile>
              <v-card-title class="headline">Login</v-card-title>
              <v-row>
                <v-col cols="12">
                  <v-form @submit.prevent="login">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="5">
                          <v-text-field
                            v-model="username"
                            label="Benutzername"
                            required
                            type="text"
                            :rules="nameRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="password"
                            label="Passwort"
                            required
                            type="password"
                            :rules="pwRules"
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
              <v-snackbar
                v-model="alert"
                top
                right
                color="error"
                multi-line
                timeout="3000"
              >{{ alertText }}</v-snackbar>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     username: "",
  //     password: ""
  //   };
  // },
  data: () => ({
    return: { username: "", password: "" },
    alert: false,
    alertText: "Zugriff verweigert. Bitte überprüfen Sie Ihre Zugangsdaten.",
    valid: true,
    username: "",
    password: "",
    nameRules: [v => !!v || "Benutzername ist ein Pflichtfeld"],
    pwRules: [v => !!v || "Passwort ist ein Pflichtfeld"]
  }),

  methods: {
    openAlert: function(textAlert) {
      this.alert = true;
      this.alertText = textAlert;
    },
    validate() {
      this.$refs.form.validate();
    },
    login: function() {
      let username = this.username;
      let password = this.password;
      let self = this;
      this.$store
        .dispatch("login", { username, password })
        .then(() => this.$router.push("/"))
        .catch(function(error) {
          if (error.response && error.response.status === 404) {
            self.openAlert(
              "Benutzername falsch oder Benutzer nicht im System."
            );
          } else if (error.response && error.response.status === 401) {
            self.openAlert("Passwort für den Benutzer nicht korrekt.");
          }
        });
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