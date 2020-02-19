<template>
  <div data-app>
    <stepper-bar stepperValue="2">
      </stepper-bar>
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
            <v-card tile height="320">
              <StreamBarcodeReader
                @decode="onDecode"
              ></StreamBarcodeReader>
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
        .post(process.env.VUE_APP_API + "/order/getAll", {})
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