<script>
import NavBar from "@/components/NavBar";
import FooterBar from "@/components/FooterBar";
export default {
  components: {
    NavBar,
    FooterBar
  }
};
</script>

<template>
  <div>
    <nav-bar />
    <div class="container">
      <slot />
    </div>
    <footer-bar />
  </div>
</template>

<style scoped>
.my-container {
    display: flex;
    width: 90%;
    align-items: center;
    justify-content: center;
  
}
</style>