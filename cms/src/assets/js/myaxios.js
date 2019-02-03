import axios from 'axios'
import Vue from 'vue'
var myaxios = {}
myaxios.install = function(vue){
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
    Vue.prototype.$http = axios
    axios.interceptors.request.use(function(config){
        if(config.url !== '/login'){
            config.headers['Authorization'] = window.localStorage.getItem('token')
        }
        return config
    })
}
export default myaxios