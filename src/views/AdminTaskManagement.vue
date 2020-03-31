<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step color="blue darken-3" step="B">Tätigkeitenverwaltung</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card>
      <v-card-title>
        Tätigkeit
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
        :items="tasks"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.ScopeId="{ item }">
          {{scopes[item.ScopeId]}}
        </template>
        <template
          v-slot:item.Cost="{ item }"
        >{{formatMoney(item.Cost, 2, ",", ".")}} €</template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="50%">
              <!-- <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Neuer Benutzer</v-btn>
              </template> -->
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
                        <v-text-field v-model="editedItem.Description" label="Beschreibung"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.ScopeId" label="Veredelungsart"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Cost" type="decimal" suffix="€" label="Kosten"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.SortingNumber" type="decimal" label="Sortier Nummer"></v-text-field>
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
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
          <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    search: "",
    headers: [
      { text: "Veredelungsart", value: "ScopeId" },
      {
        text: "Name",
        align: "left",
        sortable: true,
        value: "Name"
      },
      { text: "Beschreibung", value: "Description" },
      { text: "Sortier Nummer", value: "SortingNumber" },
      { text: "Kosten (€/H)", value: "Cost" },
      { text: "Aktionen", value: "action", sortable: false }
    ],
    tasks: [],
    scopes: {},
    editedIndex: -1,
    editedItem: {
      Name: "",
      Description: "",
      SortingNumber: "",
      Cost: ""
    },
    defaultItem: {
      Name: "",
      Description: "",
      SortingNumber: "",
      Cost: "0,00"
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Neue Tätigkeit" : "Tätigkeit anpassen";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    getTasks() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/task/getAll", {})
        .then(function(response) {
          self.tasks = response.data;
        })
        .catch(function(error) {
          if (error.response.status !== 404) {
            console.log(error);
          }
        });
    },
    getScopes() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/scope/getAll", {})
        .then(function(response) {
          // self.scopes = response.data;
          // response.data.forEach(element => );
          response.data.forEach(function(element, idx, array){
            self.scopes[element.ScopeId] = element.Name
            if (idx === array.length - 1){ 
                 self.getTasks();
            }
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    editItem(item) {
      this.editedIndex = this.tasks.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem.Cost.toString().replace(".", ","))
      this.editedItem.Cost = this.editedItem.Cost.toString().replace(".", ",");
      this.dialog = true;
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
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      this.editedItem.Cost = parseFloat(this.editedItem.Cost.replace(",", "."))
      if (this.editedIndex > -1) {
        let self = this;
        this.axios
          .post(process.env.VUE_APP_API + "/task/update", {
            taskId: this.editedItem.TaskId,
            task: this.editedItem
          })
          .then(function(response) {
            Object.assign(self.tasks[self.editedIndex], self.editedItem);
          })
          .catch(function(error) {
            console.log(error);
            alert("Tätigkeit konnte nicht bearbeitet werden.");
          });
      } else {
        // this.createUser(this.editedItem);
      }
      this.close();
    },
    // createUser(user) {
    //   console.log(user);
    //   user.IsAdmin = 0;
    //   user.IsActive = 1;
    //   let self = this;
    //   this.axios
    //     .post(process.env.VUE_APP_API + "/auth/create", {
    //       user: user
    //     })
    //     .then(function(response) {
    //       self.users.push(user);
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //       alert("Benutzer konnte nicht erstellt werden.");
    //     });
    // },
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
    }
  },
  beforeMount() {
    
    this.getScopes();
  }
};
</script>