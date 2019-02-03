<template>
  <el-card>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb> -->
    <mybread firstnav="用户管理" lastnav="用户列表" />
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="search" class="input-with-select select">
        <el-button slot="append" icon="el-icon-search" @click="queryLike"></el-button>
      </el-input>
      <el-button type="success" plain @click="addUsers=true">添加用户</el-button>
    </div>
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column type="index" prop="index" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="stateChange(scope.row.id,scope.row.mg_state)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="handle" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              @click="openEdit(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="success"
              icon="el-icon-check"
              @click="addPower(scope.row.id)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pagenum"
      :page-sizes="[5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="currentchange"
      @size-change="sizechange"
    ></el-pagination>
    <!-- 添加面板 -->
    <el-dialog title="添加用户" :visible.sync="addUsers">
      <el-form :model="addObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="addObj.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="add">添加</el-button>
      </div>
    </el-dialog>
    <!-- 编辑面板 -->
    <el-dialog title="编辑用户" :visible.sync="editUsers">
      <el-form :model="editObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editObj.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsers=false">取 消</el-button>
        <el-button type="primary" @click="edit">编辑</el-button>
      </div>
    </el-dialog>
    <!-- 添加权限面板 -->
    <el-dialog title="分配角色" :visible.sync="addRole">
      {{roleObj.rid}}
      <el-form :model="roleObj">
        <el-form-item label="用户名">
          <label>{{roleObj.username}}</label>
        </el-form-item>
        <el-form-item label="分配角色">
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option :disabled="true" label="请选择角色" :value="-1"></el-option> 
            <el-option :label="item.roleName" :value="item.id" v-for="item in dropObj" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRole = false">取 消</el-button>
        <el-button type="primary" @click="rolePower">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
    
    <script>
export default {
  data() {
    return {
      search: "",
      pagenum: 1,
      pagesize: 5,
      dataList: [],
      total: 0,
      addUsers: false,
      addObj: { username: "", password: "", email: "", mobile: "" },
      editUsers: false,
      editObj: {},
      addRole:false,
      roleObj:{},
      dropObj:{}
    };
  },
  methods: {
    async getAllList() {
      var res = await this.$http.get(
        `/users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`,
        {
          headers: { Authorization: window.localStorage.getItem("token") }
        }
      );
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.dataList = data.users;
        this.total = data.total;
      }
    },
    currentchange(num) {
      this.pagenum = num;
      this.getAllList();
    },
    sizechange(size) {
      this.pagesize = size;
      this.getAllList();
    },
    queryLike() {
      this.getAllList();
    },
    async add() {
      var res = await this.$http.request({
        url: "/users",
        method: "post",
        data: {
          username: this.addObj.username,
          password: this.addObj.password,
          email: this.addObj.email,
          mobile: this.addObj.mobile
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta } = res.data;
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
        this.getAllList();
      } else {
        this.$message.error(meta.msg);
      }
      this.clearAdd(this.addObj);
      this.addUsers = false;
    },
    clearAdd(obj) {
      for (var item in obj) {
        obj[item] = "";
      }
    },
    addCancel() {
      this.addUsers = false;
      this.clearAdd(this.addObj);
    },
    async openEdit(id) {
      this.editUsers = true;
      var res = await this.$http.request({
        url: `users/${id}`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.editObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    async edit() {
      var res = await this.$http.request({
        url: `users/${this.editObj.id}`,
        method: "put",
        data: { email: this.editObj.email, mobile: this.editObj.mobile },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.getAllList();
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
      this.editUsers = false;
    },
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.request({
            url: `/users/${id}`,
            method: "delete",
            headers: {
              Authorization: window.localStorage.getItem("token")
            }
          });
          var { meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            this.getAllList();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async addPower(id){
      this.addRole = true
      this.dropDown()
      var res = await this.$http.request({
        url:`users/${id}`,
        method:'get',
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var {meta,data}= res.data
      if(meta.status ===200){
          this.roleObj = data
      }else{
        this.$message.error(meta.msg)
      }
    },
    async dropDown(){
      var res = await this.$http.request({
        url:`/roles`,
        method:'get',
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var {meta,data}=res.data
      if(meta.status===200){
        this.dropObj = data
      }else{
        this.$message.error(meta.msg)
      }
    },
    async rolePower(){
      var res = await this.$http.request({
        url:`users/${this.roleObj.id}/role`,
        method:'put',
        data:{id:this.roleObj.id,rid:this.roleObj.rid},
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var {meta} = res.data
      if(meta.status === 200){
        this.addRole = false
        this.$message({
          message:meta.msg,
          type:'success'
        })
        this.getAllList()
      }else{
        this.$message.error(meta.msg)
      }
    },
    async stateChange(id,type){
      var res = await this.$http.request({
        url:`/users/${id}/state/${type}`,
        method:'put',
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var{meta,data} = res.data
      if(meta.status===200){
        this.$message({
          message:meta.msg,
          type:'success'
        })
      }else{
        this.$message.error(meta.msg)
      }
    }
  },
  mounted() {
    this.getAllList();
  }
};
</script>
    
<style>
</style>
    