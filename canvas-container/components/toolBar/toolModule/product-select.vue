<template>
  <div class="product-select">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formData.keyword" placeholder="店铺名称/商品ID/商品分组"></el-input>
      </el-form-item>
<!--      <el-form-item label="上架状态">-->
<!--        <el-select v-model="formData.status" placeholder="请选择">-->
<!--          <el-option label="全部" value=""></el-option>-->
<!--          <el-option label="上架" value="1"></el-option>-->
<!--          <el-option label="下架" value="0"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="官方分类">
        <el-cascader
          ref="cascader"
          v-model="formData.categoryId"
          :options="categoryList"
          :props="{ checkStrictly: true,label: 'categoryName',value: 'id',children: 'childs' }"
          clearable></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      max-height="500"
      border
      row-key="productId"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        v-if="isMultiple"
        width="40"
        type="selection"
        :reserve-selection="true"
        fixed="left"
      >
      </el-table-column>
      <el-table-column label="" width="40" align="center" v-else>
        <template slot-scope="scope">
          <el-radio v-model="tableRadio" :label="scope.row"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="产品主图" width="180" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.image"
            fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="产品ID">
      </el-table-column>
      <el-table-column
        prop="price"
        label="售价">
      </el-table-column>
      <el-table-column
        prop="originalPrice"
        label="原价">
      </el-table-column>
      <el-table-column
        prop="stockNumber"
        label="库存">
      </el-table-column>
      <el-table-column
        prop="number"
        label="销量">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :hide-on-single-page="true"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import api from '@@/components/canvasShow/config/api'
  import {sendReqMixin} from '@@/components/canvasShow/config/mixin'
  import {checkEmptyChild} from '@@/config/common'
  import Cookies from 'js-cookie'
  import { mapGetters } from 'vuex'
  export default {
    name: 'product-select',
    mixins: [sendReqMixin],
    data () {
      return {
        tableRadio: '',
        formData: {
          keyword: '',
          status: '',
          categoryId: ''
        },
        currentPage: 1,
        total: 0,
        pageSize: 10,
        categoryList: [],
        tableData: [],
        multipleSelection: []
      }
    },
    props: {
      selectedRows: {
        type: Array,
        default: () => []
      },
      isMultiple: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.getCategory()
      this.getTableData()
    },
    computed: {
      ...mapGetters([
        'typeId'
      ])
    },
    methods: {
      // 获取类别
      getCategory () {
        var _this = this
        let params = {
          url: api.getClassify,
          method: 'GET'
        }
        this.sendReq(params, (res) => {
          _this.categoryList = res.data
          checkEmptyChild(_this.categoryList)
        })
      },
      // 获取产品信息
      getTableData () {
        var _this = this
        var paramsUrl = `${api.getProducts}?page=${this.currentPage}&pageSize=${this.pageSize}&shelveState=1`
        if (this.formData.keyword) {
          paramsUrl += `&search=${this.formData.keyword}`
        }
        let shopId = parseInt(Cookies.get('cereShopId'))
        if (shopId && this.typeId===3) {
          paramsUrl += `&shopId=${shopId}`
        }
        let nodesObj = this.$refs['cascader'].getCheckedNodes()
        if (nodesObj && nodesObj.length !== 0) {
          var categoryId = nodesObj[0].value
          paramsUrl += `&classifyId=${categoryId}`
        }
        let params = {
          url: paramsUrl,
          method: 'GET'
        }
        this.sendReq(params, (res) => {
          _this.tableData = res.data.list
          _this.total = res.data.total
          // 表格斌值
          // if(_this.selectedRows.length > 0){
          //   _this.selectedRows.forEach(row => {
          //     this.$refs.multipleTable.toggleRowSelection(row,true);
          //   });
          // }
        })
      },
      // 搜索
      onSubmit () {
        this.getTableData()
      },
      // 每页条数改变
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableData()
      },
      // 当前页改变
      handleCurrentChange (val) {
        this.currentPage = val
        this.getTableData()
      },
      // 多选改变
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

<style lang="scss" scoped>
  .product-select{
    .el-pagination{
      padding: 0px;
      margin-top: 30px;
    }
    .el-table{
      .img{
        width: 80px;
        height: 80px;
      }
    }
  }
</style>
