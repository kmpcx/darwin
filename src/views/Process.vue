<template>
  <div data-app>
    <stepper-bar stepperValue="5" backLastStep="true">
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
                <v-card-title class="table-title">Start-Parameter für {{taskInfo.Name}} in {{taskInfo.ScopeName}}</v-card-title>
                <p v-if="errors.length">
                  <b>Fehler:</b>
                  {{errors[0]}}
                </p>
                
                  <v-card-subtitle class="order-info" v-for="(item, i) in parameters" :key="i" >
                    <v-container class="order-parameter-group-1" row v-if="item.type === 'radio'">{{item.name}} 
                        <v-checkbox class="order-parameter-item" v-for="(value, j) in item.values" :key="j" v-model="form.parameters[i]" :label="value.name" :value="value.value"></v-checkbox>
                    </v-container>
                    <!-- <v-radio-group v-if="item.type === 'radio'" v-model="form.parameters[i]" row>{{item.name}}
                      <v-radio v-for="(value, j) in item.values" :key="j" :label="value.name" :value="value.value"></v-radio>
                    </v-radio-group> -->
                    <v-container class="order-parameter-group-2" row v-if="item.type === 'checkbox'">{{item.name}}
                        <v-checkbox class="order-parameter-item" v-for="(value, j) in item.values" :key="j" v-model="form.parameters[i]" :label="value.name" :value="value.value"></v-checkbox>
                    </v-container>
                    <v-text-field dense v-else-if="item.type === 'int'" v-model="form.parameters[i]" :label="item.name" hide-details type="number"/>
                  </v-card-subtitle>
                
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
          if(response.data.length > 0){
            self.checkParameters();
          }
        })
        .catch(function(error) {
          console.log("Error: " + error);     
        });
    },
    checkParameters(){
      this.parameters.forEach((element, index) => {
        if(element.type === 'int'){
          this.form.parameters[index] = element.values;
        } else if(element.type === 'checkbox'){
          this.form.parameters[index] = [];
        } else {
          this.form.parameters[index] = '';
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
          console.log("Error: " + error);      
        });
    },
    submit: function () {
      let self = this;
      this.errors = [];
      if (!this.form.parameters.includes(undefined) && this.form.parameters.length === this.parameters.length || !this.parameters.length) {
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
  /* background-color: forestgreen; */
  padding-left: 16px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 0px;
}

.order-parameter-group-1 {
  text-align: left;
  /* background-color: yellow; */
  padding-top: 0px;
  padding-bottom: 0px;
}

.order-parameter-group-2 {
  text-align: left;
  /* background-color: orange; */
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