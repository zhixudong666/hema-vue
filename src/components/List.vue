<template>
  <div class="list">
    <!--操作-->
    <div class="section">
      <el-button size="mini" type="primary" @click="addProduct">添加商品<i class="el-icon-plus el-icon--right"></i></el-button>
      <el-button size="mini" type="danger" @click="removeAll">批量删除<i class="el-icon-delete el-icon--right"></i>
      </el-button>
    </div>

    <!-- 搜索条件 -->
    <div class="section">
      <el-row :gutter="20">
        <!--搜索关键字-->
        <el-col :span="6">
          <el-input size="mini" v-model="filter.keyword" placeholder="输入商品名称"></el-input>
        </el-col>
        <!--分类检索-->
        <el-col :span="3">
          <el-cascader
            :props="{label:'name',value:'id'}"
            size="mini"
            placeholder="请选择分类"
            :options="categories"
            v-model="filter.category"
          >
          </el-cascader>
        </el-col>
        <!-- 价格区间检索 -->
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <el-select size="mini" v-model="filter.price_area" placeholder="请选择价格区间">
              <el-option
                v-for="(item,index) in price_areas"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="3">
          <el-button size="mini" @click="search" icon="el-icon-search" circle></el-button>

          <el-button size="mini" @click="refresh" icon="el-icon-refresh" circle></el-button>

        </el-col>
      </el-row>
    </div>

    <!-- 列表 -->
    <el-table
      @selection-change="handleSelectionChange"
      :data="products"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="spu">
              <span>{{ props.row.spu }}</span>
            </el-form-item>
            <el-form-item label="sku">
              <span>{{ props.row.sku }}</span>
            </el-form-item>
            <el-form-item label="库存">
              <span>{{ props.row.qty }}</span>
            </el-form-item>
            <el-form-item label="成本价">
              <span>{{ props.row.coust_price }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shop_id }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.short_desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="商品 ID"
        prop="id">
      </el-table-column>

      <el-table-column
        label="图片"
        >
        <template slot-scope="props">
          <img :src="props.row.image" alt="" style="width:30px;">
        </template>
      </el-table-column>

      <el-table-column
        label="商品名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="价格"
        prop="price">
      </el-table-column>
      <el-table-column
        label="特价"
        prop="special_price">
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="props">
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click = "edit(props.row.id)"></el-button>
          <el-button size="mini" @click="remove(props.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="section">
        <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handelSizeChange"
                :current-page="page"
                :page-sizes="[4,50,100, 200, 300, 400]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" style="">
        </el-pagination>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        s: false,//是否搜索
        filter: {
          // 搜索关键字
          keyword: '',
          // 当前选中的分类
          category: [],
          // 选中的价格区间
          price_area: 0,
        },

        // 所有分类
        categories: [],
        // 所有的价格区间
        price_areas: [{label: '全部', value: 0}, {label: '0-20', value: 1}, {label: '20-40', value: 2}, {
          label: '40以上',
          value: 3
        }],
        checked_ids: [],//选中所有要删除的选项
        // 当前页数
        page: 1,
        // 一页显示几个
        pageSize: 4,
        // 总条数数
        total: 0,
        // 所有商品
        products: [],
      }
    },
    watch: {
        //监听page
      page: function () {
        if (this.s) {
          this.searchData();
        } else {
          this.fetchData();
        }
      }
    },
    methods: {
        //搜索数据
      searchData() {
        let o = {
          page: this.page,
          pageSize: this.pageSize,
        };
        if (this.filter.keyword) {//筛选
          o.keyword = this.filter.keyword
        }
        if (this.filter.category.length) {
          o.category = this.filter.category.join(',');
        }
        o.price_area = this.filter.price_area;
        axios({
          url: '/api/admin/product/search',
          params: o
        }).then(res => {
          this.total = res.data.total;
          this.products = res.data.products;
        })
      },
      refresh() {
        this.s = false;
        this.filter = {
          // 搜索关键字
          keyword: '',
          // 当前选中的分类
          category: [],
          // 选中的价格区间
          price_area: 0,
        };
        this.page = 1;
        this.fetchData();
      },
      // 检索
      search() {
        this.s = true;
        this.page = 1;
        this.searchData();
      },
      // 改变当前页
      handleCurrentChange(val) {
        this.page = val;
      },
      // 改变每页显示条数
      handelSizeChange(val) {
        this.pageSize = val;
      },
      // 勾选时调用的函数
      handleSelectionChange(val) {
        this.checked_ids = val.map(v => v.id);
      },
      // 删除所有选中商品
      removeAll() {
        if (this.checked_ids.length) {
          this.$confirm('确认删除？此操作不可恢复', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(() => {
            axios({
              url: '/api/admin/product/product',
              method: 'delete',
              data: {
                ids: JSON.stringify(this.checked_ids)
              }
            }).then(res => {
              if (this.s) {
                this.searchData();
              } else {
                this.fetchData();
              }
            })
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请选中商品'
          });
        }


      },
      //添加商品
      addProduct(){
        this.$router.push({path:'/add'});
      },
      // 删除单个商品
      remove(id) {
        this.$confirm('确认删除？此操作不可恢复', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          axios({
            url: '/api/admin/product/product',
            method: 'delete',
            data: {
              id: id
            }
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            if (this.s) {
              this.searchData();
            } else {
              this.fetchData();
            }
          })
        })
      },
      edit(id){
        this.$router.push(`/edit/${id}`);
      },
      //
      fetchData() {
        axios({
          url: '/api/admin/product/product',
          params: {
            page: this.page,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.total = res.data.total;
          this.products = res.data.products;
        })
      }
    },
    mounted() {
      this.fetchData();
      axios('/api/admin/category/all').then(res => {
        let fn =  id => {
          let r = [];
          res.data.forEach( v => {
            if(v.parent_id === id){
              let o = {
                id: v.id,
                name: v.name,
              };
              let children = fn(v.id);
              if(children.length){
                o.children = children
              }
              r.push(o);
            }
          });
          return r;
        };
        this.categories = fn(0);
      })
    }
  }
</script>
<style scoped>
  .section {
    margin: 10px 0;
  }

  .demo-table-expand {
    font-size: 0;
    padding-left: 60px;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .list{
    padding:10px 0 10px 20px;
    box-sizing: border-box;
  }
  .el-pagination{
    text-align: center;
  }
</style>