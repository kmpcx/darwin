<template>
  <div>
    <stepper-bar stepperValue="3" backLastStep="true">
      </stepper-bar>
    <br />
      <order-info :id="businessId">
      </order-info>
    <br />
    <v-card tile max-width="100%" class="mx-auto">
      <v-card-title class="table-title">Auswahl der Veredelungsart</v-card-title>
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="3">
            <v-card
              tile
              :color="item.ColorBackground"
              dark
              max-height="220"
              :to="{ path: '/selectionTask/' + $route.params.businessId + '/' + item.ScopeId }"
            >
            <v-img class="white--text align-end" height="220" :src="item.ImageLoaded"> 
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
    <br />
  </div>
</template>

<script>
export default {
  props: {
    businessId: {
      type: String
    }
  },
  data: () => ({
    orderId: null,
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
          self.loadImages();
        })
        .catch(function(error) {
          alert(error);
        });
    },

    loadImages() {
      this.items.forEach((item, index) => {
        if (item.Image !== "") {
          item.ImageLoaded = require("../assets/img/" + item.Image)
        }
      });
    },

    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", { businessId: this.businessId, import: true })
        .then(function(response) {
          self.order = response.data;
          self.orderId = response.data.OrderId;
          self.getScopes();
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