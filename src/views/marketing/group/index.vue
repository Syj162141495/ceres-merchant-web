<template>
  <div class="pending">
    <div class="formSearch">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="活动名称">
          <el-input v-model="formInline.groupName" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.state" placeholder="请选择状态">
            <el-option label="全部" :value="null" />
            <el-option label="未开始" value="0" />
            <el-option label="进行中" value="1" />
            <el-option label="已结束" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
          <el-button type="primary" plain @click="clear">重置</el-button>
          <el-button type="primary" plain @click="addGroupBuy">新增</el-button>
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
          <template slot-scope="scope">{{ scope.row.groupName }}</template>
        </el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">未开始</span>
            <span v-if="scope.row.state === 1">进行中</span>
            <span v-if="scope.row.state === 2">已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="活动内容" show-overflow-tooltip />
        <el-table-column prop="startTime" label="活动开始时间" show-overflow-tooltip />
        <el-table-column prop="endTime" label="活动结束时间" show-overflow-tooltip />
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button v-if="scope.row.state === 0" type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.state !== 0" type="text" @click="showData(scope.row.shopGroupWorkId)">数据</el-button>
              <el-popconfirm v-if="scope.row.state === 0 || scope.row.state === 2" title="确定删除此活动？" @onConfirm="delGroupBuyFn(scope.row)">
                <el-button slot="reference" class="delCls" type="text">删除</el-button>
              </el-popconfirm>
              <el-popconfirm v-if="scope.row.state === 1" title="确定停止此活动？" @onConfirm="stopFn(scope.row.shopGroupWorkId)">
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
    <el-dialog
      :close-on-click-modal="false"
      title="数据效果（拼团）"
      :visible.sync="isDataVisible"
      width="55%"
      top="50px"
      class="group-dialog"
    >
      <!-- 表格 -->
      <div class="dataEffect">
        <h3>实时统计</h3>
        <div class="couponTit">活动名称：{{ dataInfo.groupName }}</div>
        <div class="dataListBox">
          <div class="dataItem">
            <span>{{ dataInfo.total }}</span>
            <p>成团数量</p>
          </div>
          <div class="dataItem">
            <span v-text="dataInfo.conversion === null ? '0' : dataInfo.conversion" />
            <p>拉新转化数</p>
          </div>
          <div class="dataItem">
            <span>￥{{ dataInfo.money }}</span>
            <p>活动售出金额</p>
          </div>
        </div>
        <div class="tabListInfo">活动成交的商品</div>
        <div class="tableBox">
          <el-table
            ref="multipleTable"
            :data="dataInfo.products"
            border
            height="150"
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column prop="productName" label="商品名称" show-overflow-tooltip />
            <el-table-column prop="number" label="付款件数" show-overflow-tooltip />
            <el-table-column prop="users" label="付款人数" show-overflow-tooltip />
          </el-table>
          <div class="pagination">
            <el-pagination
              :current-page="activeDataParams.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="activeDataTotal"
              @size-change="activeDataSizeChange"
              @current-change="activeDataCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { groupBuyList, deleteGroup, stopGroupBuy, getGroupData } from '@/api/marketing'
export default {
  name: 'Coupon',
  data() {
    return {
      formInline: {
        groupName: '', // 拼团活动名称
        page: 1, // 当前页
        pageSize: 10, // 每页记录数
        state: null // 拼团活动状态
      },
      isDataVisible: false, // 数据效果展示
      total: 1,
      tableData: [],
      currentPage: 1,
      dataInfo: [], // 详细数据
      activeDataParams: {
        shopSeckillId: '', // 活动id
        page: 1, // 当前页
        pageSize: 10 // 每页记录数
      },
      activeDataTotal: 0
    }
  },
  mounted() {
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
        couponName: '', // 拼团名称
        couponType: null, // 拼团类型
        dates: [], // 创建时间数组
        endTime: '', // 创建时间结束时间
        page: 1, // 当前页
        pageSize: 10, // 每页记录数
        startTime: '', // 创建时间开始时间
        state: null // 拼团状态
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
        name: 'addGroupBuy',
        query: { shopGroupWorkId: item.shopGroupWorkId }
      })
    },
    addGroupBuy() {
      this.$router.push({
        name: 'addGroupBuy'
      })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await groupBuyList(formInline)
      this.total = res.data.total
      this.tableData = res.data.list
    },
    // 停止拼团券活动
    stopFn(id) {
      stopGroupBuy({ shopGroupWorkId: id }).then(res => {
        if (res.code === '') {
          this.$message({
            message: '停止成功',
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
    // 删除拼团活动
    delGroupBuyFn(data) {
      console.log(data)
      deleteGroup({ shopGroupWorkId: data.shopGroupWorkId }).then(res => {
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
    // 显示数据效果
    showData(id) {
      this.getActiveData(id)
      this.isDataVisible = true
    },
    // 获取活动数据
    getActiveData(id) {
      if (id) {
        this.activeDataParams.shopSeckillId = id
      }
      getGroupData(this.activeDataParams).then(res => {
        if (res.code === '') {
          this.dataInfo = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    activeDataSizeChange(val) {
      this.activeDataParams.pageSize = val
      this.getActiveData()
    },
    activeDataCurrentChange(val) {
      this.activeDataParams.page = val
      this.getActiveData()
    }
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
.pagination{
  padding-top: 20px;
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
