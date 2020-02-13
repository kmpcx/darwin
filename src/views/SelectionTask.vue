<template>
  <div>
    <v-stepper value="4">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Start</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2" complete>Auftrag</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3" complete>Veredelungsart</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Aktivität</v-stepper-step>

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
            Abgeschlossene Aktivitäten: Patchen / Patchen /</v-col>
        </v-row>
      </v-card-subtitle>
    </v-card>
    <br />
    <v-card tile max-width="100%" class="mx-auto">
      <v-card-title class="headline">Auswahl der Aktivität</v-card-title>
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="4">
            <v-card tile :color="item.ColorBackground" dark max-height="150"
            :to="{ path: '/process/' + $route.params.orderId + '/' + '2'+ '/' + item.Taskid}">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="100">{{item.Icon}}</v-icon>
                  <v-card-title class="headline" v-text="item.Name"></v-card-title>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <br />
      <v-row>
    <v-col class="btn-outter-left" cols="6">
      <v-btn tile :to="{ path: '/selectionScope/' + $route.params.orderId }"><v-icon dark>mdi-arrow-left-thick</v-icon></v-btn>
    </v-col>

    <v-col class="btn-outter-right" cols="6">
      <v-btn tile :to="{ path: '/process/' + $route.params.orderId + '/2/2'  }"><v-icon dark>mdi-arrow-right-thick</v-icon></v-btn>
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
    }
  },
  data: () => ({
    items: [],
    order: {}
  }),

  methods: {
    // No scopeId is returned in getByOrderAndScope
    getScopes() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getByOrderAndScope", {
          orderId: this.orderId,
          scopeId: this.scopeId
        })
        .then(function(response) {
           //alert(scopeId);
          self.items = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    },
        getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", { orderId: this.orderId })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    },
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