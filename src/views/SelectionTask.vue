<template>
  <div>
    <v-stepper value="4">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Home</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2" complete>Order</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3" complete>Scope</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Task</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Process</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <h1>{{$route.params.scopeId}}</h1>
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
    <v-btn to="/selection">Back</v-btn>
    <v-btn to="/process">Continue</v-btn>
  </div>
</template>

<script>
export default {
  props: {
    scopeId: {
      type: String,
      default: '0'
    },
    orderId: {
      type: String,
      default: '0'
    }
  },
  data: () => ({
    items: [
      {
        color: "#1F7087",
        src:
          "https://madewithvuejs.com/mandant/madewithvuejs/images/logo-vuetify.png",
        title: 'Test',
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