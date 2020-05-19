<template>
  <div>
    <stepper-bar stepperValue="4" backLastStep="true"></stepper-bar>
    <br />
    <order-info :id="businessId"></order-info>
    <br />
    <v-card tile max-width="100%" class="mx-auto">
      <v-card-title class="table-title">Auswahl der Aktivität für {{scope.Name}}</v-card-title>
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="3">
            <v-card
              tile
              :color="item.ColorBackground"
              dark
              max-height="220"
              
              :to="{ path: '/process/' + $route.params.businessId + '/' + item.TaskId}"
            >
              <v-img class="white--text align-end" height="220"  :src="item.ImageLoaded">
                <div>
                  <div>
                    <!-- <v-icon size="40">{{item.Icon}}</v-icon> -->
                    <v-card-title class="headline justify-center" v-text="item.Name"></v-card-title>
                  </div>
                </div>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    businessId: {
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
          orderId: this.order.OrderId,
          scopeId: this.scopeId
        })
        .then(function(response) {
          //alert(scopeId);
          self.items = response.data;
          self.loadImages();
        })
        .catch(function(error) {
          alert(error);
        });
    },

    loadImages() {
      this.items.forEach((item, index) => {
        if (item.Image !== "") {
          item.ImageLoaded = require("../assets/img/" + item.Image);
        }
      });
    },

    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", {
          businessId: this.businessId
        })
        .then(function(response) {
          self.order = response.data;
          self.getTasks();
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
    }
  },
  beforeMount() {
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