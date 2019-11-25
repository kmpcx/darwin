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
        <v-col cols="6">
          <div>
            <v-card tile>
              <v-select
                :items="items"
                item-text="BusinessId"
                item-value="BusinessId"
                label="Select Order"
              ></v-select>
            </v-card>
          </div>
        </v-col>
        <v-col cols="6">
          <div>
            <v-card dark color="#009688" height="220">
              <v-quagga
                :onDetected="logIt"
                :readerSize="{
        width: 320,
        height: 240
      }"
                :readerTypes="['ean_reader']"
              ></v-quagga>
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
import Vue from "vue";
import VueQuagga from "vue-quaggajs";
// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  data: () => ({
    items: []
  }),
  qrData() {
    return {
      readerSize: {
        width: 32,
        height: 24
      },
      detecteds: []
    };
  },

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
    },
    logIt(qrData) {
      console.log("detected", qrData);
    }
  },
  beforeMount() {
    this.getOrders();
  }
};
</script>