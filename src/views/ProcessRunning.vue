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
                    <p>Status: in Bearbeitung</p>
                    <p>Start: {{startDate.toLocaleString('de-DE', {})}}</p>
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
        <v-col cols="4">
          <!-- <v-dialog v-model="stopDialog" max-width="50%" max-height="50%">
            <template v-slot:activator="{ on }">
              <v-btn tile width="120" height="70" dark large color="#F44336" v-on="on">
                <v-icon dark>mdi-stop</v-icon>Pause
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Aktivität beenden</v-card-title>
              <v-card tile>
                <v-card-title class="table-title">Stop-Parameter</v-card-title>
                <p v-if="errors.length">
                  <b>Fehler:</b>
                  {{errors[0]}}
                </p>
                <p>
                  <v-card-subtitle v-for="(item, i) in parameters" :key="i" class="order-info">
                    <v-radio-group v-if="item.type === 'radio'" v-model="form.parameters[i]" row>
                      {{item.name}}
                      <v-radio
                        v-for="(value, j) in item.values"
                        :key="j"
                        :label="value.name"
                        :value="value.value"
                      ></v-radio>
                    </v-radio-group>
                    <v-text-field
                      v-else-if="item.type === 'int'"
                      v-model="form.parameters[i]"
                      :label="item.name"
                      hide-details
                      type="number"
                    />
                  </v-card-subtitle>
                </p>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="stopDialog = false">
                  <v-icon dark>mdi-close-circle</v-icon>Abbrechen
                </v-btn>
                <v-btn color="green darken-1" text @click="submit">
                  <v-icon dark>mdi-check</v-icon>Fertigstellen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <br />
          <br /> -->
          <v-dialog v-model="completeDialog" max-width="50%" max-height="50%">
            <template v-slot:activator="{ on }">
              <v-btn tile width="120" height="70" dark large color="#8BC34A" v-on="on">
                <v-icon dark>mdi-check</v-icon>Abschluss
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Aktivität fertigstellen</v-card-title>
              <!-- <v-card-text>Ist die laufende Aktivität fertiggestellt?</v-card-text> -->
              <v-card tile>
                <v-card-title class="table-title">Parameter zum Beenden festlegen</v-card-title>
                <p v-if="errors.length">
                  <b>Fehler:</b>
                  {{errors[0]}}
                </p>
                <p>
                  <v-card-subtitle v-for="(item, i) in parameters" :key="i" class="order-info">
                    <v-radio-group v-if="item.type === 'radio'" v-model="form.parameters[i]" row>
                      {{item.name}}
                      <v-radio
                        v-for="(value, j) in item.values"
                        :key="j"
                        :label="value.name"
                        :value="value.value"
                      ></v-radio>
                    </v-radio-group>
                    <v-text-field
                      v-else-if="item.type === 'int'"
                      v-model="form.parameters[i]"
                      :label="item.name"
                      hide-details
                      type="number"
                    />
                  </v-card-subtitle>
                </p>
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="completeDialog = false">
                  <v-icon dark>mdi-close-circle</v-icon>Abbrechen
                </v-btn>
                <v-btn color="green darken-1" text @click="submit">
                  <v-icon dark>mdi-check</v-icon>Fertigstellen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderEntryId: {
      type: String
    }
  },
  data: () => ({
    businessId: "",
    parameters: [],
    errors: [],
    form: { parameters: [] },
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
          self.getParameters(response.data.TaskId);
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
    getParameters(taskId) {
      console.log(this.taskInfo);
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getAttributes", {
          taskId: taskId,
          time: "isEnd"
        })
        .then(function(response) {
          self.parameters = response.data;
          if (response.data.length > 0) {
            self.checkIntFields();
          }
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    },
    checkIntFields() {
      this.parameters.forEach((element, index) => {
        if (element.type === "int") {
          this.form.parameters[index] = element.values;
        }
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
    submit: function() {
      let self = this;
      this.errors = [];
      if (
        (!this.form.parameters.includes(undefined) &&
          this.form.parameters.length === this.parameters.length) ||
        !this.parameters.length
      ) {
        this.axios
          .post(process.env.VUE_APP_API + "/order/stopTask", {
            orderEntryId: this.orderEntryId,
            parameters: this.parameters,
            form: this.form,
            note: "Abgeschlossen"
          })
          .then(function(response) {
            self.$router.push("/processStopped/" + self.orderEntryId);
          })
          .catch(function(error) {
            alert("Error: " + error);
          });
      } else {
        this.errors.push("Bitte prüfen Sie die Stop-Parameter.");
      }
    }
  },
  beforeMount() {
    this.getEntryAttributes();
    this.getOrderEntry();
  },
  created() {}
};
</script>

<style scoped>
.order-info {
  text-align: left;
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