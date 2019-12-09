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

        <v-stepper-step color="#8BC34A" step="5">Prozess</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card tile>
      <v-card-title
        class="headline"
      >Prozessdaten zur laufenden Aktivität für Auftrag: {{order.BusinessId}}</v-card-title>

      <v-card-subtitle class="order-info">
        <v-row>
          <v-col cols="4">
            Name: {{order.Name}}
            <br />
            Kunde: {{order.Customer}}
          </v-col>
          <v-col cols="8">Notiz: {{order.Note}}</v-col>
        </v-row>
      </v-card-subtitle>
    </v-card>
    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <br>
            <v-card tile>
              <v-card-title class="headline">Start-Parameter</v-card-title>

              <v-card-subtitle class="order-info">
                <v-radio-group row readonly label="Anzahl Farben: ">
                  <v-radio label="S/W" value="sw"></v-radio>
                  <v-radio label="1" value="1"></v-radio>
                  <v-radio label="2" value="2"></v-radio>
                  <v-radio label="3" value="3"></v-radio>
                  <v-radio label=">3" value="3+"></v-radio>
                </v-radio-group>
                <v-radio-group row readonly label="Status Freigabe: ">
                  <v-radio label="Fertig vorhanden" value="fertig"></v-radio>
                  <v-radio label="Neu optimiert" value="neu"></v-radio>
                </v-radio-group>
                <v-radio-group row readonly label="Größe Logo: ">
                  <v-radio label="3 x 10 cm" value="3x10"></v-radio>
                  <v-radio label="28 x 5 cm" value="28x5"></v-radio>
                </v-radio-group>
              </v-card-subtitle>
            </v-card>
            <br />
          </div>
        </v-col>
        <v-col cols="4">
          <br />
          <v-btn
            tile
            width="120"
            height="70"
            dark
            large
            color="#BDBDBD"
            :to="{ path: '/processPaused/' + $route.params.orderId + '/2/2'  }"
          >
            <v-icon dark>mdi-pause</v-icon>Pause
          </v-btn>
          <br />
          <br />

          <v-dialog v-model="stopDialog" persistent max-width="450" max-height="250">
            <template v-slot:activator="{ on }">
              <v-btn tile width="120" height="70" dark large color="#F44336" v-on="on">
                <v-icon dark>mdi-stop</v-icon>Stop
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Aktivität abbrechen</v-card-title>
              <v-card-text>Aus welchem Grund soll die Aktivität abgebrochen werden?</v-card-text>
              <v-btn tile block large :to="{ path: '/processStopped/' + $route.params.orderId + '/2/2'  }">
                <v-icon dark>mdi-border-none-variant</v-icon>Material leer
              </v-btn>
              <br>
              <v-btn tile block large :to="{ path: '/processStopped/' + $route.params.orderId + '/2/2'  }">
                <v-icon dark>mdi-hotel</v-icon>Krankheit
              </v-btn>
              <br>
              <v-btn tile block large :to="{ path: '/processStopped/' + $route.params.orderId + '/2/2'  }">
                <v-icon dark>mdi-weather-night</v-icon>Feierabend
              </v-btn>
              <br>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="stopDialog = false">
                  <v-icon dark>mdi-close-circle</v-icon>Abbrechen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <br />
          <br />
          <v-dialog v-model="completeDialog" persistent max-width="450" max-height="250">
            <template v-slot:activator="{ on }">
              <v-btn tile width="120" height="70" dark large color="#8BC34A" v-on="on">
                <v-icon dark>mdi-check</v-icon>Fertig
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Aktivität fertigstellen</v-card-title>
              <v-card-text>Ist die laufende Aktivität fertiggestellt?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="completeDialog = false">
                  <v-icon dark>mdi-check</v-icon>Fertigstellen
                </v-btn>

                <v-btn color="green darken-1" text @click="completeDialog = false">
                  <v-icon dark>mdi-close-circle</v-icon>Abbrechen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
    items: [],
    colors: ["S/W", "1 Farbe", "2 Farben", "3 Farben", "Mehr als 3 Farben"],
    releaseFile: ["Fertig vorhanden", "Neu optimiert"],
    logoSize: ["3 x 10 cm", "28 x 5 cm"],
    order: {},
    completeDialog: false,
    stopDialog: false
  }),

  methods: {
    getScopes() {
      let self = this;
      this.axios
        .post("http://localhost:3000/task/getByOrderAndScope", {
          orderId: this.orderId,
          scopeId: this.scopeId
        })
        .then(function(response) {
          self.items = response.data;
        })
        .catch(function(error) {
          //alert(error);
        });
    },
    getOrder() {
      let self = this;
      this.axios
        .post("http://localhost:3000/order/get", { orderId: 2 })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + orderId);
        });
    }
  },
  beforeMount() {
    this.getScopes();
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