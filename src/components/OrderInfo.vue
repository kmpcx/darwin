<template>
    <v-card tile>
      <v-card-title class="headline">Informationen zum Auftrag: {{order.BusinessId}}</v-card-title>

      <v-card-subtitle class="order-info">
        <v-row>
          <v-col cols="4">
            Name: {{order.Name}}
            <br />
            Kunde: {{order.Customer}}
            <br />
            Gesamtlaufzeit bisher: {{new Date(orderDuration.duration).getDay()}}T {{new Date(orderDuration.duration).getHours()}}S {{new Date(orderDuration.duration).getMinutes()}}M {{new Date(orderDuration.duration).getSeconds()}}s
          </v-col>
          <v-col cols="8">
            Notiz: {{order.Note}}
            <br />
            Abgeschlossene Aktivitäten: Peter</v-col>
        </v-row>
      </v-card-subtitle>
    </v-card>
</template>

<script>
export default {
  data() {
    return {
        order: {},
        orderDuration: {}
    };
  },
  props: {
    orderId: {
      required: true
    }
  },
  mounted() {
      this.getOrder();
      this.getOrderDuration();
  },
  destroyed() {
    
  },
  methods: {
    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", { orderId: this.orderId })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + orderId);
        });
    },
    getOrderDuration() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getOrderDuration", { orderId: this.orderId })
        .then(function(response) {
          console.log(response)
          self.orderDuration = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + orderId);
        });
    },
  }
};
</script>