<template>
  <div data-app>
    <v-stepper value="2">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Home</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2">Order</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">Scope</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Task</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Process</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <v-card tile>
              <v-select :items="items" item-text="BusinessId" item-value="BusinessId" label="Select Order"></v-select>
            </v-card>
          </div>
        </v-col>
        <v-col cols="4">
          <div>
            <v-card dark color="#009688" height="220">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="160">mdi-qrcode</v-icon>
                  <v-card-title class="headline">Scan Order</v-card-title>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-btn to="/">Back</v-btn>
    <v-btn to="/selectionScope/1">Continue</v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: []
  }),

  methods: {
    getOrders() {
      let self = this;
      this.axios
        .post("http://localhost:3000/order/getAll", {})
        .then(function(response) {
          self.items = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    }
  },
  beforeMount() {
    this.getOrders();
  }
};
</script>