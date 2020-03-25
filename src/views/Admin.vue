<template>
  <div>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step color="blue darken-3" step="A">Adminbereich</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <br />
  <v-row justify="center">
    <v-col cols="8">
          <v-card tile color="blue darken-3" dark height="220" :to="{ path: '/admin/user'}">
            <div>
                <v-icon size="160">mdi-account</v-icon>
                <v-card-title class="headline justify-center">Benutzerverwaltung</v-card-title>
            </div>
        </v-card>
        <br>
         <v-card tile color="red darken-3" dark height="220" :to="{ path: '/admin/task'}">
            <div>
                <v-icon size="160">mdi-order-bool-ascending-variant</v-icon>
                <v-card-title class="headline justify-center">Tätigkeitsverwaltung</v-card-title>
            </div>
        </v-card>
        <br>
        <v-card tile color="green darken-3" dark height="220" :to="{ path: '/admin/report/order'}">
            <div>
                <v-icon size="160">mdi-file-chart</v-icon>
                <v-card-title class="headline justify-center">Auswertung 1</v-card-title>
            </div>
        </v-card>
    </v-col>
  </v-row>
</div>
</template>

<script>
export default {
  data: () => ({
  }),

  methods: {
    
  },
  beforeMount() {
   
  }
};
</script>