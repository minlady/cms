import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'
import Users from '@/components/page/users/users.vue'
import Right from '@/components/page/right/right.vue'
import Role from '@/components/page/role/role.vue'
import { Message } from 'element-ui'
import Goods from '@/components/page/goods/goods.vue'
import Add from '@/components/page/goods/add.vue'
Vue.use(Router)

var router = new Router({
  routes: [
    {
      path:'/',
      redirect:'/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path:'/home',
      name:'home',
      component:Home,
      children:[
        {path:'/users',component:Users},
        {path:'/rights',component:Right},
        {path:'/roles',component:Role},
        {path:'/goods',component:Goods},
        {path:'/goods/add',component:Add}
      ]
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path !== '/login'){
    var token = window.localStorage.getItem('token')
    if(!token){
      router.push('/login')
      Message.error('您还没有登录，请先登录！')
    }else{
      next()
    }
  }else{
    next()
  }
})

export default router
