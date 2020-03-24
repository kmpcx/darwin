<template>
  <div>
    <stepper-bar stepperValue="1"></stepper-bar>

    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <v-card tile height="300">
              <div class="table-title">Meine laufenden Aktivitäten</div>
              <v-simple-table fixed-header height="260">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Kunde</th>
                      <th class="text-left">Auftrag</th>
                      <th class="text-left">Veredelungsart</th>
                      <th class="text-left">Aktivität</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(activeOrder, i) in activeOrders" :key="i" v-on:click="clickRunningActivity(activeOrder)">
                      <td class="text-left">{{activeOrder.Customer}}</td>
                      <td class="text-left">{{activeOrder.Name}}</td>
                      <td class="text-left">{{activeOrder.ScopeName}}</td>
                      <td class="text-left">{{activeOrder.TaskName}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
            <br />
            <v-card tile height="300">
              <div class="table-title">Meine letzten Aufträge</div>
              <v-simple-table fixed-header height="260">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Kunde.</th>
                      <th class="text-left">Nr.</th>
                      <th class="text-left">Auftrag</th>
                      <!-- <th class="text-left">End</th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(recentOrder, i) in recentOrders" :key="i" v-on:click="clickRecentOrder(recentOrder)">
                      <td class="text-left">{{recentOrder.Customer}}</td>
                      <td class="text-left">{{recentOrder.BusinessId}}</td>
                      <td class="text-left">{{recentOrder.Name}}</td>
                      <!-- <td class="text-left">{{recentOrder.EndTime}}</td> -->
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </div>
        </v-col>
        <v-col cols="4">
          <div>
            <v-card tile color="black" dark height="300" :to="{ path: '/order/'}">
              <v-img
                class="white--text align-end"
                height="300"
                src="../assets/img/img_av.jpg"
              >
                <div>
                  <div>
                    <v-icon size="220">mdi-qrcode</v-icon>
                    <v-card-title class="headline justify-center">Auftragsauswahl</v-card-title>
                  </div>
                </div>
              </v-img>
            </v-card>
            <br />
            <v-card tile dark color="black" height="300" :to="{ path: '/selectionScope/1'}">
              <v-img
                class="white--text align-end"
                height="300"
                src="../assets/img/img_sonstiges.jpg"
              >
                <div>
                  <div>
                    <v-icon size="220">mdi-broom</v-icon>
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
    clickRecentOrder(recentOrder) {
      this.$router.push('/selectionScope/' + recentOrder.BusinessId);
    },
    clickRunningActivity(activeOrder) {
      this.$router.push('/processRunning/' + activeOrder.OrderEntryId);
    },
    getActiveOrders() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getActiveTasks", {
          userId: this.$store.getters.getUserId
        })
        .then(function(response) {
          self.activeOrders = response.data;
        })
        .catch(function(error) {
          if (error.response.status !== 404) {
            console.log(error);
          }
        });
    },
    getRecentOrders() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getRecent", {
          userId: this.$store.getters.getUserId
        })
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
.table-title {
  padding-top: 10px
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