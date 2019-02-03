<template>
  <el-menu
    :router="true"
    :unique-opened="true"
    default-active="2"
    class="el-menu-vertical-demo mymenu"
  >
    <el-submenu :index="item1.path" v-for="item1 in menuList"
    :key="item1.id">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{item1.authName}}</span>
      </template>
      <el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="'/' + item2.path">
        <i class="el-icon-menu"></i>
        <span>{{item2.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data(){
    return{
      menuList:[]
    }
  },
  methods:{
    async getMenuList(){
      var res = await this.$http.request({
        url:'/menus',
        method:'get',
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var {meta,data}= res.data
      if(meta.status === 200){
        this.menuList = data
      }
    }
  },
  mounted(){
    this.getMenuList()
  }
};
</script>

<style>
</style>
