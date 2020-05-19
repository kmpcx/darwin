<template>
  <v-card tile>
    <v-card-title
      v-if="start"
      class="table-title"
    >Start-Parameter für {{taskInfo.Name}} in {{taskInfo.ScopeName}}</v-card-title>
    <v-card-title v-else class="table-title">End-Parameter festlegen</v-card-title>
    <p v-if="errors.length">
      <b>Fehler:</b>
      {{errors[0]}}
    </p>
    <v-row>
      <v-col cols="8" class="parameter-area">
        <v-card-subtitle class="order-info" v-for="(item, i) in parameters" :key="i">
          <div v-if="parameterShownObj[item.id].length > 0">
            <v-container class="order-parameter-group" row v-if="item.type === 'radio'">
              <v-col cols="12">{{item.name}}</v-col>
              <v-col cols="6" class="col-parameters" v-for="(value, j) in item.values" :key="j">
              <v-checkbox
                class="order-parameter-item"
                v-model="form.parameters[item.id]"
                :label="value.name"
                :value="value.value"
                v-on:change="invokeFunction(item.id, value.id, true)"
              ></v-checkbox>
              </v-col>
            </v-container>
            <v-container class="order-parameter-group" row v-if="item.type === 'checkbox'">
              <v-col cols="12">{{item.name}}</v-col>
            
              <v-col cols="6" class="col-parameters" v-for="(value, j) in item.values" :key="j">
                <v-checkbox
                  class="order-parameter-item"
                  v-model="form.parameters[item.id]"
                  :label="value.name"
                  :value="value.value"
                  v-on:change="invokeFunction(item.id, value.id, false)"
                ></v-checkbox>
              </v-col>
            </v-container>
          </div>
        </v-card-subtitle>
      </v-col>

      <v-col cols="4">
        <v-card-subtitle class="order-amounts" v-for="(item, i) in parameters" :key="i">
          <div v-if="parameterShownObj[item.id].length > 0">
            <v-text-field
              dense
              v-if="item.type === 'int'"
              v-model="form.parameters[item.id]"
              :label="item.name"
              hide-details
              type="number"
            />
          </div>
        </v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { EventBus } from "../event-bus.js";
