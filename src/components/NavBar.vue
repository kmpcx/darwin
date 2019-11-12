<template>
  <nav class="navbar is-light">
    <div class="navbar-brand">
      <div class="navbar-item" href="/">
        Vue multi layouts
      </div>

      <a class="navbar-burger" @click="open = !open">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{'is-active': open}">
      <div class="navbar-start">
        <div class="navbar-item">
          <router-link class="button is-primary" :to="{name: 'home'}" @click.native="open = false">
            Home
          </router-link>
        </div>
        <div class="navbar-item">
          <router-link class="button is-primary" :to="{name: 'about'}" @click.native="open = false">
            About
          </router-link>
        </div>
      </div>
    </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <router-link class="button is-primary" :to="{name: '404*'}" @click.native="open = false">
            404
          </router-link>
        </div>
      </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      open: false
    };
  }
};
</script>
