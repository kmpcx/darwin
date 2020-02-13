<template>
  <div>
    <v-stepper value="3">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Home</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2" complete>Order</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">Scope</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Task</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Process</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <h1>Selection</h1>
    <v-card max-width="100%" class="mx-auto">
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="4">
            <v-card :color="item.ColorBackground" dark max-height="180">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="120">{{item.Icon}}</v-icon>
                  <v-card-title class="headline" v-text="item.Name" ></v-card-title>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-btn to="/order">Back</v-btn>
    <v-btn to="/selectionTask/123/123">Continue</v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: []
  }),

  methods: {
    getScopes() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/scope/getAll", {})
        .then(function(response) {
          self.items = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    }
  },
  beforeMount() {
    this.getScopes();
  }
};
</script>