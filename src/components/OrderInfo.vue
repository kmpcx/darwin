<template>
  <v-card tile>
    <v-card-title class="table-title">Informationen zum Auftrag: {{order.BusinessId}}</v-card-title>
    <v-card-subtitle class="order-info">
      <v-row>
        <v-col cols="5" class="text-left">
          Name: {{order.Name}}
          <br />
          Kunde: {{order.Customer}}
          <br />
          Gesamtlaufzeit bisher: {{calculateTimeFromDuration(orderDuration.duration, false)}}
          <!-- Gesamtlaufzeit bisher: {{new Date(orderDuration.duration).getDay()}}T {{new Date(orderDuration.duration).getHours()}}S {{new Date(orderDuration.duration).getMinutes()}}M {{new Date(orderDuration.duration).getSeconds()}}s -->
        </v-col>
        <v-col cols="7" class="text-left">Notiz: {{order.Note}}</v-col>
        <v-row justify="center">
          <v-dialog v-model="dialog" max-width="95%">
            <template v-slot:activator="{ on }">
              <v-btn class="history-button" color="blue darken-3" dark v-on="on">
                <v-icon>mdi-history</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-data-table
                :headers="headers"
                :items="orderEntries"
                :items-per-page="10"
                class="elevation-1"
                no-results-text="Keine passenden Einträge gefunden."
                no-data-text="Keine Daten vorhanden."
              >
                <template v-slot:item.Status="{ item }">{{getState(item)}}</template>
                <template v-slot:item.duration="{ item }">{{getDuration(item)}}</template>
                <template v-slot:item.StartTime="{ item }">{{getDateString(item.StartTime)}}</template>
                <template v-slot:item.EndTime="{ item }">{{getDateString(item.EndTime)}}</template>
                <template v-slot:item.staffCost="{ item }">{{formatMoney((getDurationRaw(item)*item.StaffCost)/3600, 2, ",", ".")}} €</template>
                <template v-slot:item.hardwareCost="{ item }">{{formatMoney((getDurationRaw(item)*item.HardwareCost)/3600, 2, ",", ".")}} €</template>
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

<style scoped>
.history-button {
  margin-top: 20px
}
</style>

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
    id: {
      required: true
    },
    idType: {
      required: false,
      default: "businessId"
    },
    adminView: {
      required: false,
      default: false
    }
  },
  mounted() {
    this.getOrder(1);
    if(this.adminView){
      this.headers.push( { text: "Personalkosten", value: "staffCost" },  { text: "Hardwarekosten", value: "hardwareCost" })
    }
  },
  destroyed() {},
  methods: {
    getOrder(run) {
      let self = this;
      let apiString = "/order/get";
      if (this.idType === "orderEntryId") {
        apiString = "/order/getByOrderEntry";
      }
      this.axios
        .post(process.env.VUE_APP_API + apiString, {
          [this.idType]: this.id,
          import: false
        })
        .then(function(response) {
          self.order = response.data;
          // console.log("Test1");
          self.getOrderDuration();
          // console.log("Test2");
          self.getOrderEntries();
          if(this.adminView){
            console.log("Test3");
            self.getOrderCosts();
          } else {
            console.log("Test4");
          }
        })
        .catch(function(error) {
          if (run <= 3) {
            setTimeout(() => {
              // callback function for timer, gets called after the time-delay
              // Your timer is done now. Print a line for debugging and resolve myTimerPromise
              self.getOrder(run++);
            }, 500);
          } else {
            console.log(error);
          }
          // console.log("BusinessId: " + self.businessId);
        });
    },
    formatMoney(number, decPlaces, decSep, thouSep) {
      (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
        (decSep = typeof decSep === "undefined" ? "." : decSep);
      thouSep = typeof thouSep === "undefined" ? "," : thouSep;
      var sign = number < 0 ? "-" : "";
      var i = String(
        parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces)))
      );
      var j = (j = i.length) > 3 ? j % 3 : 0;

      return (
        sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces
          ? decSep +
            Math.abs(number - i)
              .toFixed(decPlaces)
              .slice(2)
          : "")
      );
    },
    getOrderDuration() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getOrderDuration", {
          orderId: this.order.OrderId
        })
        .then(function(response) {
          self.orderDuration = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + orderId);
        });
    },
    getOrderCosts() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getOrderCosts", {
          orderId: this.order.OrderId
        })
        .then(function(response) {
          // self.orderDuration = response.data;
          console.log(response);
        })
        .catch(function(error) {
          alert("OrderId: " + orderId);
        });
    },
    getOrderEntries() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntries", {
          orderId: this.order.OrderId
        })
        .then(function(response) {
          self.orderEntries = response.data;
        })
        .catch(function(error) {
          alert("OrderId: " + this.order.OrderId);
        });
    },
    getState(item) {
      if (item.EndTime) return "Abgeschlossen";
      else return "Wird bearbeitet";
    },
    getDurationRaw(item){
      let endDate;
      if (item.EndTime) {
        endDate = new Date(item.EndTime);
      } else {
        endDate = new Date();
      }
      let startDate = new Date(item.StartTime);
      
      let delta = (endDate.getTime() - startDate.getTime()) / 1000;
      return delta;
    },
    getDuration(item) {
      let endDate;
      if (item.EndTime) {
        endDate = new Date(item.EndTime);
      } else {
        endDate = new Date();
      }
      let startDate = new Date(item.StartTime);
      let delta = (endDate.getTime() - startDate.getTime()) / 1000;
      return this.calculateTimeFromDuration(delta, false);
    },
    calculateTimeFromDuration(delta, seconds) {
      let durationString = "";
      let days = Math.floor(delta / 86400);
      delta -= days * 86400;
      if (days >= 1) {
        durationString += days + "T ";
      }
      let hours = (hours = Math.floor(delta / 3600) % 24);
      delta -= hours * 3600;
      let minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      durationString += hours + "S " + minutes + "M ";
      if (seconds) {
        let seconds = Math.floor(delta % 60);
        durationString += seconds + "s";
      }
      return durationString;
    },
    getDateString(tmpDate) {
      if (tmpDate) {
        let date = new Date(tmpDate);
        return date.toLocaleString();
      } else {
        return "-";
      }
    }
  }
};
</script>