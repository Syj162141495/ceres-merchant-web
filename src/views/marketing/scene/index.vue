<template>
  <div class="pending">
    <div class="formSearch">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
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
        <el-table-column label="活动名称" prop="sceneName" width="220">
        </el-table-column>
        <el-table-column label="营销类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sceneType === 1">节日营销</span>
            <span v-if="scope.row.sceneType === 2">会员日营销</span>
            <span v-if="scope.row.sceneType === 3">生日营销</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" prop="time" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">未开始</span>
            <span v-if="scope.row.state === 1">进行中</span>
            <span v-if="scope.row.state === 2">已停止</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-popconfirm v-if="scope.row.state !== 1" title="是否确定删除该场景营销？" @onConfirm="delScene(scope.row)">
                <el-button slot="reference" class="delCls" type="text">删除</el-button>
              </el-popconfirm>
              <el-popconfirm v-if="scope.row.state === 2" title="是否确定启动该场景营销？" @onConfirm="startStopFn(scope.row)">
                <el-button slot="reference" class="delCls" type="text">启动</el-button>
              </el-popconfirm>
              <el-popconfirm v-if="scope.row.state === 1" title="是否确定停止该场景营销？" @onConfirm="startStopFn(scope.row)">
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
  </div>
</template>

<script>
import {
  getShopId
} from '@/utils/auth'
import { getSceneInfo, sceneDelete, sceneStart, sceneStop } from '@/api/marketing'
export default {
  name: 'Coupon',
  data() {
    return {
      formInline: {
        page: 1, // 当前页
        pageSize: 10 // 每页记录数
      },
      total: 1,
      tableData: [],
      currentPage: 1,
      shopId: 0
    }
  },
  mounted() {
    // this.formInline.shopId = getShopId()
    this.shopId = parseInt(getShopId())
    this.getAll(this.formInline)
  },
  methods: {
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
        name: 'addScene',
        query: { sceneId: item.sceneId }
      })
    },
    // 停止优惠券活动
    startStopFn(row) {
      if (row.state === 1){
        sceneStop({ sceneId: row.sceneId, shopId: this.shopId }).then(res => {
          if (res.code === '') {
            this.$message({
              message: '停止成功',
              type: 'success'
            })
            this.formInline.page = 1
            this.getAll(this.formInline)
          }
        })
      } else {
        sceneStart({ sceneId: row.sceneId, shopId: this.shopId }).then(res => {
          if (res.code === '') {
            this.$message({
              message: '启用成功',
              type: 'success'
            })
            this.formInline.page = 1
            this.getAll(this.formInline)
          }
        })
      }

    },
    addCoupon() {
      this.$router.push({
        name: 'addScene'
      })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await getSceneInfo(formInline)
      this.total = res.data.total
      this.tableData = res.data.list
    },
    // 删除
    delScene(data) {
      sceneDelete({ sceneId: data.sceneId }).then(res => {
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
