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
        <v-col cols="4">
          <v-card tile>
            <v-list dense>
              <v-header>Active Orders</v-header>
              <v-list-item-group v-model="item">
                <v-list-item disabled v-for="(item, i) in items" :key="i">
                  <v-list-item-icon>
                    <v-icon>mdi-file-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{item.BusinessId}} - {{item.Name}} ({{item.Customer}})
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-card tile>
            Selection
            <v-row>
              <v-col cols="8">
                <v-card tile height="180">Select Order</v-card>
              </v-col>
              <v-col cols="8">
                <v-card tile height="180">Pool Activities</v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <h1>Home</h1>
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