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
          Gesamtlaufzeit bisher: {{calculateTimeFromDuration(orderDuration.duration, true)}}
          <!-- Gesamtlaufzeit bisher: {{new Date(orderDuration.duration).getDay()}}T {{new Date(orderDuration.duration).getHours()}}S {{new Date(orderDuration.duration).getMinutes()}}M {{new Date(orderDuration.duration).getSeconds()}}s -->
        </v-col>
        <v-col cols="8">Notiz: {{order.Note}}</v-col>
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="80%">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">Aktivitätshistorie</v-btn>
            </template>
            <v-card>
              <v-data-table
                :headers="headers"
                :items="orderEntries"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.Status="{ item }">
                  {{getState(item)}}
                </template>
                <template v-slot:item.duration="{ item }">
                  {{getDuration(item)}}
                </template>
                <template v-slot:item.StartTime="{ item }">
                  {{getDateString(item.StartTime)}}
                </template>
                <template v-slot:item.EndTime="{ item }">
                  {{getDateString(item.EndTime)}}
                </template>
              </v-data-table>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">Schließen</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-row>
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      order: {},
      orderDuration: {},
      orderEntries: {},
      headers: [
        { text: "Veredelungsart", value: "ScopeName" },
        { text: "Aktivität", value: "TaskName" },
        { text: "Status", value: "Status" },
        { text: "Bediener", value: "Username" },
        { text: "Dauer", value: "duration" },
        { text: "Start", value: "StartTime" },
        { text: "Ende", value: "EndTime" }
      ]
    };
  },
  props: {
    orderId: {
      required: true
    },
    businessId: {
      required: true
    }
  },
  mounted() {
    this.getOrder();
    this.getOrderDuration();
    this.getOrderEntries();
  },
  destroyed() {},
  methods: {
    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", { businessId: this.businessId })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("BusinessId: " + businessId);
        });
    },
    getOrderDuration() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getOrderDuration", {
          orderId: this.orderId
        })
        .then(function(response) {
          self.orderDuration = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + orderId);
        });
    },
    getOrderEntries() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntries", {
          orderId: this.orderId
        })
        .then(function(response) {
          self.orderEntries = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + businessId);
        });
    },
    getState(item){
      if (item.EndTime) return 'Abgeschlossen'
        else return 'Wird bearbeitet'
    },
    getDuration(item){
      if(item.EndTime){
        let startDate = new Date(item.StartTime);
        let endDate = new Date(item.EndTime);
        let delta = (endDate.getTime() - startDate.getTime()) / 1000;
        return this.calculateTimeFromDuration(delta, false)
      } else {
        return '-'
      }
    },
    calculateTimeFromDuration(delta, seconds){
      let durationString = '';
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;
        if(days >= 1){
          durationString += days + 'T '
        }
        let hours = hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        durationString += hours + 'S ' + minutes + 'M ';
        if(seconds){
          let seconds = Math.floor(delta % 60);
          durationString += seconds + 's'
        }
        return durationString;
    },
    getDateString(tmpDate){
      if(tmpDate){
        let date = new Date(tmpDate);
      return date.toLocaleString()
      } else {
        return '-'
      }
    }
  }
};
</script>