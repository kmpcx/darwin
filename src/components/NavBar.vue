<template>
  <div>
    <v-system-bar color="red lighten-2">
      <v-icon>mdi-arrow-collapse-all</v-icon>
      <span>DARWIN</span>
      <v-spacer></v-spacer>
      <span>{{ new Date() | moment("hh:mm DD.MM.YYYY") }}</span>
    </v-system-bar>
  </div>

</template>

<script>
import Vue from 'vue';
import VueMoment from 'vue-moment';

Vue.use(VueMoment);

export default {
  data() {
    return {
      open: false
    };
  }
};
</script>
