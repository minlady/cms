<template>
  <el-container>
    <!-- 引入头部连接 -->
    <el-header>
        <Headers />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 侧边栏部分 -->
        <SideBar />
      </el-aside>
      <el-main>
        <!-- 这是右边的内容区域 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Headers from '@/layout/headers.vue'
import SideBar from '@/layout/sidebar.vue'
export default {
  components:{
    Headers,
    SideBar
  },
  beforeCreate(){
    var token = window.localStorage.getItem('token')
    if(!token){
      this.$message.error('您还没有登录，请先登录！')
      this.$router.push('/login')
      return
    }
  }
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: 100%;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 100%;
}
.el-header {
  padding: 0;
}
.mymenu {
  height: 100%;
}
.select {
  width: 400px;
}
</style>
