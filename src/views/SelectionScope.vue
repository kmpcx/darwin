<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step editable color="#283593" step="0">
          <router-link to="/login">Login</router-link>
        </v-stepper-step>

        <v-stepper-step editable color="#283593" step="1">
          <router-link to="/">Home</router-link>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable color="#283593" step="2">
          <router-link to="/order">Order</router-link>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">
          <router-link to="/selection">Selection</router-link>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable color="#283593" step="4">
          <router-link to="/process">Process</router-link>
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <h1>Selection in Order: {{$route.params.orderId}}</h1>
    <v-card max-width="100%" class="mx-auto">
      <v-container>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="4">
            <v-card :color="item.ColorBackground" dark max-height="180" to="/selectionTask/{{$route.params.orderId}}/{{item.ScopeId}}">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-icon size="120">{{item.Icon}}</v-icon>
                  <v-card-title class="headline" v-text="item.Name" ></v-card-title>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: String,
    }
  },
  data: () => ({
    items: []
  }),

  methods: {
    getScopes() {
      let self = this;
      this.axios
        .post("http://localhost:3000/scope/getByOrder", {orderId: this.orderId})
        .then(function(response) {
          self.items = response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    },
    clickBox(scopeId) {
      console.log(scopeId)
    }
  },
  beforeMount() {
    this.getScopes();
  },
};
</script>