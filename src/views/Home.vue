<template>
  <div>
    <v-stepper value="1">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1">Start</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2">Auftrag</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">Veredelungsart</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Aktivität</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Prozess</v-stepper-step>
      </v-stepper-header>
    </v-stepper>

    <div>
      <v-row>
        <v-col cols="6">
          <div>
            <v-card tile height="220">
              <v-list dense>
                <v-header>Meine aktiven Aufträge</v-header>
                <v-list-item-group v-model="activeOrder">
                  <v-list-item
                    v-for="(activeOrder, i) in activeOrders"
                    :key="i"
                    :to="{ path: '/selectionScope/' + activeOrder.OrderId }"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-file-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>{{activeOrder.BusinessId}} - {{activeOrder.Name}} ({{activeOrder.Customer}})</v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
            <br />
            <v-card tile height="220">
              <v-list dense>
                <v-header>Meine letzten Aufträge</v-header>
                <v-list-item-group v-model="recentOrders">
                  <v-list-item
                    v-for="(recentOrder, i) in recentOrders"
                    :key="i"
                    :to="{ path: '/selectionScope/' + recentOrder.OrderId }"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-file-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>{{recentOrder.BusinessId}} - {{recentOrder.Name}} ({{recentOrder.Customer}})</v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </div>
        </v-col>
        <v-col cols="6">
          <div>
            <v-card tile dark color="#009688" height="220" :to="{ path: '/order/'}">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="160">mdi-qrcode</v-icon>
                  <v-card-title class="headline">Auftragsauswahl</v-card-title>
                </div>
              </div>
            </v-card>
            <br />
            <v-card tile dark color="#F44336" height="220" :to="{ path: '/selectionScope/1'}">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="160">mdi-broom</v-icon>
                  <v-card-title class="headline">Allgemeine Aktivitäten</v-card-title>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    activeOrders: [],
    recentOrders: []
  }),

  methods: {
    getActiveOrders() {
      let self = this;
      this.axios
        .post("http://localhost:3000/order/getActive", { userId: 1 })
        .then(function(response) {
          self.activeOrders = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    },
    getRecentOrders() {
      let self = this;
      this.axios
        .post("http://localhost:3000/order/getRecent", { userId: 1 })
        .then(function(response) {
          self.recentOrders = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    }
  },
  beforeMount() {
    this.getActiveOrders();
    this.getRecentOrders();
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