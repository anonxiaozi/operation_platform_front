import Vue from 'vue'
import VueRouter from 'vue-router'
import MyTerminal from '@/components/MyTerminal.vue'
import MyHosts from '@/components/MyHosts.vue'
import MyLogin from '@/components/MyLogin.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/hosts',
        name: 'hosts',
        component: MyHosts
    },
    {
        path: '/login',
        name: 'login',
        component: MyLogin
    },
    {
        path: '/terminal/:host',
        name: 'terminal',
        component: MyTerminal
    },
    {
        path: '',
        name: 'index',
        redirect: {name: 'hosts'}
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router