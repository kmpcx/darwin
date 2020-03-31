<template>
  <div data-app>
    <stepper-bar stepperValue="2" backLastStep="true"></stepper-bar>
    <div>
      <v-row>
        <v-col cols="7">
          <div>
            <v-card>
              <v-card-title>
                Auftragsauswahl
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
                :items="items"
                :items-per-page="itemsPerPage"
                :search="search"
                :page.sync="page"
                hide-default-footer
                @page-count="pageCount = $event"
                @click:row="goToOrder"
              ></v-data-table>
              <v-pagination circle v-model="page" class="table-pagination" :length="pageCount" color="blue darken-3"></v-pagination>
            </v-card>
          </div>
        </v-col>
        <v-col cols="5">
          <div>
            <StreamBarcodeReader @decode="onDecode"></StreamBarcodeReader>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
export default {
  components: { StreamBarcodeReader },
  data: () => ({
    search: "",
    page: 1,
    pageCount: 0,
    itemsPerPage: 6,
    items: [],
    headers: [
      {
        text: "Kunde",
        align: "left",
        sortable: true,
        value: "A0Name1"
      },
      { 
        text: "Nr.", 
        align: "left", 
        sortable: true,
        value: "BelID" 
      },
      { 
        text: "Auftrag", 
        align: "left", 
        sortable: true, 
        value: "Belegnummer" 
      }
    ]
  }),

  methods: {
    getOrders() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getAllSage", {})
        .then(function(response) {
          self.items = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    },
    goToOrder(item) {
      this.$router.push("/selectionScope/" + item.BelID);
    },
    onDecode(decodedString) {
      // alert("detected", decodedString)
      console.log("detected", decodedString);
      this.$router.push("/selectionScope/" + decodedString);
    }
  },
  beforeMount() {
    this.getOrders();
  }
};
</script>

<style scoped>
.table-title {
  padding-top: 10px;
}

.table-pagination {
  padding-bottom: 10px;
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

.v-data-footer__select {
  display: none;
}
</style>