<template>
  <div data-app>
    <stepper-bar stepperValue="5">
      </stepper-bar>
    <br />
      <order-info :orderId="orderId">
      </order-info>
    <br />

    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <v-card tile>
              <v-row>
                <v-col cols="12">
                  <v-card-title class="headline">{{taskInfo.ScopeName}} - {{taskInfo.Name}}</v-card-title>
                </v-col>
                <v-col cols="6">
                  <v-card-title class="headline">Parameter</v-card-title>
                  <v-card-subtitle
                    v-for="(item, i) in orderEntryAttributes"
                    :key="i"
                    class="order-info"
                  >
                    <p>{{item.Name}}: {{item.InputValue}}</p>
                  </v-card-subtitle>
                </v-col>

                <v-col cols="6">
                  <v-card-title class="headline">Tätigkeit beendet</v-card-title>

                  <v-card-subtitle class="order-info">
                <v-row>
                  <v-col cols="12">
                    <p>Start: {{new Date(orderEntry.StartTime)}}</p>
                    <p>Ende: {{new Date(orderEntry.EndTime)}}</p>
                    <p>Laufzeit: 00:37 h</p>
                  </v-col>
                  <v-col cols="12">
                    <p>Notiz: Faden ist gerissen und keiner mehr verfügbar.</p>
                  </v-col>
                </v-row>
              </v-card-subtitle>
                </v-col>
              </v-row>           
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
            :to="{ path: '/selectionScope/' + $route.params.orderId }"
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
    },
    taskId: {
      type: String
    },
    orderEntryId: {
      type: String
    }
  },
  data: () => ({
    taskInfo: {},
    orderEntryAttributes: [],
    orderEntry: {},
  }),

  methods: {
    getTaskInfo() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getInfo", {
          taskId: this.taskId
        })
        .then(function(response) {
          self.taskInfo = response.data;
        })
        .catch(function(error) {
          if (error.response.status !== 404) {
            alert("Error: " + error);
          }
        });
    },
    getEntryAttributes() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntryAttributes", {
          orderEntryId: this.orderEntryId
        })
        .then(function(response) {
          self.orderEntryAttributes = response.data;
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    },
    getOrderEntry() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntry", {
          orderEntryId: this.orderEntryId
        })
        .then(function(response) {
          self.orderEntry = response.data;
          // self.startDate = new Date(response.data.StartTime);
          // self.endDate = new Date(response.data.StartTime);
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    },
  },
  beforeMount() {
    this.getTaskInfo();
    this.getEntryAttributes();
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