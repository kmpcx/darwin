<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step color="blue darken-3" step="B">Parameterverwaltung</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card>
      <v-card-title>
        Parameter für {{task.Name}}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Suche"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="attributes"
        :items-per-page="10"
        :search="search"
        item-key="TaskAttributeId"
        show-expand
        :expanded.sync="expanded"
        class="elevation-1"
        no-results-text="Keine passenden Einträge gefunden."
        no-data-text="Keine Daten vorhanden."
      >
        <template v-slot:expanded-item="{ headers, item }">
          <div v-if="item.Type !== 'int'">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Value</th>
                <th class="text-left">Aufruf (Invoke)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, index) in item.values" :key="value.id">
                <td>{{ value.Name }}</td>
                <td>{{ value.Value }}</td>
                <td>{{ value.Invoke }}</td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ onValue }">
                      <v-icon
                        class="mr-2"
                        @click="editValue(item, value, index)"
                        v-on="onValue"
                      >mdi-playlist-edit</v-icon>
                    </template>
                    <span>Option bearbeiten</span>
                  </v-tooltip>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ onValue }">
                      <v-icon class="mr-2" @click="addValue(item)" v-on="onValue">mdi-playlist-plus</v-icon>
                    </template>
                    <span>Option hinzufügen</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
            <!-- <template v-slot:activator="{ on }">
              <v-icon class="mr-2" @click="editItem(item)" v-on="on">mdi-pencil-outline</v-icon>
            </template>-->
            <!-- <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Neue Option</v-btn>
            </template>-->
          </div>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="50%">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Neuer Parameter</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Type" label="Type"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.SortingNumber"
                          type="decimal"
                          label="Sortier Nummer"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Root" label="Erste Ebene"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.IsStart" label="Anfang"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.IsEnd" label="Ende"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Abbrechen</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Speichern</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogValue" max-width="50%">
              <!-- <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Neuer Benutzer</v-btn>
              </template>-->
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitleValue }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedValueItem.Name" label="Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedValueItem.Value" label="Value"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedValueItem.Invoke"
                          label="Aufruf/Invoke ( ; als trenner)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Abbrechen</v-btn>
                  <v-btn color="blue darken-1" text @click="saveValue">Speichern</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ onValue }">
              <v-icon class="mr-2" @click="editItem(item)" v-on="onValue">mdi-pencil-outline</v-icon>
            </template>
            <span>Bearbeiten</span>
          </v-tooltip>
          <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    taskId: {
      type: String
    }
  },
  data: () => ({
    dialog: false,
    dialogValue: false,
    expanded: [],
    search: "",
    headers: [
      {
        text: "Parameter",
        align: "left",
        sortable: true,
        value: "Name"
      },
      { text: "Parameter ID", value: "TaskAttributeId" },
      { text: "Type", value: "Type" },
      { text: "Sortier Nummer", value: "SortingNumber" },
      { text: "Standard", value: "Default" },
      { text: "Erste Ebene", value: "Root" },
      { text: "Anfang", value: "IsStart" },
      { text: "Ende", value: "IsEnd" },
      { text: "Aktionen", value: "action", sortable: false },
      { text: "", value: "data-table-expand", sortable: false }
    ],
    task: {},
    attributes: [],
    editedIndex: -1,
    editedValueIndex: -1,
    editedItem: {
      TaskAttributeId: "",
      Name: "",
      Type: "",
      SortingNumber: "",
      Default: "",
      Root: "",
      IsStart: "",
      IsEnd: ""
    },
    editedValueItem: {
      TaskAttributeValueId: "",
      Name: "",
      Value: "",
      Invoke: "",
      taskAttributeId: ""
    },
    defaultEditedValueItem: {
      TaskAttributeValueId: "",
      Name: "",
      Value: "",
      Invoke: "",
      TaskAttributeId: ""
    },
    defaultItem: {
      TaskAttributeId: "",
      Name: "",
      Type: "radio",
      SortingNumber: "10",
      Default: "",
      Root: "1",
      IsStart: "1",
      IsEnd: "0"
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Neuer Parameter" : "Parameter anpassen";
    },
    formTitleValue() {
      return this.editedValueIndex === -1 ? "Neue Option" : "Option anpassen";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogValue(val) {
      val || this.close();
    }
  },
  methods: {
    getTask() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/get", {
          taskId: self.taskId
        })
        .then(function(response) {
          self.task = response.data;
        })
        .catch(function(error) {
          if (error.response.status !== 404) {
            console.log(error);
          }
        });
    },
    getTaskAttributes() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getTaskAttributes", {
          taskId: self.taskId
        })
        .then(function(response) {
          self.attributes = response.data;
        })
        .catch(function(error) {
          if (error.response.status !== 404) {
            console.log(error);
          }
        });
    },
    editItem(item) {
      this.editedIndex = this.attributes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    editValue(item, taskAttributeValue, index) {
      this.editedIndex = this.attributes.indexOf(item);
      this.editedValueIndex = index;
      this.editedItem = Object.assign({}, item);
      this.editedValueItem = Object.assign({}, taskAttributeValue);
      this.dialogValue = true;
    },
    addValue(item) {
      this.editedIndex = this.attributes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedValueItem.TaskAttributeId = item.TaskAttributeId;
      console.log("addValue: ", this.editedValueItem.TaskAttributeId);
      this.dialogValue = true;
    },
    // deleteItem(item) {
    //   const index = this.users.indexOf(item);
    //   confirm("Wollen Sie den Benutzer wirklich löschen?") &&
    //     this.deleteUser(item.UserId, index);
    // },
    // deleteUser(userId, index) {
    //   let self = this;
    //   this.axios
    //     .post(process.env.VUE_APP_API + "/auth/remove", { userId: userId })
    //     .then(function(response) {
    //       self.users.splice(index, 1);
    //     })
    //     .catch(function(error) {
    //       if (error.response.status !== 404) {
    //         alert("Fehler beim Löschen des Benutzers.");
    //         console.log(error);
    //       }
    //     });
    // },
    close() {
      this.dialog = false;
      this.dialogValue = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedValueItem = Object.assign({}, this.defaultEditedValueItem);
        this.editedIndex = -1;
        this.editedValueIndex = -1;
      }, 300);
    },
    closeValues() {
      this.dialogValue = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.editedValueIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        let self = this;
        this.axios
          .post(process.env.VUE_APP_API + "/task/editAttribute", {
            taskAttributeId: this.editedItem.TaskAttributeId,
            taskAttribute: this.editedItem
          })
          .then(function(response) {
            Object.assign(self.attributes[self.editedIndex], self.editedItem);
          })
          .catch(function(error) {
            console.log(error);
            alert("Parameter konnte nicht bearbeitet werden.");
          });
      } else {
        this.createAttribute(this.editedItem);
      }
      this.close();
    },
    createAttribute(attribute) {
      delete attribute.TaskAttributeId;
      attribute.taskId = this.task.TaskId;
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/addAttribute", {
          taskAttribute: attribute
        })
        .then(function(response) {
          attribute.TaskAttributeId = response.data.insertId;
          self.attributes.push(attribute);

          //Add default Value
          let defaultValue = { taskAttributeId: response.data.insertId };
          if (attribute.Type === "int") {
            defaultValue.Name = "int";
          } else {
            defaultValue.Name = "Option 1";
            defaultValue.Value = "Option 1";
          }
          self.createAttributeValue(
            defaultValue,
            self.attributes.indexOf(attribute)
          );
        })
        .catch(function(error) {
          console.log(error);
          alert("Parameter konnte nicht erstellt werden.");
        });
    },
    saveValue() {
      if (this.editedValueIndex > -1) {
        let self = this;
        this.axios
          .post(process.env.VUE_APP_API + "/task/editAttributeValue", {
            taskAttributeValueId: this.editedValueItem.TaskAttributeValueId,
            taskAttributeValue: this.editedValueItem
          })
          .then(function(response) {
            Object.assign(
              self.attributes[self.editedIndex].values[self.editedValueIndex],
              self.editedValueItem
            );
          })
          .catch(function(error) {
            console.log(error);
            alert("Value konnte nicht bearbeitet werden.");
          });
      } else {
        this.createAttributeValue(this.editedValueItem, this.editedIndex);
      }
      this.closeValues();
    },
    createAttributeValue(attributeValue, indexAttribute) {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/addAttributeValue", {
          taskAttributeValue: attributeValue
        })
        .then(function(response) {
          attributeValue.TaskAttributeValueId = response.data.insertId;
          if (!self.attributes[indexAttribute].values) {
            self.attributes[indexAttribute].values = [];
          }
          self.attributes[indexAttribute].values.push(attributeValue);
        })
        .catch(function(error) {
          console.log(error);
          alert("Parameter konnte nicht erstellt werden.");
        });
    }
  },
  beforeMount() {
    this.getTask();
    this.getTaskAttributes();
    this.close();
  }
};
</script>