<template>
  <div>
    <stepper-bar stepperValue="3">
      </stepper-bar>
    <br />
      <order-info :orderId="order.OrderId" :businessId="orderId">
      </order-info>
    <br />
    <v-card tile max-width="100%" class="mx-auto">
      <v-card-title class="headline">Auswahl der Veredelungsart</v-card-title>
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="4">
            <v-card
              tile
              :color="item.ColorBackground"
              dark
              max-height="150"
              :to="{ path: '/selectionTask/' + $route.params.orderId + '/' + item.ScopeId }"
            >
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
      <v-btn tile to="/order"><v-icon dark>mdi-arrow-left-thick</v-icon></v-btn>
    </v-col>

    <v-col class="btn-outter-right" cols="6">
      <v-btn tile :to="{ path: '/selectionTask/' + $route.params.orderId + '/1'}"><v-icon dark>mdi-arrow-right-thick</v-icon></v-btn>
    </v-col>
  </v-row>

  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: String
    }
  },
  data: () => ({
    items: [],
    order: {},
    stepperValue: 3
  }),

  methods: {
    getScopes() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/scope/getByOrder", {
          orderId: this.orderId
        })
        .then(function(response) {
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

    clickBox(scopeId) {
      console.log(scopeId);
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