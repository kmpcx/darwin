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
                <div>Meine laufenden Aktivitäten</div>
                <v-list-item-group>
                  <v-list-item
                    v-for="(activeOrder, i) in activeOrders"
                    :key="i"
                    :to="{ path: '/processRunning/' + activeOrder.OrderId + '/0/' + activeOrder.TaskId + '/' + activeOrder.OrderEntryId }"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-file-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>{{activeOrder.Name}} ({{activeOrder.Customer}}) - {{activeOrder.ScopeName}} {{activeOrder.TaskName}}</v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
            <br />
            <v-card tile height="220">
              <v-list dense>
                <div>Meine letzten Aufträge</div>
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
            <v-card tile color="blue darken-3" dark height="220" :to="{ path: '/order/'}">
            <v-img class="white--text align-end" height="220" src="https://images.unsplash.com/photo-1495364037436-fed1ba81ad3e">
              <div>
                <div>
                  <v-icon size="160">mdi-qrcode</v-icon>
                  <v-card-title class="headline justify-center">Auftragsauswahl</v-card-title>
                </div>
              </div>
            </v-img>
            </v-card>
            <br />
            <v-card tile dark color="deep-orange" height="220" :to="{ path: '/selectionScope/1'}">
              <v-img class="white--text align-end" height="220" src="https://images.unsplash.com/photo-1529220502050-f15e570c634e">
              <div>
                <div>
                  <v-icon size="160">mdi-broom</v-icon>
                  <v-card-title class="headline justify-center">Allgemeine Aktivitäten</v-card-title>
                </div>
              </div>
              </v-img>
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
        .post(process.env.VUE_APP_API + "/order/getActiveTasks", { userId: this.$store.getters.getUserId })
        .then(function(response) {
          self.activeOrders = response.data;
        })
        .catch(function(error) {
          if(error.response.status !== 404){
            console.log(error);
          }
        });
    },
    getRecentOrders() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getRecent", { userId: this.$store.getters.getUserId })
        .then(function(response) {
          self.recentOrders = response.data;
        })
        .catch(function(error) {
          console.log(error);
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