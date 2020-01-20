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
    <div class="my-container">
      <slot />
    </div>
    <footer-bar />
  </div>
</template>

<style scoped>
.my-container {
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 2%;
    height: 600px;
    width: 90%;
    align-items: center;
    justify-content: center;
  
}
</style>