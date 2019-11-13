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
    <h1>Home</h1>
  </div>
</template>
