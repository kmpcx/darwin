<template>
  <div data-app>
    <stepper-bar stepperValue="5">
      </stepper-bar>
    <br />
      <order-info :id="businessId">
      </order-info>
    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <br>
              <v-card tile>
                <v-card-title class="headline">Start-Parameter für {{taskInfo.Name}} in {{taskInfo.ScopeName}}</v-card-title>
                <p v-if="errors.length">
                  <b>Fehler:</b>
                  {{errors[0]}}
                </p>
                <p>
                  <v-card-subtitle v-for="(item, i) in parameters" :key="i" class="order-info">
                    <v-radio-group v-if="item.type === 'radio'" v-model="form.parameters[i]" row> {{item.name}}
                      <v-radio v-for="(value, j) in item.values" :key="j" :label="value.name" :value="value.value"></v-radio>
                    </v-radio-group>
                    <v-text-field v-else-if="item.type === 'int'" v-model="form.parameters[i]" :label="item.name" hide-details single-line type="number"/>
                  </v-card-subtitle>
                </p>
              </v-card>
            <br />
          </div>
        </v-col>
        <v-col cols="4">
          <br />
          <v-btn
            tile
            width="120"
            height="70"
            dark
            large
            color="#8BC34A"
            @click="submit"
          >
            <v-icon dark>mdi-play</v-icon>Start
          </v-btn>
          <br />
        </v-col>
      </v-row>
    </div>
    <br />
    <v-row>
      <v-col class="btn-outter-left" cols="6">
        <v-btn tile :to="{ path: '/selectionTask/' + $route.params.businessId + '/' + taskInfo.ScopeId }">
          <v-icon dark>mdi-arrow-left-thick</v-icon>
        </v-btn>
      </v-col>
      <v-col class="btn-outter-right" cols="6">
        <v-btn tile :to="{ path: '/processRunning/1' }">
          <v-icon dark>mdi-arrow-right-thick</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
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
    items: [],
    parameters: [],
    order: {},
    errors: [],
    form: {parameters: []},
    taskInfo: {}
  }),

  methods: {
    getOrder() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/get", { businessId: this.businessId })
        .then(function(response) {
          self.order = response.data;
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    },
    getParameters() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getAttributes", { taskId: this.taskId , time: 'isStart'})
        .then(function(response) {
          self.parameters = response.data;
        })
        .catch(function(error) {
          if(error.response.status !== 404){
            alert("Error: " + error);
          }         
        });
    },
    getTaskInfo() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getInfo", { taskId: this.taskId})
        .then(function(response) {
          self.taskInfo = response.data;
        })
        .catch(function(error) {
          if(error.response.status !== 404){
            alert("Error: " + error);
          }         
        });
    },
    submit: function () {
      let self = this;
      this.errors = [];
      if (this.form.parameters.length === this.parameters.length || !this.parameters.length) {
        this.axios
          .post(process.env.VUE_APP_API + "/order/startTask",
          {taskId: this.taskId , orderId: this.order.OrderId, parameters: this.parameters, form: this.form, userId: this.$store.getters.getUserId})
          .then(function(response) {
            self.$router.push('/processRunning/' + response.data.insertId)
          })
          .catch(function(error) {
            alert("Error: " + error);         
          });
      } else {
        this.errors.push('Bitte prüfen sie die Start-Parameter.');
      }
    }
  },
  beforeMount() {
    this.getOrder();
    this.getParameters();
    this.getTaskInfo();
  }
};
</script>

<style scoped>
.order-info {
  text-align: left;
}

.checkboxes {
  padding-left: 2%;
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