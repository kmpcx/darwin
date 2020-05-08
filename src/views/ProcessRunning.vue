<template>
  <div data-app>
    <stepper-bar stepperValue="5"></stepper-bar>
    <br />
    <order-info :id="orderEntryId" idType="orderEntryId"></order-info>
    <br />
    <div>
      <v-row>
        <v-col cols="8">
          <div>
            <v-card tile>
              <v-row>
                <v-col cols="12">
                  <v-card-title class="table-title">{{taskInfo.ScopeName}} - {{taskInfo.Name}}</v-card-title>
                </v-col>
                <v-col cols="6">
                  <v-card-title class="table-title">Start-Parameter</v-card-title>
                  <v-card-subtitle
                    v-for="(item, i) in orderEntryAttributes"
                    :key="i"
                    class="order-info"
                  >
                    <p>{{item.Name}} {{item.InputValue}}</p>
                  </v-card-subtitle>
                </v-col>

                <v-col cols="6">
                  <v-card-title class="table-title">Statusinformationen</v-card-title>

                  <v-card-subtitle class="order-info">
                    Status: in Bearbeitung
                    <br />
                    Start: {{startDate.toLocaleString('de-DE', {})}}
                    <p>
                      Laufzeit:
                      <time-since :date="startDate">
                        <template slot-scope="int">
                          <span v-if="int.days !== 0">{{int.days}}T</span>
                          {{int.hours}}S {{int.minutes}}M {{int.seconds}}s
                        </template>
                      </time-since>
                    </p>
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
            <br />
          </div>
        </v-col>

        <v-dialog v-model="completeDialog" max-width="50%" max-height="50%">
          <template v-slot:activator="{ on }">
            <v-col cols="4">
              <v-btn
                tile
                width="120"
                height="70"
                dark
                large
                color="#8BC34A"
                v-on="on"
                @click="clickOpen(true)"
              >
                <v-icon dark>mdi-check</v-icon>Abschluss
              </v-btn>

              <br />
              <br />

              <v-btn
                tile
                width="120"
                height="70"
                dark
                large
                color="#BDBDBD"
                v-on="on"
                @click="clickOpen(false)"
              >
                <v-icon dark>mdi-pause</v-icon>Pause
              </v-btn>
            </v-col>
          </template>
          <v-card>
            <v-card-title class="headline">Aktivität fertigstellen</v-card-title>
            <parameter-controller :start=(false) :orderEntryId="orderEntryId"></parameter-controller>
            <!-- <v-card tile>
              <v-card-title class="table-title">Parameter zum Beenden festlegen</v-card-title>
              <p v-if="errors.length">
                <b>Fehler:</b>
                {{errors[0]}}
              </p>
              <p>
                <v-card-subtitle class="order-info" v-for="(item, i) in parameters" :key="i">
                  <div v-if="parameterShown[item.id] > 0">
                    <v-container class="order-parameter-group" row v-if="item.type === 'radio'">
                      {{item.name}}
                      <v-checkbox
                        class="order-parameter-item"
                        v-for="(value, j) in item.values"
                        :key="j"
                        v-model="form.parameters[item.id]"
                        :label="value.name"
                        :value="value.value"
                        v-on:change="invokeFunction(value.invoke, form.parameters[item.id], value.value)"
                      ></v-checkbox>
                    </v-container>
                    <v-container class="order-parameter-group" row v-if="item.type === 'checkbox'">
                      {{item.name}}
                      <v-checkbox
                        class="order-parameter-item"
                        v-for="(value, j) in item.values"
                        :key="j"
                        v-model="form.parameters[item.id]"
                        :label="value.name"
                        :value="value.value"
                        v-on:change="invokeFunction(value.invoke, form.parameters[item.id], value.value)"
                      ></v-checkbox>
                    </v-container>
                    <v-text-field
                      dense
                      v-else-if="item.type === 'int'"
                      v-model="form.parameters[item.id]"
                      :label="item.name"
                      hide-details
                      type="number"
                    />
                  </div>
                </v-card-subtitle>
              </p>
            </v-card> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="completeDialog = false">
                <v-icon dark>mdi-close-circle</v-icon>Abbrechen
              </v-btn>
              <v-btn color="green darken-1" text @click="clickSubmit">
                <v-icon dark>mdi-check</v-icon>Fertigstellen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <br />
        <br />
      </v-row>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../event-bus.js';
export default {
  props: {
    orderEntryId: {
      type: String
    }
  },
  data: () => ({
    businessId: "",
    orderEntry: {},
    completeDialog: false,
    stopDialog: false,
    startDate: new Date(),
    orderEntryAttributes: [],
    taskInfo: {}
  }),
  computed: {},
  methods: {
    getOrderEntry() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntry", {
          orderEntryId: this.orderEntryId
        })
        .then(function(response) {
          self.orderEntry = response.data;
          self.startDate = new Date(response.data.StartTime);
          self.getTaskInfo(response.data.TaskId);
          if (response.data.EndTime) {
            self.$router.push("/processStopped/" + self.orderEntryId);
          }
        })
        .catch(function(error) {
          alert("Error: " + error);
        });
    },
    getEntryAttributes() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getEntryAttributes", {
          orderEntryId: this.orderEntryId
        })
        .then(function(response) {
          self.orderEntryAttributes = response.data;
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    },
    getTaskInfo(taskId) {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getInfo", {
          taskId: taskId
        })
        .then(function(response) {
          self.taskInfo = response.data;
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    },
    clickSubmit: function() {
      EventBus.$emit('parameterSubmitEnd', 1);
    },
    clickOpen: function(end) {
      let event = 2;
      if(end){
        event = 1;
      }
      setTimeout(() => EventBus.$emit('parameterEndOpen', event), 200);
    },
  },
  beforeMount() {
    this.getEntryAttributes();
    this.getOrderEntry();
  },
  created() {
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
  margin-bottom: -15px;
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