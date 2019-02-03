<template>
  <div class="login">
    <div class="box">
      <h2>用户登录</h2>
      <el-form
        :model="obj"
        status-icon
        :rules="rules"
        ref="obj"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="obj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="obj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="myBtn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: { username: "", password: "" },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //   login() {
    //     this.$http.post("/login", this.obj).then(res => {
    //       var { meta } = res.data;
    //       if (meta.status === 200) {
    //         this.$message({
    //           showClose: true,
    //           message: meta.msg,
    //           type: "success"
    //         });
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: meta.msg,
    //           type: "error"
    //         })
    //       }
    //     })
    //   }
    login() {
      this.$refs.obj.validate(async valid => {
        if (valid) {
          var res = await this.$http.post("/login", this.obj);
          var { meta,data } = res.data;
          if (meta.status === 200) {
            window.localStorage.setItem('token',data.token)
            this.$router.push('/home')
            this.$message({
              message: meta.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: meta.msg,
              type: "error"
            });
          }
        } else {
          this.$message({
            message:'参数填写不正确 ',
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background-color: #2c3742;
  position: relative;
}
.box {
  position: absolute;
  width: 500px;
  padding: 40px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.box h2 {
  margin-bottom: 20px;
}
.box .myBtn {
  width: 100%;
}
</style>
