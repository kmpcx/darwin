<template>
  <div>
       <v-card tile color="blue darken-3" dark height="220" :to="{ path: '/admin/user'}">
            <div>
                <v-icon size="160">mdi-account</v-icon>
                <v-card-title class="headline justify-center">Nutzer verwaltung</v-card-title>
            </div>
        </v-card>
        <br>
        <v-card tile color="green darken-3" dark height="220" :to="{ path: '/admin/report'}">
            <div>
                <v-icon size="160">mdi-file-chart</v-icon>
                <v-card-title class="headline justify-center">Auswertung 1</v-card-title>
            </div>
        </v-card>
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