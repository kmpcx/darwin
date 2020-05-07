<template>
  <div data-app>
    <stepper-bar stepperValue="5" backLastStep="true"></stepper-bar>
    <br />
    <order-info :id="businessId"></order-info>
    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <parameter-controller :start=true :taskId="taskId" ></parameter-controller>
          </div>
        </v-col>
        <v-col cols="4">
          <br />
          <v-btn tile width="120" height="70" dark large color="#8BC34A" @click="click">
            <v-icon dark>mdi-play</v-icon>Start
          </v-btn>
          <br />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../event-bus.js';
export default {
  props: {
    businessId: {
      type: String
    },
    taskId: {
      type: String
    }
  },
  data: () => ({
    taskInfo: {},
    order: {},
  }),

  methods: {
    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", {
          businessId: this.businessId
        })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    },
    getTaskInfo() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getInfo", {
          taskId: this.taskId
        })
        .then(function(response) {
          self.taskInfo = response.data;
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    },
    click() {
      EventBus.$emit('parameterSubmitStart', this.order.OrderId);
    },
  },
  beforeMount() {
    this.getOrder();
    this.getTaskInfo();
  }
};
</script>

<style scoped>
.order-info {
  text-align: left;
  /* background-color: forestgreen; */
  padding-left: 16px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 0px;
}

.order-parameter-group {
  text-align: left;
  /* background-color: yellow; */
  padding-top: 0px;
  padding-bottom: 0px;
}

.order-parameter-item {
  text-align: left;
  /* background-color: pink; */
  padding-left: 15px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 0px;
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