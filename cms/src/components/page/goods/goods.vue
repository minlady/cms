<template>
  <el-card>
    <mybread firstnav="商品管理" lastnav="商品列表"/>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="search" class="input-with-select select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain @click="add">添加商品</el-button>
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" width="180"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.upd_time | dateformat}}
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
              ></el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
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
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      search:'',
      pagenum:1,
      pagesize:10,
      total:0
    };
  },
  methods: {
    async getAllGoods() {
      var res = await this.$http.get(
        `/goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      }else{
        this.$message.error(meta.msg)
      }
    },
    currentchange(num){
      this.pagenum = num
      this.getAllGoods()
    },
    sizechange(size){
      this.pagesize = size
      this.getAllGoods()
    },
    add(){
      this.$router.push('/goods/add')
    }
  },
  mounted(){
    this.getAllGoods()
  }
};
</script>

<style>
</style>
