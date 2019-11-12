<template>
  <div class="section">
    <p v-if="loading" class="notification is-info">
      Loading
    </p>

    <template v-else>
      <h1 class="title">Welcome to our Internetz Site</h1>
    </template>
  </div>
</template>