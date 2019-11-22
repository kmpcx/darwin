<template>
  <div>
    <v-stepper value="1">
      <v-stepper-header>
        <v-stepper-step color="#283593" step="1">Home</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="2">Order</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="3">Scope</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="4">Task</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="#283593" step="5">Process</v-stepper-step>
      </v-stepper-header>
    </v-stepper>

    <div>
      <v-row no-gutters>
        <v-col cols="4">
          <v-card>List of orders</v-card>
        </v-col>
        <v-col cols="8">
          <v-card>Order selection frame</v-card>
        </v-col>
      </v-row>
    </div>

    <h1>Home</h1>
    <v-btn to="/order">Continue</v-btn>
  </div>
</template>
