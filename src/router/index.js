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
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/selectionScope/:orderId",
      name: "selectionScope",
      meta: { layout: "no-sidebar" },
      component: require("@/views/SelectionScope.vue").default,
      props: true
    },
    {
      path: "/selectionTask/:orderId/:scopeId",
      name: "selectionTask",
      meta: { layout: "no-sidebar" },
      component: require("@/views/SelectionTask.vue").default,
      props: true
    },
    {
      path: "/order",
      name: "order",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/Order.vue")
    },
    {
      path: "/process/:orderId/:scopeId/:taskId",
      name: "process",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/Process.vue")
    },
    {
      path: "/processRunning/:orderId/:scopeId/:taskId",
      name: "processRunning",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/ProcessRunning.vue")
    },
    {
      path: "/processPaused/:orderId/:scopeId/:taskId",
      name: "processPaused",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/ProcessPaused.vue")
    },
    {
      path: "/processStopped/:orderId/:scopeId/:taskId",
      name: "processStopped",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/ProcessStopped.vue")
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