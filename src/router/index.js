import Vue from "vue";
import Router from "vue-router";
import store from '../store'

Vue.use(Router);

const base =
  process.env.NODE_ENV === "production"
    ? "/Layout-system-with-vue-and-vue-router/"
    : "/";

const router = new Router({
  mode: 'history',
  base,

  routes: [
    {
      path: "/",
      name: "home",
      meta: { layout: "no-sidebar" },
      component: require("@/views/Home.vue").default, // load sync home
      meta: { 
        requiresAuth: true
      }
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
      props: true,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: "/selectionTask/:orderId/:scopeId",
      name: "selectionTask",
      meta: { layout: "no-sidebar" },
      component: require("@/views/SelectionTask.vue").default,
      props: true,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: "/order",
      name: "order",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/Order.vue"),
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: "/process/:orderId/:scopeId/:taskId",
      name: "process",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/Process.vue"),
      props: true,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: "/processRunning/:orderId/:scopeId/:taskId/:orderEntryId",
      name: "processRunning",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/ProcessRunning.vue"),
      props: true,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: "/processPaused/:orderId/:scopeId/:taskId",
      name: "processPaused",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/ProcessPaused.vue"),
      props: true,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: "/processStopped/:orderId/:scopeId/:taskId",
      name: "processStopped",
      meta: { layout: "no-sidebar" },
      component: () => import("@/views/ProcessStopped.vue"),
      props: true,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: "/admin",
      name: "admin",
      meta: { layout: "no-sidebar" },
      component: require("@/views/Admin.vue").default,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: "/404",
      name: "404*",
      component: require("@/views/404.vue").default
    },
    {
      path: "/test",
      name: "test",
      component: require("@/components/testAPI.vue").default,
    }
  ],
});

router.beforeEach((to, from, next) => {
  if(to.path !== "/login" && to.matched.some(record => record.meta.requiresAuth)) {
    if(to.matched.some(record => record.meta.requiresAdmin)) {
      if (store.getters.isAdmin >= 1) {
        next()
        return
      }
      next('/') 
    } else {
      if (store.getters.isLoggedIn) {
        next()
        return
      }
      next('/login') 
    }
  } else {
    next() 
  }
})

export default router;