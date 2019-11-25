<template>
  <div>
    <v-stepper value="1">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1">Home</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2">Order</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">Scope</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Task</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Process</v-stepper-step>
      </v-stepper-header>
    </v-stepper>

    <div>
      <v-row>
        <v-col cols="6">
          <div>
            <v-card tile>
              <v-list dense>
                <v-header>Active Orders</v-header>
                <v-list-item-group v-model="item">
                  <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :to="{ path: '/selectionScope/' + item.OrderId }"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-file-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>{{item.BusinessId}} - {{item.Name}} ({{item.Customer}})</v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </div>
        </v-col>
        <v-col cols="6">
          <div>
            <v-card dark color="#009688" height="220">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="160">mdi-qrcode</v-icon>
                  <v-card-title class="headline">Order Selection</v-card-title>
                </div>
              </div>
            </v-card>
            <br>
            <v-card dark color="#F44336" height="220">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="160">mdi-broom</v-icon>
                  <v-card-title class="headline">Pool Activities</v-card-title>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-btn to="/order">Continue</v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: []
  }),

  methods: {
    getOrders() {
      let self = this;
      this.axios
        .post("http://localhost:3000/order/getAll", {})
        .then(function(response) {
          self.items = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    }
  },
  beforeMount() {
    this.getOrders();
  }
};
</script>