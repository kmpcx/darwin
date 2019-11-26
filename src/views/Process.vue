<template>
  <div>
    <v-stepper value="5">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1" complete>Start</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2" complete>Auftrag</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3" complete>Arbeitsbereich</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4" complete>Aktivität</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Prozess</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <h1>Process</h1>
    <div>
      <v-quagga :onDetected="logIt" :readerSize="readerSize" :readerTypes="['ean_reader']"></v-quagga>
    </div>
    <v-btn to="/selectionTask/1/1">Back</v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      readerSize: {
        width: 600,
        height: 400
      },
      detecteds: []
    }
  },
  methods: {
    logIt (data) {
      console.log('detected', data)
    }

  }
}
</script>