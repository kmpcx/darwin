import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import VueQrcodeReader from "vue-qrcode-reader"

import Default from "./layouts/Default.vue";
import NoSidebar from "./layouts/NoSidebar.vue";

Vue.component("default-layout", Default);
Vue.component("no-sidebar-layout", NoSidebar);

Vue.use(VueAxios, Axios)
Vue.use(VueQrcodeReader)

Vue.config.productionTip = false

// Vue.prototype.$http = Axios //Needed for login?

const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common.Authorization = token
}

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App),
}).$mount('#app')
