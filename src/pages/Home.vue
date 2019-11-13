<template>
<div>
  <v-stepper>
    <v-stepper-header>
      <v-stepper-step editable color="#283593" step="1">
        <router-link to="/">Home</router-link>
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step color="#283593" step="2">
        <router-link to="/about-us">About</router-link>
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step editable color="#283593" step="3">Arbeitsschritt</v-stepper-step>
    </v-stepper-header>
  </v-stepper>
  <h1>Home</h1>
  </div>
</template>