export default {
  data() {
    return {
      errors: [],
      parameters: [],
      form: { parameters: {} },
      taskInfo: {},
      parameterShownObj: {},
      parameterType: {},
      parameterValues: {},
      parameterRemoveAll: {},
      parameterCount: 0,
      parameterVisible: [],
      orderId: null,
      tmpTaskId: null,
      processComplete: 0,
      parameterComplete: {}
    };
  },
  props: {
    taskId: {
      required: false
    },
    orderEntryId: {
      required: false
    },
    start: {
      required: false,
      default: true
    }
  },
  mounted() {
    this.tmpTaskId = this.taskId;
    if (this.start) {
      this.getParameters();
      this.getTaskInfo();
    } else {
      this.getOrderEntry();
    }

    EventBus.$on("parameterSubmitStart", orderId => {
      this.orderId = orderId;
      this.submit();
    });
    EventBus.$on("parameterSubmitEnd", event => {
      this.submit();
    });
    EventBus.$on("parameterEndOpen", event => {
      this.setComplete(event);
    });
  },
  destroyed() {},
  methods: {
    getOrderEntry() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntry", {
          orderEntryId: this.orderEntryId
        })
        .then(function(response) {
          self.tmpTaskId = response.data.TaskId;
          self.getTaskInfo();
          self.getParameters();
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    },
    getTaskInfo() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getInfo", {
          taskId: this.tmpTaskId
        })
        .then(function(response) {
          self.taskInfo = response.data;
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    },
    getParameters() {
      let self = this;
      let timeString = "isStart";
      if (!this.start) {
        timeString = "isEnd";
      }
      this.axios
        .post(process.env.VUE_APP_API + "/task/getAttributes", {
          taskId: self.tmpTaskId,
          time: timeString
        })
        .then(function(response) {
          self.parameters = response.data;
          if (response.data.length > 0) {
            self.checkParameters();
          }
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    },
    checkParameters() {
      this.parameters.forEach((element, index) => {
        if (!this.start && element.name.includes("Unterbrechung")) {
          this.parameterComplete = element;
        }
        if (element.root === 1) {
          this.parameterShownObj[element.id] = [0];
          this.parameterCount++;
          this.parameterVisible.push(element.id);

          if (element.type === "int") {
            this.form.parameters[element.id] = element.values[0].value;
          } else if (element.type === "checkbox") {
            this.form.parameters[element.id] = [];
          } else {
            this.form.parameters[element.id] = "";
          }
        } else {
          this.parameterShownObj[element.id] = [];
        }
        this.parameterRemoveAll[element.id] = [];
        element.values.forEach((value, index) => {
          let invokes = [];
          if (value.invoke !== null && value.invoke !== undefined) {
            invokes = value.invoke.split(";");
          }
          this.parameterValues[value.id] = {
            name: value.name,
            value: value.value,
            invoke: invokes,
            parent: element.id
          };
          invokes.forEach((invoke, index) => {
            if (
              invoke !== "" &&
              !this.parameterRemoveAll[element.id].includes(invoke)
            ) {
              this.parameterRemoveAll[element.id].push(invoke);
            }
          });
        });

        this.parameterType[element.id] = element.type;
      });
    },
    invokeFunction(parameterId, valueId, removeAll) {
      let hasInvoke = false;
      let checkboxSelect = true;
      if (
        this.parameterValues[valueId].invoke.length > 0 &&
        this.parameterValues[valueId].invoke[0] !== ""
      ) {
        hasInvoke = true;
      }
      if (this.parameterRemoveAll[parameterId] !== null) {
        if (this.parameterType[parameterId] === "checkbox") {
          if (
            !this.form.parameters[parameterId].includes(
              this.parameterValues[valueId].value
            )
          ) {
            checkboxSelect = false;
          }
          if (hasInvoke && !checkboxSelect) {
            this.parameterValues[valueId].invoke.forEach((invoke, index) => {
              this.changeParameterShown(invoke, parameterId, true);
            });
          }
        } else {
          this.parameterRemoveAll[parameterId].forEach((invoke, index) => {
            this.changeParameterShown(invoke, parameterId, true);
          });
        }
        if (
          hasInvoke &&
          checkboxSelect &&
          !(
            this.form.parameters[parameterId] === null ||
            this.form.parameters[parameterId].length === 0 ||
            this.form.parameters[parameterId] === ""
          )
        ) {
          this.parameterValues[valueId].invoke.forEach((invoke, index) => {
            this.changeParameterShown(invoke, parameterId, false);
          });
        }
        this.parameterRemoveAll[parameterId].forEach((invoke, index) => {
          if (this.parameterShownObj[invoke].length === 0) {
            this.cleanParameter(parameterId, invoke);
          }
        });
      }
      this.parameterShownObj = Object.assign({}, this.parameterShownObj, {
        tmp: true
      });
    },
    changeParameterShown(invoke, parameterId, deduct) {
      let list = this.parameterShownObj[invoke];
      if (deduct) {
        //   console.log("Deduct: " + parameterId + " on " + invoke )
        let index = list.indexOf(parseInt(parameterId, 10));
        if (index > -1) {
          list.splice(index, 1);
        }
      } else {
        list.push(parameterId);
        if (
          list.length === 1 &&
          !this.parameterVisible.includes(parseInt(invoke, 10))
        ) {
          if (false || this.parameterType[invoke] === "checkbox") {
            this.form.parameters[invoke] = [];
          } else {
            this.form.parameters[invoke] = "";
          }
          this.parameterCount++;
          this.parameterVisible.push(parseInt(invoke, 10));
        }
      }
    },
    cleanParameter(parameterId, invoke) {
      if (this.form.parameters[invoke] !== undefined) {
        delete this.form.parameters[invoke];
        this.parameterCount--;
        let index = this.parameterVisible.indexOf(parseInt(invoke, 10));
        if (index > -1) {
          this.parameterVisible.splice(index, 1);
        }
      }
      if (this.parameterRemoveAll[invoke] !== null) {
        if (this.parameterShownObj[invoke].length === 0) {
          this.parameterRemoveAll[invoke].forEach((invokeTmp, index) => {
            this.changeParameterShown(invokeTmp, invoke, true);
            if (this.parameterShownObj[invokeTmp].length === 0) {
              this.cleanParameter(invoke, invokeTmp);
            }
          });
        }
      }
    },
    setComplete: function(complete) {
      console.log(this.parameterComplete);
      this.processComplete = complete;
      if (complete === 1) {
        this.form.parameters[this.parameterComplete.id] = "Abschluss";
        this.invokeFunction(this.parameterComplete.id, this.parameterComplete.values[0].id, true)
      } else if (complete === 2) {
        this.form.parameters[this.parameterComplete.id] = "Abbruch";
        this.invokeFunction(this.parameterComplete.id, this.parameterComplete.values[1].id, true)
      } else if (complete === 3) {
        this.form.parameters[this.parameterComplete.id] = "Pause";
        this.invokeFunction(this.parameterComplete.id, this.parameterComplete.values[1].id, true)
      }
    },
    submit: function() {
      this.errors = [];
      let error = false;
      if (this.parameterCount === 0) {
        this.sendSubmit();
      } else {
        var index = 0;
        for (let parameter in this.form.parameters) {
          index++;
          if (this.form.parameters[parameter] === "") {
            error = true;
          } else if (
            Array.isArray(this.form.parameters[parameter]) &&
            this.form.parameters[parameter].length === 0
          ) {
            error = true;
          }
          console.log(error);
          if (this.parameterCount === index) {
            if (error) {
              this.errors.push("Bitte prüfen sie die Start-Parameter.");
            } else {
              this.sendSubmit();
            }
          }
        }
      }
    },
    sendSubmit: function() {
      let self = this;
      let startString = "/order/startTask";
      let sendObj = {};
      if (self.start) {
        sendObj = {
          taskId: this.taskId,
          orderId: this.orderId,
          parameters: this.parameters,
          form: this.form,
          userId: this.$store.getters.getUserId
        };
      } else {
        startString = "/order/stopTask";
        sendObj = {
          orderEntryId: this.orderEntryId,
          parameters: this.parameters,
          form: this.form,
          complete: this.processComplete
        };
      }
      this.axios
        .post(process.env.VUE_APP_API + startString, sendObj)
        .then(function(response) {
          let forwardString = "/processRunning/" + response.data.insertId;
          if (!self.start) {
            forwardString = "/processStopped/" + self.orderEntryId;
          }
          console.log(forwardString);
          self.$router.push(forwardString);
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    }
  }
};
</script>

<style scoped>
.parameter-area {
  /* background-color: blue; */
  padding: 0;
} 

.order-info {
  text-align: left;
  /* background-color: red; */
  padding-left: 16px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 0px;
}

.col-parameters {
  padding: 0;
  padding-bottom: 0;
  padding-top: 0;
  /* background-color: lime; */
}

.order-amounts {
  text-align: left;
  /* background-color: lime; */
  padding-left: 10px;
  padding-top: 0px;
}

.order-parameter-group {
  text-align: left;
  /* background-color: orange; */
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 0px;
}

.order-parameter-item {
  text-align: left;
  /* background-color: pink; */
  padding-left: 5px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: -15px;
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