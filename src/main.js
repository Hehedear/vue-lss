import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
Vue.prototype.$http = axios
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3001'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
