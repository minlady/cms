<template>
  <el-card>
    <mybread firstnav="权限管理" lastnav="角色列表"/>
    <el-row>
      <el-col :span="24">
        <el-button plain>添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="6">
              <el-tag
                closable
                @close="del(scope.row.id,item1.id,scope.row)"
              >{{item1.authName}}-{{item1.id}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="18">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="8">
                  <el-tag
                    closable
                    type="success"
                    @close="del(scope.row.id,item1.id,scope.row)"
                  >{{item2.authName}}-{{item2.id}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="16">
                  <el-tag
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    @close="del(scope.row.id,item1.id,scope.row)"
                  >{{item3.authName}}-{{item3.id}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">没有权限数据</el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="权限管理" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini" @click="checkedRights(scope.row.children,scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限面板 -->
    <el-dialog title="分配权限" :visible.sync="roleBar">
      <el-tree
        :data="allRoles"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultChecked"
        :props="defaultProps"
        :default-expand-all="true"
        ref="mytree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleBar = false">取 消</el-button>
        <el-button type="primary" @click="roleChange">添加</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      roleBar: false,
      allRoles:[],
      defaultProps:{
          label:'authName',
          children:'children'
      },
      defaultChecked:[],
      roleid:''
    };
  },
  methods: {
    async rolesGet() {
      var res = await this.$http.request({
        url: "roles",
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.roleList = data;
        console.log(data);
      } else {
        this.$message.error(meta.msg);
      }
    },
    async del(roleid, rightid, alldata) {
      var res = await this.$http.request({
        url: `roles/${roleid}/rights/${rightid}`,
        method: "delete",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        alldata.children = data;
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
    },
    async roleGive() {
      this.roleBar = true;
      var res = await this.$http.request({
        url: `rights/tree`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
          this.allRoles = data
      }else{
          this.$message.error(meta.msg)
      }
    },
    checkedRights(rights,id){
      this.defaultChecked = []
      this.roleid=id
      this.roleBar = true
      this.roleGive()
      rights.forEach(item1=>{
        item1.children.forEach(item2=>{
          item2.children.forEach(item3=>{
            this.defaultChecked.push(item3.id)
          })
        })
      })
    },
    async roleChange(){
      var allcheck = this.$refs.mytree.getCheckedKeys()
      var halfcheck = this.$refs.mytree.getHalfCheckedKeys()
      var newArr = allcheck.concat(halfcheck)
      var str = newArr.join(',')
      // 提交数据
      var res = await this.$http.request({
        url:`roles/${this.roleid}/rights`,
        method:'post',
        data:{rids:str},
        headers:{
          Authorization: window.localStorage.getItem("token")
        }
      })
      var {meta,data} = res.data
      if(meta.status === 200){
        this.$message({
          message:meta.msg,
          type:'success'
        })
      }else{
        this.$message.error(meta.msg)
      }
       this.roleBar=false
       this.rolesGet()
    }
  },
  mounted() {
    this.rolesGet();
  }
};
</script>

<style>
</style>
