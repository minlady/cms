// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
// import axios from 'axios'
import Mybread from '@/layout/mybread.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import myaxios from '@/assets/js/myaxios.js'
import moment from 'moment'

// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
// Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component(Mybread.name,Mybread)
Vue.use(Element)
Vue.use(myaxios)

Vue.filter('dateformat',function(value){
  return moment(value).format('YYYY-MM-DD hh-mm-ss a')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
