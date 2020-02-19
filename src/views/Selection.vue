<template>
  <div>
    <stepper-bar stepperValue="3">
      </stepper-bar>
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