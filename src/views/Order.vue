<template>
  <div data-app>
    <v-stepper flat value="2">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Start</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2">Auftrag</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">Arbeitsbereich</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Aktivität</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Prozess</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <div>
      <v-row>
        <v-col cols="5">
          <div>
            <v-card tile height="50">
              <v-select solo flat
                :items="items"
                item-text="BusinessId"
                item-value="BusinessId"
                label="Auftrag auswählen..." 
              ></v-select>
            </v-card>
              
            
          </div>
        </v-col>
        <v-col cols="7">
          <div>
            <v-card tile dark color="#283593" height="320">
              
              <StreamBarcodeReader
                @decode="onDecode"
              ></StreamBarcodeReader>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="160">mdi-qrcode</v-icon>
                  <v-card-title class="headline"></v-card-title>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
  <v-row>
    <v-col class="btn-outter-left" cols="6">
      <v-btn tile to="/"><v-icon dark>mdi-arrow-left-thick</v-icon></v-btn>
    </v-col>

    <v-col class="btn-outter-right" cols="6">
      <v-btn tile to="/selectionScope/1"><v-icon dark>mdi-arrow-right-thick</v-icon></v-btn>
    </v-col>
  </v-row>
  </div>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
export default {
  components: {StreamBarcodeReader},
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
    },
    onDecode (decodedString) {
      // alert("detected", decodedString)
      console.log("detected", decodedString);
      this.$router.push('/selectionScope/' + decodedString)
    },
  },
  beforeMount() {
    this.getOrders();
  }
};
</script>

<style scoped>
.btn-outter-left {
  height: 50px;
  position: absolute;
  text-align: left;
  bottom: 5%;
  left: 5%;
}

.btn-outter-right {
  height: 50px;
  position: absolute;
  text-align: right;
  bottom: 5%;
  right: 5%;
}
</style>