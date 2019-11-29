<template>
  <div data-app>
    <v-stepper value="5">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Start</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2" complete>Auftrag</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3" complete>Arbeitsbereich</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4" complete>Aktivität</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#F44336" step="5">Prozess</v-stepper-step>
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
    <br />

    <div>
      <v-row dense>
        <v-col cols="6">
          <div>
            <v-card tile height="50">
              <v-select
                solo
                flat
                :items="colors"
                item-text="text"
                item-value="value"
                label="Anzahl Farben"
              ></v-select>
            </v-card>

            <br />

            <v-card tile height="50">
              <v-select
                solo
                flat
                :items="releaseFile"
                item-text="text"
                item-value="value"
                label="Status Freigabe"
              ></v-select>
            </v-card>

            <br />

            <v-card tile height="50">
              <v-select
                solo
                flat
                :items="logoSize"
                item-text="text"
                item-value="value"
                label="Größe Logo"
              ></v-select>
            </v-card>

            <br />
          </div>
        </v-col>
        <v-col cols="6">
          <br />
          <v-btn
            tile
            width="120"
            height="70"
            round
            dark
            large
            color="#8BC34A"
            :to="{ path: '/processRunning/' + $route.params.orderId + '/2/2'  }"
          >
            <v-icon dark>mdi-play</v-icon>Start
          </v-btn>
          <br />
          <br />
          

          <v-dialog v-model="dialog" persistent max-width="450" max-height="250">
            <template v-slot:activator="{ on }">
              <v-btn tile width="120" height="70" round dark large color="#F44336" v-on="on">
            <v-icon dark>mdi-close-circle</v-icon>Abbruch
          </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Aktivität abbrechen</v-card-title>
              <v-card-text>Soll die laufende Aktivität abgebrochen oder fortgesetzt werden?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false"><v-icon dark>mdi-check</v-icon>Fortsetzen</v-btn>
                <v-btn color="green darken-1" text @click="dialog = false"><v-icon dark>mdi-close-circle</v-icon>Abbrechen</v-btn>
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
    dialog: false
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