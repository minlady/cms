<template>
  <el-card>
    <mybread firstnav="权限管理" lastnav="权限列表"/>
    <el-table :data="rightList" border style="margin-top:20px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == '0'">一级</span>
          <span v-if="scope.row.level == '1'">二级</span>
          <span v-if="scope.row.level == '2'">三级</span>
        </template>
      </el-table-column>
      
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    };
  },
  methods: {
    async getAllList() {
      var res = await this.$http.request({
        url: `rights/list`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.rightList = data;
      } else {
        this.$message.error(meta.msg);
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
