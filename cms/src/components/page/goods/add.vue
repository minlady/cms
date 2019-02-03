<template>
  <el-card>
    <div class="mybread">
      <mybread firstnav="商品管理" lastnav="商品列表"/>
    </div>
    <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
    <el-steps :active="active" finish-status="success" class="step" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs @tab-click="tabclick" tab-position="left">
      <el-tab-pane label="基本信息">
        <el-form label-position="top" label-width="80px" :model="baseInfo">
          <el-form-item label="商品名称">
            <el-input v-model="baseInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="baseInfo.region"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="baseInfo.type"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="baseInfo.number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{dropdownList}}
            <el-cascader :options="cateList" v-model="dropdownList" :props="props"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <div v-for="item in manyParams" :key="item.attr_id">
          <p>{{item.attr_name}}</p>
          <div>
            <el-checkbox
              v-for="(item1, index) in item.attr_vals.split(',')"
              :key="index"
              v-model="checked"
              :label="item1"
              border
            ></el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <div v-for="item in onlyParams" :key="item.attr_id">
          <div class="paramsName">{{item.attr_name}}</div>
          <el-input v-model="item.attr_vals"></el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList2"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      baseInfo: {},
      dropdownList: [],
      cateList: [],
      props: {
        value: "cat_id",
        label: "cat_name"
      },
      manyParams: [],
      onlyParams: [],
      checked: true
    };
  },
  methods: {
    tabclick(e) {
      console.log(e);
      this.active = Number(e.index);
      if (e.index === "1") {
        this.getParams("many");
      }
      if (e.index === "2") {
        this.getParams("only");
      }
    },
    async getAllCate() {
      var res = await this.$http.get("categories");
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.cateList = data;
        // console.log(data);
      } else {
        this.$message.error(meta.msg);
      }
    },
    async getParams(sel) {
      if (this.dropdownList.length === 0) {
        this.$message.error("请选择商品分类");
      }
      var res = await this.$http.get(
        `categories/${
          this.dropdownList[this.dropdownList.length - 1]
        }/attributes?sel=${sel}`
      );
      var { meta, data } = res.data;
      if (meta.status === 200) {
        if (sel === "many") {
          this.manyParams = data;
        } else {
          this.onlyParams = data;
        }
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getAllCate();
  }
};
</script>

<style>
.mybread {
  margin-bottom: 20px;
}
.step {
  margin: 20px 0;
}
.el-step__title {
  font-size: 12px;
}
.paramsName {
  margin: 20px 0;
}
</style>
