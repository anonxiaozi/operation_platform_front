import Vue from 'vue'
import VueRouter from 'vue-router'
import MyTerminal from '@/components/MyTerminal.vue'
import MyHosts from '@/components/MyHosts.vue'
import MyLogin from '@/components/MyLogin.vue'
import MySites from '@/components/MySites.vue'
import MyExternal from '@/components/MyExternal.vue'

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
        path: '/sites',
        name: 'sites',
        component: MySites
    },
    {
        path: '/external',
        name: 'external',
        component: MyExternal
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