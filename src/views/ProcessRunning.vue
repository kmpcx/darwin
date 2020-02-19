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
      <order-info :orderId="orderId">
      </order-info>
    <br>
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
                  <v-card-title class="headline">Statusinformationen</v-card-title>

                  <v-card-subtitle class="order-info">
                    <p>Status: in Bearbeitung</p>
                    <p>Start: {{startDate}}</p>
                    <p>
                      Laufzeit: <time-since :date="startDate">
                      <template slot-scope="int">
                        <span v-if="int.days !== 0">
                          {{int.days}}T
                        </span>
                         {{int.hours}}S {{int.minutes}}M {{int.seconds}}s
                      </template>
                      </time-since>
                    </p>
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
            <br />
          </div>
        </v-col>
        <v-col cols="4">
          <!-- <v-btn
            tile
            width="120"
            height="70"
            dark
            large
            color="#BDBDBD"
            :to="{ path: '/processPaused/' + $route.params.orderId + '/2/2'  }"
          >
            <v-icon dark>mdi-pause</v-icon>Pause
          </v-btn> -->
          <v-dialog v-model="stopDialog" persistent max-width="450" max-height="250">
            <template v-slot:activator="{ on }">
              <v-btn tile width="120" height="70" dark large color="#F44336" v-on="on">
                <v-icon dark>mdi-stop</v-icon>Pause
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
              <v-card tile>
                <v-card-title class="headline">Stop-Parameter</v-card-title>
                <p v-if="errors.length">
                  <b>Fehler:</b>
                  {{errors[0]}}
                </p>
                <p>
                  <v-card-subtitle v-for="(item, i) in parameters" :key="i" class="order-info">
                    <v-radio-group v-if="item.type === 'radio'" v-model="form.parameters[i]" row> {{item.name}}
                      <v-radio v-for="(value, j) in item.values" :key="j" :label="value.name" :value="value.value"></v-radio>
                    </v-radio-group>
                    <v-text-field v-else-if="item.type === 'int'" v-model="form.parameters[i]" :label="item.name" hide-details single-line type="number"/>
                  </v-card-subtitle>
                </p>
                <v-btn
                  tile
                  width="120"
                  height="70"
                  dark
                  large
                  color="#F44336"
                  @click="submit"
                >
                  <v-icon dark>mdi-stop</v-icon>Stop
                </v-btn>
              </v-card>
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
                <v-btn color="green darken-1" text :to="{ path: '/processStopped/' + $route.params.orderId + '/2/2'  }">
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
    },
    taskId: {
      type: String
    },
    orderEntryId: {
      type: String
    }
  },
  data: () => ({
    parameters: [],
    errors: [],
    form: {parameters: []},
    order: {},
    orderEntry: {},
    completeDialog: false,
    stopDialog: false,
    startDate: new Date()
  }),
  computed: {
  },
  methods: {
    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", { orderId: this.orderId })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + orderId);
        });
    },
    getOrderEntry() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntry", { orderEntryId: this.orderEntryId })
        .then(function(response) {
          self.orderEntry = response.data;
          self.startDate = new Date(response.data.StartTime)
          if(response.data.EndTime){
            alert('Achtung, Eintrag bereits abgeschlossen!')
          }
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    },
    getParameters() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getAttributes", { taskId: this.taskId, time: 'isEnd'})
        .then(function(response) {
          self.parameters = response.data;
        })
        .catch(function(error) {
          if(error.response.status !== 404){
            alert("Error: " + error);
          }         
        });
    },
    submit: function () {
      let self = this;
      this.errors = [];
      if (this.form.parameters.length === this.parameters.length || !this.parameters.length) {
        this.axios
          .post(process.env.VUE_APP_API + "/order/stopTask",
          { orderEntryId: this.orderEntryId, parameters: this.parameters, form: this.form, note: 'break'})
          .then(function(response) {
            self.$router.push('/processStopped/' + self.orderId + '/' + self.scopeId + '/' + self.taskId)
          })
          .catch(function(error) {
            alert("Error: " + error);         
          });
      } else {
        this.errors.push('Bitte prüfen sie die Stop-Parameter.');
      }
    }
  },
  beforeMount() {
    this.getOrder();
    this.getParameters();
    this.getOrderEntry();
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