<template>
  <div class="pending">
    <div class="formSearch">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="优惠券名称">
          <el-input v-model="formInline.couponName" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="formInline.couponType" placeholder="请选择优惠券类型">
            <el-option label="全部" :value="null" />
            <el-option label="满减券" value="1" />
            <el-option label="折扣券" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.state" placeholder="请选择优惠券状态">
            <el-option label="全部" :value="null" />
            <el-option label="未开始" value="0" />
            <el-option label="进行中" value="1" />
            <el-option label="已结束" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="formInline.dates"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
          <el-button type="primary" plain @click="clear">重置</el-button>
          <el-button type="primary" plain @click="addCoupon">新增</el-button>
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
        <el-table-column label="优惠券名称" width="220">
          <template slot-scope="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column label="类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.couponType === 1">满减券</span>
            <span v-if="scope.row.couponType === 2">折扣券</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">未开始</span>
            <span v-if="scope.row.state === 1">进行中</span>
            <span v-if="scope.row.state === 2">已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button v-if="scope.row.state === 0" type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.state !== 0" type="text" @click="showData(scope.row.shopCouponId)">数据</el-button>
              <el-popconfirm v-if="scope.row.state === 0 || scope.row.state === 2" title="确定删除此券？" @onConfirm="delCouponFn(scope.row)">
                <el-button slot="reference" class="delCls" type="text">删除</el-button>
              </el-popconfirm>
              <el-popconfirm v-if="scope.row.state === 1" title="是否停止此活动？" @onConfirm="stopFn(scope.row.shopCouponId)">
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
      title="数据效果"
      :visible.sync="isDataVisible"
      width="50%"
      top="50px"
      class="group-dialog"
    >
      <!-- 表格 -->
      <div class="dataEffect">
        <h3>数据统计至昨日</h3>
        <div class="couponTit">优惠券名称：{{ dataInfo.couponName }}</div>
        <div class="couponTit">
            优惠券总数：{{dataInfo.couponTotal?dataInfo.couponTotal:'0'}} 张，已领取 {{dataInfo.received?dataInfo.received:'0'}} 张
        </div>
        <div class="dataListBox">
          <div class="dataItem">
            <span>¥{{ dataInfo.total }}</span>
            <p>用券成交总额</p>
          </div>
          <div class="dataItem">
            <span>¥{{ dataInfo.useMoney }}</span>
            <p>使用优惠券总额</p>
          </div>
          <div class="dataItem">
            <span>{{ dataInfo.count }}件</span>
            <p>购买商品总数</p>
          </div>
        </div>
        <div class="tabListInfo">使用该优惠券购买的商品</div>
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
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCoupon, delCoupon, getCouponData, stopCoupon } from '@/api/marketing'
export default {
  name: 'Coupon',
  data() {
    return {
      formInline: {
        couponName: '', // 优惠券名称
        couponType: null, // 优惠券类型
        dates: [], // 创建时间数组
        endTime: '', // 创建时间结束时间
        page: 1, // 当前页
        pageSize: 10, // 每页记录数
        startTime: '', // 创建时间开始时间
        state: null // 优惠券状态
      },
      isDataVisible: false, // 数据效果展示
      dataInfo: [], // 商品使用数据
      total: 1,
      tableData: [],
      dataEffect: [],
      currentPage: 1
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
      if (this.formInline.dates.length !== 0) {
        this.formInline.startTime = this.formInline.dates[0]
        this.formInline.endTime = this.formInline.dates[1]
      }
      this.getAll(this.formInline)
    },
    // 清除
    clear() {
      this.formInline = {
        couponName: '', // 优惠券名称
        couponType: null, // 优惠券类型
        dates: [], // 创建时间数组
        endTime: '', // 创建时间结束时间
        page: 1, // 当前页
        pageSize: 10, // 每页记录数
        startTime: '', // 创建时间开始时间
        state: null // 优惠券状态
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
        name: 'addCoupon',
        query: { shopCouponId: item.shopCouponId }
      })
    },
    // 停止优惠券活动
    stopFn(id) {
      stopCoupon({ shopCouponId: id }).then(res => {
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
    addCoupon() {
      this.$router.push({
        name: 'addCoupon'
      })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await getCoupon(formInline)
      this.total = res.data.total
      this.tableData = res.data.list
    },
    // 显示数据效果
    showData(id) {
      getCouponData({ shopCouponId: id }).then(res => {
        if (res.code === '') {
          this.dataInfo = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
      this.isDataVisible = true
    },
    // 删除优惠券
    delCouponFn(data) {
      console.log(data)
      delCoupon({ shopCouponId: data.shopCouponId }).then(res => {
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
</style>
<style scoped>
.btnList /deep/ .delCls {
  margin-left: 10px;
}
.group-dialog /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
</style>
