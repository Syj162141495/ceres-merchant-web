<template>
  <div class="pending tagList">
    <div class="formSearch">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="人群名称" class="tagNameStyle">
          <el-input v-model="formInline.crowdName" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="tagCustomer" label="客户数量">
          <el-input v-model="formInline.min" /><span>至</span><el-input v-model="formInline.max" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
          <el-button type="primary" plain @click="clear">重置</el-button>
          <el-button type="primary" plain @click="addClustering">新建人群</el-button>
          <el-button type="primary" plain @click="delClusteringFn(id = null)">删除</el-button>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column prop="crowdName" label="人群名称" show-overflow-tooltip />
        <el-table-column prop="content" label="人群定义" show-overflow-tooltip />
        <el-table-column prop="users" label="人群数量" show-overflow-tooltip />
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button type="text" @click="edit(scope.row.shopCrowdId)">编辑</el-button>
              <el-button type="text" @click="seeCustomer(scope.row.shopCrowdId)">查看客户</el-button>
              <el-popconfirm title="确认要删除此人群？" @onConfirm="delClusteringFn(scope.row.shopCrowdId)">
                <el-button slot="reference" class="delCls" type="text">删除</el-button>
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
      title="人群客户"
      :visible.sync="isDataVisible"
      width="50%"
      top="50px"
      class="group-dialog"
    >
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="customerData"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column prop="name" label="客户昵称" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip />
          <el-table-column prop="frequency" label="消费次数" show-overflow-tooltip />
          <el-table-column prop="total" label="累计消费金额（元）" show-overflow-tooltip />
          <el-table-column prop="lastTime" label="上次消费时间" show-overflow-tooltip />
          <el-table-column prop="time" label="成为客户时间" show-overflow-tooltip />
          <el-table-column prop="labelName" label="客户标签" show-overflow-tooltip />
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btnList">
                <el-button type="text" @click="showDetail(scope.row.buyerUserId)">详情</el-button>
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
            :total="customerTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, getCrowd, deleteCrowd } from '@/api/customer'
export default {
  name: 'TagList',
  data() {
    return {
      formInline: {
        crowdName: '',
        max: '',
        min: '',
        page: 1,
        pageSize: 10,
        shopCrowdId: null
      },
      isDataVisible: false, // 数据效果展示
      total: 1,
      customerTotal: 1,
      currentId: '', // 当前标签ID
      tableData: [],
      customerData: [],
      currentPage: 1,
      multipleSelection: [],
      addFormRules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getCrowdAll(this.formInline)
  },
  methods: {
    //  查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getCrowdAll(this.formInline)
    },
    // 清除
    clear() {
      this.formInline = {
        crowdName: '', // 名称
        min: null, // 最小
        max: null, // 最大
        page: 1, // 当前页
        pageSize: 10 // 每页记录数
      }
      this.getCrowdAll(this.formInline)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getCrowdAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getCrowdAll(this.formInline)
    },
    // 编辑
    edit(id) {
      if (id) {
        this.$router.push({ name: 'addClustering', query: { shopCrowdId: id }})
      }
    },
    addClustering() {
      this.$router.push({ name: 'addClustering' })
    },
    closeAddTag() {
      this.isDataVisible = false
    },
    // 初始化查询所有数据
    async getCrowdAll(formInline) {
      const res = await getCrowd(formInline)
      this.total = res.data.total
      this.tableData = res.data.list
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    delClusteringFn(id) {
      var ids = []
      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(item => {
          ids.push(item.shopCrowdId)
        })
        if (ids.length === 0) {
          this.$message({
            message: '请选择要删除的人群',
            type: 'warning'
          })
          return false
        }
      }
      console.log(ids, 'ids')
      deleteCrowd({ ids }).then(res => {
        if (res.code === '') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.formInline.page = 1
          this.getCrowdAll(this.formInline)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    seeCustomer(id) {
      getUsers({ shopCrowdId: id }).then(res => {
        if (res.code === '') {
          if (res.data.length) {
            this.customerData = res.data
            this.customerTotal = res.data.total
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
      this.isDataVisible = true
    },
    showDetail(id) {
      this.$router.push({ name: 'customerDetail', query: { buyerUserId: id }})
    }
  }
}
</script>

<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../styles/elDialog.scss");

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
.tagCustomer /deep/ .el-form-item__content {
  display: flex;
}
.tagCustomer {
  display: flex !important;
}
.tagCustomer /deep/ .el-form-item__content span {
  margin: 0 5px;
}
.tagList .formSearch /deep/ .el-form {
  display: flex;
}
.tagList .tagNameStyle /deep/ .el-form-item__content {
  width: 300px;
}
.addTagBox /deep/ .el-form-item {
  display: flex;
}
.addTagBox /deep/ .el-form-item__content {
  width: 80%;
}
</style>
