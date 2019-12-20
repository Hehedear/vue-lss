import Vue from 'vue'
import VueRouter from 'vue-router'
import navigation from '../components/navigation/navigation'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'navigation',
    component: navigation
  }
]

const router = new VueRouter({
  routes
})

export default router
