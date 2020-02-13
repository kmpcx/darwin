<template>
  <div data-app>
    <v-stepper value="5">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Start</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2" complete>Auftrag</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3" complete>Veredelungsart</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4" complete>Aktivität</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#F44336" step="5">Prozess</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card tile>
      <v-card-title class="headline">Informationen zum Auftrag: {{order.BusinessId}}</v-card-title>

      <v-card-subtitle class="order-info">
        <v-row>
          <v-col cols="4">
            Name: {{order.Name}}
            <br />
            Kunde: {{order.Customer}}
            <br />
            Gesamtlaufzeit: 05:32 h
          </v-col>
          <v-col cols="8">
            Notiz: {{order.Note}}
            <br />
            Abgeschlossene Aktivitäten: Patchen / Patchen / Nähen</v-col>
        </v-row>
      </v-card-subtitle>
    </v-card>
    <br />

    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <v-card tile>
              <v-row>
                <v-col cols="6">
                  <v-card-title class="headline">Start-Parameter</v-card-title>

                  <v-card-subtitle class="order-info">
                    <p>Anzahl Farben: 3</p>
                    <p>Status Freigabe: Fertig vorhanden</p>
                    <p>Größe Logo: 3 x 10 cm</p>
                  </v-card-subtitle>
                </v-col>

                <v-col cols="6">
                  <v-card-title class="headline">End-Parameter</v-card-title>

                  <v-card-subtitle class="order-info">
                    <p>Menge: 500</p>
                    <p>Ausschuss: 5</p>
                  </v-card-subtitle>
                </v-col>
              </v-row>

              <v-card-title class="headline">Auftrag beendet / abgebrochen</v-card-title>

              <v-card-subtitle class="order-info">
                <v-row>
                  <v-col cols="6">
                    <p>Start: 01.01.2020 13:00</p>
                    <p>Stop: 01.01.2020 13:37</p>
                    <p>Laufzeit: 00:37 h</p>
                  </v-col>
                  <v-col cols="6">
                    <p>Grund: Material fehlt</p>
                    <p>Notiz: Faden ist gerissen und keiner mehr verfügbar.</p>
                  </v-col>
                </v-row>
              </v-card-subtitle>
            </v-card>
            <br />
          </div>
        </v-col>
        <v-col cols="4">
          <v-btn
            tile
            width="120"
            height="70"
            dark
            large
            color="#8BC34A"
            :to="{ path: '/processRunning/' + $route.params.orderId + '/2/2'  }"
          >
            <v-icon dark>mdi-play</v-icon>Weiter
          </v-btn>

          <br>
          <br>

          <v-btn tile width="120" height="70" dark large color="#BDBDBD" :to="{ path: '/'  }">
            <v-icon dark>mdi-home-export-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <br />
    <v-row>
      <v-col class="btn-outter-left" cols="6">
        <v-btn tile :to="{ path: '/process/' + $route.params.orderId + '/2/2'  }">
          <v-icon dark>mdi-arrow-left-thick</v-icon>
        </v-btn>
      </v-col>
      <v-col class="btn-outter-right" cols="6"></v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: String
    },
    scopeId: {
      type: String
    }
  },
  data: () => ({
    order: {},
  }),

  methods: {
    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", { orderId: this.orderId })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    }
  },
  beforeMount() {
    this.getOrder();
  }
};
</script>

<style scoped>
.order-info {
  text-align: left;
}

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