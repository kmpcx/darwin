<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step color="blue darken-3" step="B">Benutzerverwaltung</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card>
      <v-card-title>
        Benutzer
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
        locale="de"
        :headers="headers"
        :items="users"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
        no-results-text="Keine passenden Einträge gefunden."
        no-data-text="Keine Daten vorhanden."
      >
        <!-- <template v-slot:item.IsAdmin="{ item }">
        <v-simple-checkbox v-model="item.IsAdmin" disabled></v-simple-checkbox>
        </template>-->
        <template
          v-slot:item.Cost="{ item }"
        >{{formatMoney(item.Cost, 2, ",", ".")}} €</template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="50%">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Neuer Benutzer</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Username" label="Benutzername"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.BusinessId" label="Business ID"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Cost" type="decimal" suffix="€" label="Personenkosten"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.password" label="Passwort"></v-text-field>
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
          <v-icon small class="mr-2" @click="editItem(item)">mdi-account-edit</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
      {
        text: "Username",
        align: "left",
        sortable: true,
        value: "Username"
      },
      { text: "Name", value: "Name" },
      { text: "Business ID", value: "BusinessId" },
      { text: "Personenkosten (€/H)", value: "Cost" },
      { text: "Adminrechte", value: "IsAdmin" },
      { text: "Aktionen", value: "action", sortable: false }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      Username: "",
      Name: "",
      BusinessId: "",
      Cost: "",
      password: ""
    },
    defaultItem: {
      Username: "",
      Name: "",
      BusinessId: "",
      Cost: "0,00",
      password: ""
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Neuer Benutzer" : "Benutzer anpassen";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    getUsers() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/auth/getAll", {})
        .then(function(response) {
          self.users = response.data;
        })
        .catch(function(error) {
          if (error.response.status !== 404) {
            console.log(error);
          }
        });
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem.Cost.toString().replace(".", ","))
      this.editedItem.Cost = this.editedItem.Cost.toString().replace(".", ",");
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm("Wollen Sie den Benutzer wirklich löschen?") &&
        this.deleteUser(item.UserId, index);
    },
    deleteUser(userId, index) {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/auth/remove", { userId: userId })
        .then(function(response) {
          self.users.splice(index, 1);
        })
        .catch(function(error) {
          if (error.response.status !== 404) {
            alert("Fehler beim Löschen des Benutzers.");
            console.log(error);
          }
        });
    },
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
          .post(process.env.VUE_APP_API + "/auth/update", {
            userId: this.editedItem.UserId,
            user: this.editedItem
          })
          .then(function(response) {
            Object.assign(self.users[self.editedIndex], self.editedItem);
          })
          .catch(function(error) {
            console.log(error);
            alert("Benutzer konnte nicht bearbeitet werden.");
          });
      } else {
        this.createUser(this.editedItem);
      }
      this.close();
    },
    createUser(user) {
      console.log(user);
      user.IsAdmin = 0;
      user.IsActive = 1;
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/auth/create", {
          user: user
        })
        .then(function(response) {
          self.users.push(user);
        })
        .catch(function(error) {
          console.log(error);
          alert("Benutzer konnte nicht erstellt werden.");
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
    }
  },
  beforeMount() {
    this.getUsers();
  }
};
</script>