import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const base =
  process.env.NODE_ENV === "production"
    ? "/Layout-system-with-vue-and-vue-router/"
    : "/";

export default new Router({
  mode: "history",
  base,

  routes: [
    {
      path: "/",
      name: "home",
      meta: { layout: "no-sidebar" },
      component: require("@/pages/Home.vue").default // load sync home
    },
    {
      path: "/about-us",
      name: "about",
      meta: { layout: "no-sidebar" },
      component: () => import("@/pages/About.vue")
    },
    {
      path: "/404",
      name: "404*",
      component: require("@/pages/404.vue").default // load sync home
    }
  ]
});