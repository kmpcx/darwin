import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const base =
  process.env.NODE_ENV === "production"
    ? "/Layout-system-with-vue-and-vue-router/"
    : "/";

export default new Router({
  mode: 'history',
  base,

  routes: [
    {
      path: "/",
      name: "home",
      meta: { layout: "no-sidebar" },
      component: require("@/views/Home.vue").default // load sync home
    },
    {
      path: "/login",
      name: "login",
      meta: { layout: "no-sidebar" },
      component: () => import("@/components/Login.vue")
    },
    {
      path: "/selection",
      name: "selection",
      meta: { layout: "no-sidebar" },
      component: require("@/views/Selection.vue").default,
      props: (route) => ({ orderId: route.query.orderId })
    },
    {
      path: "/selectionTask/:orderId/:scopeId",
      name: "selectionTask",
      meta: { layout: "no-sidebar" },
      component: require("@/views/SelectionTask.vue").default,
      props: (route) => ({ scopeId: route.query.scopeId, orderId: route.query.orderId })
    },
    {
      path: "/order",
      name: "order",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/Order.vue")
    },
    {
      path: "/process",
      name: "process",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/Process.vue")
    },
    {
      path: "/404",
      name: "404*",
      component: require("@/views/404.vue").default // load sync home
    },
    {
      path: "/test",
      name: "test",
      component: require("@/components/testAPI.vue").default
    }
  ]
});