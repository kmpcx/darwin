<template>
    <v-stepper :value="stepperValue">
      <v-stepper-header>
        <v-stepper-step complete complete-icon="mdi-step-backward" step="B" v-if="backLastStep" @click="$router.go(-1)">
        Zurück
        <small>zum letzten Schritt</small>
        </v-stepper-step>
        <v-stepper-step color="blue darken-3" step="1" :complete="stepperValue > 1" >Start</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step color="blue darken-3" step="2" :complete="stepperValue > 2" >Auftrag</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step color="blue darken-3" step="3" :complete="stepperValue > 3" >Veredelungsart</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step color="blue darken-3" step="4" :complete="stepperValue > 4" >Aktivität</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step color="blue darken-3" step="5" :complete="stepperValue > 5" >Prozess</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: {
    stepperValue: {
      required: true
    },
    backLastStep: {
      required: false
    }
  },
  mounted() {
  },
  destroyed() {
    
  },
  methods: {
  }
};
</script>