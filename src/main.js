import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import animated from 'animate.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.remoteAddr = '10.15.101.58'
axios.defaults.withCredentials = true
Vue.use(animated)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
