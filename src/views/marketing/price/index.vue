<template>
  <div class="pending">
    <div class="formSearch">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
<!--        <el-form-item label="活动名称">-->
<!--          <el-input v-model="formInline.groupName" placeholder="请输入内容" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="状态">-->
<!--          <el-select v-model="formInline.state" placeholder="请选择状态">-->
<!--            <el-option label="全部" :value="null" />-->
<!--            <el-option label="未开始" value="0" />-->
<!--            <el-option label="进行中" value="1" />-->
<!--            <el-option label="已结束" value="2" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item>
<!--          <el-button type="primary" plain @click="search">查询</el-button>-->
<!--          <el-button type="primary" plain @click="clear">重置</el-button>-->
          <el-button type="primary" plain @click="addPrice">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="活动名称" width="220">
          <template slot-scope="scope">{{ scope.row.composeName }}</template>
        </el-table-column>
        <el-table-column prop="time" label="活动时间" show-overflow-tooltip />
        <el-table-column prop="number" label="商品数量" show-overflow-tooltip />
        <el-table-column prop="rules" label="活动规则" show-overflow-tooltip />
        <el-table-column label="活动状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">未开始</span>
            <span v-if="scope.row.state === 1">进行中</span>
            <span v-if="scope.row.state === 2">已结束</span>
            <span v-if="scope.row.state === 3">已停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button v-if="scope.row.state === 0 || scope.row.state === 3" type="text" @click="edit(scope.row)">编辑</el-button>
<!--              <el-button v-if="scope.row.state !== 0" type="text" @click="showData(scope.row.shopGroupWorkId)">数据</el-button>-->
              <el-popconfirm v-if="scope.row.state !== 1" title="确定删除此活动？" @onConfirm="delPrice(scope.row)">
                <el-button slot="reference" class="delCls" type="text">删除</el-button>
              </el-popconfirm>
              <el-popconfirm v-if="scope.row.state === 3" title="确定启用此活动？" @onConfirm="stopFn(scope.row)">
                <el-button slot="reference" class="delCls" type="text">启用</el-button>
              </el-popconfirm>
              <el-popconfirm v-if="scope.row.state === 1" title="确定停止此活动？" @onConfirm="stopFn(scope.row)">
                <el-button slot="reference" class="delCls" type="text">停止</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 新建分组弹框 -->
  </div>
</template>

<script>
import {
  getShopId
} from '@/utils/auth'
import { getPriceList, priceDelete, priceStart } from '@/api/marketing'
export default {
  name: 'Coupon',
  data() {
    return {
      formInline: {
        page: 1, // 当前页
        pageSize: 10 // 每页记录数
      },
      isDataVisible: false, // 数据效果展示
      total: 1,
      tableData: [],
      currentPage: 1
    }
  },
  mounted() {
    this.formInline.shopId = parseInt(getShopId())
    this.getAll(this.formInline)
  },
  methods: {
    //  查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 清除
    clear() {
      this.formInline = {
        page: 1, // 当前页
        pageSize: 10 // 每页记录数
      }
      this.getAll(this.formInline)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    // 编辑
    edit(item) {
      this.$router.push({
        name: 'addPrice',
        query: { priceId: item.priceId }
      })
    },
    addPrice() {
      this.$router.push({
        name: 'addPrice'
      })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await getPriceList(formInline)
      this.total = res.data.total
      this.tableData = res.data.list
    },
    // 启停活动
    stopFn(row) {
      const state = row.state === 1 ? 3 : 1
      priceStart({ priceId: row.priceId, state: state }).then(res => {
        if (res.code === '') {
          this.$message({
            message: row.state === 1 ?'停止成功':'启用成功',
            type: 'success'
          })
          this.formInline.page = 1
          this.getAll(this.formInline)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 删除活动
    delPrice(data) {
      console.log(data)
      priceDelete({ priceId: data.priceId }).then(res => {
        if (res.code === '') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.formInline.page = 1
          this.getAll(this.formInline)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
  }
}
</script>

<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");

.pending {
  padding: 30px;
}
.fenye {
  margin-top: 20px;
}
.dataEffect {
  .couponTit {
    margin: 20px 0;
  }
  .dataListBox {
    display: flex;
    justify-content: center;
    margin: 30px 0;
    .dataItem {
      width: 220px;
      height: 120px;
      border-radius: 8px;
      border: 1px solid #999999;
      text-align: center;
      margin: 0 10px;
      span {
        display: block;
        margin-top: 35px;
      }
    }
  }
  .tabListInfo {
    margin: 20px 0;
  }
}
</style>
<style scoped>
.btnList /deep/ .delCls {
  margin-left: 10px;
}
.group-dialog /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
</style>
