<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step color="blue darken-3" step="B">Auftrags Auswertung</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
    <v-card>
      <v-card-title>
        Auftrag
        <v-spacer></v-spacer>
        <v-autocomplete
          :items="orders"
          :filter="customFilter"
          color="white"
          :item-text="customName"
          label="Zum Tippen klicken ..."
          @change="updateOrder"
        ></v-autocomplete>
      </v-card-title>
    </v-card>
    <br />
    <order-info :id="businessId" :key="componentKey">
        </order-info>
      <br />
  </div>
</template>

<script>
export default {
  data: () => ({
    orders: [],
    businessId: null,
    componentKey: 0
  }),
  computed: {},
  watch: {},
  methods: {
    forceRerender() {
      this.componentKey += 1;  
    },
    customName(item){
      return item.BusinessId + ' - ' + item.Name + ' - ' + item.Customer;
    },
    updateOrder(item){
      this.businessId = item.split("-")[0].replace(" ", "");
      this.forceRerender();
      console.log(this.businessId)
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.Name.toLowerCase();
      const textTwo = item.BusinessId.toLowerCase();
      const textThree = item.Customer.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1 || textThree.indexOf(searchText) > -1
      );
    },
    getOrders() {
      let self = this;
      this.axios
        .post(process.env.VUE_APP_API + "/order/getAll", {})
        .then(function(response) {
          // console.log(response.data)
          self.orders = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    }
  },
  beforeMount() {
    this.getOrders();
  }
};
</script>