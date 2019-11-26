<template>
  <div>
    <v-stepper value="4">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Start</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2" complete>Auftrag</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3" complete>Arbeitsbereich</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Aktivität</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Prozess</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card tile>
      <v-card-title class="headline">Auswahl des Arbeitsbereichs für Auftrag: {{order.BusinessId}}</v-card-title>

      <v-card-subtitle class="order-info">
        <v-row>
          <v-col cols="4">
            Name: {{order.Name}}
            <br />
            Kunde: {{order.Customer}}
          </v-col>
          <v-col cols="8">Notiz: {{order.Note}}</v-col>
        </v-row>
      </v-card-subtitle>
    </v-card>
    <br />
    <v-card tile max-width="100%" class="mx-auto">
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="4">
            <v-card tile :color="item.ColorBackground" dark max-height="150">
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
    <v-btn tile :to="{ path: '/selectionScope/' + $route.params.orderId }">Zurück</v-btn>
    <v-btn tile to="/process">Weiter</v-btn>
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
    getScopes() {
      let self = this;
      this.axios
        .post("http://localhost:3000/task/getByOrderAndScope", {
          orderId: this.orderId,
          scopeId: this.scopeId
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
        .post("http://localhost:3000/order/get", { orderId: this.orderId })
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
</style>