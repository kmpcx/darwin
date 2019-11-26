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
              <qrcode-stream @decode="onDecode"></qrcode-stream>
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
    <v-btn tile to="/">Zurück</v-btn>
    <v-btn tile to="/selectionScope/1">Weiter</v-btn>
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
    },
    onDecode (decodedString) {
      console.log("detected", decodedString);
    },
  },
  beforeMount() {
    this.getOrders();
  }
};
</script>