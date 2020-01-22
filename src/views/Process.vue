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

        <v-stepper-step color="#283593" step="5">Prozess</v-stepper-step>
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

    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <br>
            <v-card tile>
              <v-card-title class="headline">Start-Parameter</v-card-title>
              <v-card-subtitle v-for="(item, i) in parameters" :key="i" class="order-info">
                <v-radio-group row> {{item.name}}
                  <v-radio v-for="(value, j) in item.values" :key="j" :label="value.name" :value="value.value"></v-radio>
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
            color="#8BC34A"
            :to="{ path: '/processRunning/' + $route.params.orderId + '/2/2'  }"
          >
            <v-icon dark>mdi-play</v-icon>Start
          </v-btn>
          <br />
        </v-col>
      </v-row>
    </div>

    <br />
    <v-row>
      <v-col class="btn-outter-left" cols="6">
        <v-btn tile :to="{ path: '/selectionTask/1/' + $route.params.orderId }">
          <v-icon dark>mdi-arrow-left-thick</v-icon>
        </v-btn>
      </v-col>
      <v-col class="btn-outter-right" cols="6">
        <v-btn tile :to="{ path: '/processRunning/' + $route.params.orderId + '/2/2'  }">
          <v-icon dark>mdi-arrow-right-thick</v-icon>
        </v-btn>
      </v-col>
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
    }
  },
  data: () => ({
    items: [],
    parameters: [],
    order: {}
  }),

  methods: {
    getOrder() {
      let self = this;
      this.axios
        .post("http://localhost:3000/order/get", { orderId: this.orderId })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    },
    getParameters() {
    let self = this;
    this.axios
        .post("http://localhost:3000/task/getAttributes", { taskId: this.taskId , isStart: true, isEnd: false})
        .then(function(response) {
          self.parameters = response.data;
        })
        .catch(function(error) {
          if(error.response.status !== 404){
            alert("Error: " + error);
          }         
        });
    }
  },
  beforeMount() {
    this.getOrder();
    this.getParameters();
  }
};
</script>

<style scoped>
.order-info {
  text-align: left;
}

.checkboxes {
  padding-left: 2%;
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