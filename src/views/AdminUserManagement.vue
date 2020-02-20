<template>
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
      :headers="headers"
      :items="users"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
    >
      <!-- <template v-slot:item.IsAdmin="{ item }">
        <v-simple-checkbox v-model="item.IsAdmin" disabled></v-simple-checkbox>
      </template>
      <template v-slot:item.IsActive="{ item }">
        <v-simple-checkbox v-model="item.IsActive" disabled></v-simple-checkbox>
      </template> -->
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="300px">
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
      { text: "Ist Admin", value: "IsAdmin" },
      { text: "Actions", value: "action", sortable: false }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      Username: "",
      Name: "",
      BusinessId: "",
      password: "",
    },
    defaultItem: {
      Username: "",
      Name: "",
      BusinessId: "",
      password: "",
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Neuer Benutzer" : "Benutzer Anpassen";
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
            alert("Fehler beim löschen des Users.");
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
        this.users.push(this.editedItem);
      }
      this.close();
    },
    updateUser(userId, user) {
      
    }
  },
  beforeMount() {
    this.getUsers();
  }
};
</script>