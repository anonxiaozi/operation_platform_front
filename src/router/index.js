import Vue from 'vue'
import VueRouter from 'vue-router'
import MyTerminal from '@/components/MyTerminal.vue'
import MyHosts from '@/components/MyHosts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Hosts',
    component: MyHosts
  },
  {
    path: '/terminal',
    name: 'terminal',
    component: MyTerminal
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
