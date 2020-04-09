import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import animated from 'animate.css'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false
Vue.prototype.remoteAddr = '10.15.101.58:8088'
axios.defaults.withCredentials = true
Vue.use(animated)
Vue.use(VueCookies)

axios.interceptors.request.use(
    config => {
        var token = localStorage.getItem('token');
        if (token) {
            config.headers.token = token;
        }
        return config
    },
    error => {

    });

axios.interceptors.response.use(
    response => {
        if (response.data.status == 402) {
            localStorage.removeItem('token');
            parent.location.href = "/login";
        } else {
            return response
        }
    },
    function(error) {

    });

Vue.prototype.$http = axios

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('token');
        if (token === 'null' || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')