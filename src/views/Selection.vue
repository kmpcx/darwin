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
    <h1>Selection</h1>
    <v-card max-width="100%" class="mx-auto">
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="4">
            <v-card :color="item.color" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline" v-text="item.title"></v-card-title>

                  <v-card-subtitle v-text="item.subtitle"></v-card-subtitle>
                </div>

                <v-avatar class="ma-4" size="125" tile>
                  <v-img :src="item.src"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        color: "#1F7087",
        src:
          "https://madewithvuejs.com/mandant/madewithvuejs/images/logo-vuetify.png",
        title: "Arbeitsbereich 1",
        subtitle: "Informationen zum Arbeitsbereich."
      },
      {
        color: "#1F7087",
        src:
          "https://madewithvuejs.com/mandant/madewithvuejs/images/logo-vuetify.png",
        title: "Arbeitsbereich 2",
        subtitle: "Informationen zum Arbeitsbereich."
      },
      {
        color: "#1F7087",
        src:
          "https://madewithvuejs.com/mandant/madewithvuejs/images/logo-vuetify.png",
        title: "Arbeitsbereich 3",
        subtitle: "Informationen zum Arbeitsbereich."
      },
      {
        color: "#1F7087",
        src:
          "https://madewithvuejs.com/mandant/madewithvuejs/images/logo-vuetify.png",
        title: "Arbeitsbereich 3",
        subtitle: "Informationen zum Arbeitsbereich."
      }
    ]
  })
};
</script>