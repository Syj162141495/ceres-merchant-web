<!--  -->
<template>
  <div>
    <div class="pending">
      <div class="acTab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="1" />
          <el-tab-pane label="我参与的" name="2" />
        </el-tabs>
        <el-radio-group v-model="formInline.signType" @change="signTypeChange">
          <el-radio-button :label="1">平台优惠券</el-radio-button>
          <el-radio-button :label="2">平台秒杀</el-radio-button>
          <el-radio-button :label="3">平台限时折扣</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="活动名称">
            <el-input v-model="formInline.activityName" placeholder="请输入活动名称" />
          </el-form-item>
          <el-form-item label="活动状态">
            <el-select v-model="formInline.state" placeholder="请选择活动状态" clearable>
              <el-option label="报名未开始" value="0" />
              <el-option label="报名进行中" value="1" />
              <el-option label="活动待开始" value="2" />
              <el-option label="活动进行中" value="3" />
              <el-option label="活动已结束" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="formInline.examineState" placeholder="请选择审核状态" clearable>
              <el-option label="待审核" value="0" />
              <el-option label="报名成功" value="1" />
              <el-option label="报名失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
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
          <el-table-column prop="activityName" label="活动名称" show-overflow-tooltip />
          <el-table-column prop="bondMoney" label="活动保证金" show-overflow-tooltip />
          <el-table-column prop="signTime" label="报名时间" width="170" />
          <el-table-column prop="activityTime" label="活动时间" width="170" />
          <el-table-column label="活动优惠" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.discountProgramme == 1">满减</div>
              <div v-if="scope.row.discountProgramme == 2">优惠券</div>
              <div>{{ scope.row.details }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="activityIntroduce" label="活动简介" show-overflow-tooltip />
          <el-table-column label="活动状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.state == 0">报名未开始</span>
              <span v-if="scope.row.state == 1">报名进行中</span>
              <span v-if="scope.row.state == 2">活动待开始</span>
              <span v-if="scope.row.state == 3">活动进行中</span>
              <span v-if="scope.row.state == 4">活动已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="报名状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.signState == 0">待审核</span>
              <span v-if="scope.row.signState == 1">报名成功</span>
              <span v-if="scope.row.signState == 2">报名失败</span>
              <span v-if="scope.row.signState == null">未报名</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" show-overflow-tooltip width="220">
            <template slot-scope="scope">
              <div class="btnList">
                <el-button
                  v-if="scope.row.operation === 1"
                  type="primary"
                  @click="getTotal(scope.row,1)"
                >立即报名</el-button>
                <el-button
                  v-if="scope.row.operation === 2"
                  type="primary"
                  disabled
                  @click="getTotal(scope.row,1)"
                >立即报名</el-button>
                <el-button
                  v-if="scope.row.operation === 4"
                  type="primary"
                  @click="getTotal(scope.row,1)"
                >重新报名</el-button>
                <el-button
                  v-if="scope.row.operation === 5"
                  type="primary"
                  @click="getTotal(scope.row,1)"
                >继续报名</el-button>
                <el-button v-if="scope.row.operation === 3" @click="goActiveData(scope.row)">活动数据</el-button>
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
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { activityGetAll } from '@/api/active'
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      activeName: '1',
      formInline: {
        type: 1, // 查询类型 1-全部 2-我参与的
        activityName: '', // 活动名称
        state: '',
        examineState: '',
        page: 1,
        pageSize: 10,
        signType: 1
      },
      total: 1,
      tableData: [],
      currentPage: 1
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getAll(this.formInline)
  },
  // 方法集合
  methods: {
    //
    signTypeChange(){
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

    handleClick(tab, event) {
      console.log(tab, event)
      this.formInline.type = parseInt(tab.name)
      if (tab.name === '2') {
        this.getAll(this.formInline)
      } else {
        this.getAll(this.formInline)
      }
    },
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 清除
    clear() {
      this.activeName = '1'
      this.formInline = {
        activityName: '', // 活动名称
        state: '',
        examineState: '',
        page: 1,
        pageSize: 10
      }
      this.getAll(this.formInline)
    },
    // 立即报名
    getTotal(row, index) {
      this.$router.push({
        name: 'getActive',
        params: {
          activityId: row.activityId,
          bondMoney: row.bondMoney,
          type: index,
          ifBond: row.ifBond,
          signType: row.signType
        }
      })
    },
    // 活动数据
    goActiveData(row){
      this.$router.push({
        name: 'activeData',
        params: {
          activityName: row.activityName,
          activityId: row.activityId,
          signId: row.signId
        }
      })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await activityGetAll(formInline)
      this.tableData = res.data.list
      this.total = res.data.total
    },
    // 查看
    seeMore() {},
    // 编辑
    edit() {},
    // 删除
    del() {}
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
.acTab .el-radio-group{
  margin-bottom: 10px;
}
</style>
