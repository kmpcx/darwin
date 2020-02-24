<template>
  <div>
    <stepper-bar stepperValue="4">
      </stepper-bar>
    <br />
      <order-info :orderId="orderId">
      </order-info>
    <br />
    <v-card tile max-width="100%" class="mx-auto">
      <v-card-title class="headline">Auswahl der Aktivität für {{scope.Name}}</v-card-title>
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="4">
            <v-card tile :color="item.ColorBackground" dark max-height="150"
            :to="{ path: '/process/' + $route.params.orderId + '/' + '2'+ '/' + item.TaskId}">
              <div>
                <div>
                  <v-icon size="100">{{item.Icon}}</v-icon>
                  <v-card-title class="headline justify-center" v-text="item.Name"></v-card-title>
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
    order: {},
    scope: {}
  }),

  methods: {
    // No scopeId is returned in getByOrderAndScope
    getTasks() {
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
    getScope() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/scope/get", { scopeId: this.scopeId })
        .then(function(response) {
          self.scope = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    },
  },
  beforeMount() {
    this.getTasks();
    this.getOrder();
    this.getScope();
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