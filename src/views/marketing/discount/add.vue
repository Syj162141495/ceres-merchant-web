<template>
  <div class="addGroupBuy">
    <!-- 新增用户 -->
    <div class="addGroupBuyBox">
      <div class="addGroupBuyTit">{{ shopDiscountId ? '修改折扣活动' : '新增折扣活动' }}</div>
      <el-form ref="ruleForm" class="formBox" :model="addForm" label-width="150px" :rules="discountRules">
        <div class="flexBox">
          <el-form-item label="活动名称" prop="discountName">
            <el-input v-model="addForm.discountName" placeholder="请输入活动名称" />
          </el-form-item>
        </div>
        <div class="flexBox">
          <el-form-item label="备注">
            <el-input v-model="addForm.remark" placeholder="请输入备注" />
          </el-form-item>
        </div>
        <el-form-item class="timeDataBox" label="活动时间">
          <div class="dateBox">
            <el-form-item>
              <el-date-picker
                v-model="dateInfo"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item class="boxWidth" label="商品限购" prop="proQuota">
          <el-radio v-model="addForm.ifLimit" label="1">不限购</el-radio>
          <el-radio v-model="addForm.ifLimit" label="2">限购</el-radio>
          <el-input v-model="addForm.limitNumber" :disabled="addForm.ifLimit === '1'" type="number" oninput="value=value.replace(/[^\d]/g,'')" />件/人
        </el-form-item>
        <el-form-item class="boxWidth" label="活动商品限量" prop="proQuota">
          <el-radio v-model="addForm.ifNumber" label="0">不限量</el-radio>
          <el-radio v-model="addForm.ifNumber" label="1">限量</el-radio>
          <el-input v-model="addForm.number" :disabled="addForm.ifNumber === '0'" type="number" oninput="value=value.replace(/[^\d]/g,'')" />件
        </el-form-item>
        <el-form-item class="boxWidth" label="活动预热" prop="enableTime">
          <el-radio v-model="addForm.ifEnable" label="1">停用</el-radio>
          <el-radio v-model="addForm.ifEnable" label="2">启用</el-radio>
          <el-input v-model="addForm.enableTime" :disabled="addForm.ifEnable === '1'" type="number" oninput="value=value.replace(/[^\d]/g,'')" />小时前
        </el-form-item>
        <el-form-item label="优惠券叠加" prop="overlying">
          <el-radio v-model="addForm.ifAdd" label="1">叠加</el-radio>
          <el-radio v-model="addForm.ifAdd" label="0">不叠加</el-radio>
        </el-form-item>
        <el-form-item class="applyType" label="活动商品" prop="commodity">
          <span class="selectBtn" @click="chooseProduct">请选择<i v-if="addForm.details.length !== 0" class="selectNum">{{ addForm.details.length }}</i></span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addSeckillFn('ruleForm')">保 存</el-button>
      <el-button @click="goToDiscount">取 消</el-button>
    </span>
    <!-- 新建分组弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择商品"
      :visible.sync="isVisible"
      width="55%"
      top="50px"
      class="group-dialog"
    >
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
          :row-key="getRowKeys"
          max-height="600"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55"
          />
          <el-table-column label="商品信息" width="150" align="center">
            <template slot-scope="scope">
              <img height="80" width="80" :src="scope.row.image " alt srcset>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="" />
          <el-table-column prop="originalPrice" label="原价（元）" width="120" />
          <el-table-column prop="value" label="规格" width="120" />
          <el-table-column label="折扣" width="120">
            <template scope="scope">
              <el-input v-model="scope.row.discount" size="small" oninput="value=value.replace(/[^\d]/g,'')" maxlength="2" />
            </template>
          </el-table-column>
          <el-table-column label="活动价（元）">
            <template slot-scope="scope">
              <span v-if="scope.row.discount < 10 && scope.row.discount !== null && scope.row.discount !== ''">{{ numFilter(scope.row.discount / 10 * scope.row.originalPrice) }}</span>
              <span v-if="scope.row.discount >= 10 && scope.row.discount !== null && scope.row.discount !== ''">{{ numFilter(scope.row.discount / 100 * scope.row.originalPrice) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stockNumber" label="库存" width="120" show-overflow-tooltip />
          <!--          <el-table-column width="80" label="操作" show-overflow-tooltip>-->
          <!--            <template slot-scope="scope">-->
          <!--              <div class="btnList">-->
          <!--                <el-popconfirm title="确定删除此活动？" @onConfirm="deleteSeckillFn(scope.row)">-->
          <!--                  <el-button slot="reference" class="delCls" type="text">删除</el-button>-->
          <!--                </el-popconfirm>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
        <div class="fenye">
          <el-pagination
            :current-page="proOption.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="proOption.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <div class="footBtnBox">
          <span slot="footer">
            <el-button type="primary" @click="saveIdList">确 定</el-button>
            <el-button @click="closeSelect">取 消</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDisProList, addDiscount, discountUpdate, getDiscountDetail } from '@/api/marketing'

export default {
  name: 'AddGroupBuy',
  data() {
    return {
      // 新增
      getRowKeys(row) {
        return row.skuId
      },
      addForm: {
        details: [], // 商品明细数据,
        enableTime: null, // 预热几小时前
        endTime: '', // 折扣活动结束时间
        discountName: '', // 折扣活动名称
        ifAdd: '1', // 优惠券是否叠加 1-是 0-否
        ifEnable: '1', // 秒杀活动预热 1-停用 2-启用
        ifLimit: '1', // 商品限购 1-不限购 2-限购
        limitNumber: null, // 限购几件/人
        remark: '', // 备注
        ifNumber: '0', // 是否限量
        number: null, // 限制数量
        startTime: '' // 活动开始时间
      },
      proOption: {
        page: 1,
        pageSize: 10
      },
      dateInfo: [],
      details: [],
      isThreshold: true,
      total: 0,
      tableData: [],
      shopDiscountId: '', // 秒杀ID
      discountRules: {
        discountName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      multipleSelection: [],
      roleList: [],
      isVisible: false // 选择商品弹窗
    }
  },
  mounted() {
    this.getProList()
    this.shopDiscountId = this.$route.query.shopDiscountId
    if (this.shopDiscountId) {
      console.log(this.shopDiscountId, '111')
      this.getDiscountInfo()
    }
  },
  methods: {
    addSeckillFn(ruleForm) {
      console.log(this.addForm)
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.dateInfo.length === 0) {
            this.$message({
              message: '请选择活动开始和结束日期',
              type: 'warning'
            })
            return false
          }
          if (this.addForm.ifLimit === '2' && this.addForm.limitNumber === null) {
            this.$message({
              message: '请填写活动限购多少件',
              type: 'warning'
            })
            return false
          }
          if (this.addForm.ifNumber === ' 2' && this.addForm.number === null) {
            this.$message({
              message: '请输入活动限制数量',
              type: 'warning'
            })
            return false
          }
          if (this.addForm.ifEnable === ' 2' && this.addForm.enableTime === null) {
            this.$message({
              message: '请填写活动预热前多少小时',
              type: 'warning'
            })
            return false
          }
          this.addForm.startTime = this.dateInfo[0]
          this.addForm.endTime = this.dateInfo[1]
          if (this.shopDiscountId) {
            discountUpdate(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({ name: 'discount' })
              }
            })
          } else {
            addDiscount(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$router.push({ name: 'discount' })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    removeTag(index) {
      console.log(index)
    },
    tagChange(index) {
      this.$forceUpdate()
      console.log(index)
    },
    handleSizeChange(val) {
      this.proOption.pageSize = val
      this.getProList()
    },
    handleCurrentChange(val) {
      this.proOption.page = val
      this.getProList()
    },
    // 选择商品
    chooseProduct(type) {
      this.isVisible = true
    },
    getProList() {
      getDisProList(this.proOption).then(res => {
        console.log(res)
        if (res.code === '') {
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    // 选中商品
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 保存选择商品ID
    saveIdList() {
      const idList = []
      console.log(this.multipleSelection, 'multipleSelection')
      this.multipleSelection.forEach(i => {
        let discountPrice = null
        if (i.discount < 10) {
          discountPrice = i.discount / 10 * i.originalPrice
        } else {
          discountPrice = i.discount / 100 * i.originalPrice
        }
        idList.push({
          price: discountPrice,
          discount: i.discount,
          productId: i.productId,
          skuId: i.skuId
        })
      })
      this.addForm.details = idList
      this.isVisible = false
    },
    // 取消选择
    closeSelect() {
      this.isVisible = false
    },
    // 跳转折扣列表
    goToDiscount() {
      this.$router.push({ name: 'discount' })
    },
    async getDiscountInfo() {
      const res = await getDiscountDetail({ shopDiscountId: this.shopDiscountId })
      this.addForm.ifEnable = res.data.ifEnable.toString()
      this.addForm.enableTime = res.data.enableTime
      this.addForm.effectiveTime = res.data.effectiveTime
      this.addForm.discountName = res.data.discountName
      this.addForm.startTime = res.data.startTime
      this.addForm.endTime = res.data.endTime
      this.addForm.person = res.data.person
      this.addForm.ifAdd = res.data.ifAdd.toString()
      this.addForm.ifNumber = res.data.ifNumber.toString()
      this.addForm.ifLimit = res.data.ifLimit.toString()
      this.addForm.number = res.data.number
      this.addForm.limitNumber = res.data.limitNumber
      this.addForm.remark = res.data.remark
      this.addForm.shopDiscountId = res.data.shopDiscountId
      const idList = res.data.products
      idList.forEach(i => {
        this.addForm.details.push({
          discount: i.discount,
          price: i.discountPrice,
          productId: i.productId,
          skuId: i.skuId
        })
      })
      this.dateInfo = [this.addForm.startTime, this.addForm.endTime]
      console.log(this.dateInfo, 'dateInfo')
    },
    // 删除
    deleteSeckillFn() {
    },
    numFilter(value) {
      const realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.addGroupBuy {
  margin-top: 20px;
  padding: 30px;
  background: #FFFFFF;
  .addGroupBuyTit {
    font-size: 24px;
  }
  .dialog-footer {
    margin-left: 300px;
  }
  .formBox {
    padding: 60px 50px 50px 100px;
    .flexBox {
      display: flex;
    }
    .applyType {
      span {
        width: 100px;
        height: 30px;
        line-height: 30px;
        background: #66b1ff;
        color: #FFFFFF;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        margin-right: 30px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        i {
          position: absolute;
          right: -10px;
          top: -10px;
          width: 25px;
          height: 25px;
          line-height: 25px;
          background: #FFFFFF;
          border-radius: 50%;
          border: 1px solid #66b1ff;
          text-align: center;
          color: #409EFF;
          font-style: normal;
          font-size: 12px;
        }
      }
    }
  }
  .footBtnBox {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  .dateBox {
    display: flex;
    align-items: center;
    .description {
      width: 59px;
      text-align: center;
      display: block;
      font-size: 14px;
      color: #999999;
    }
  }
}
</style>
<style scoped>
.flexBox /deep/ .el-input {
  width: 500px;
}
.inputW /deep/ .el-input {
  width: 100px;
  margin: 0 8px 0 0;
}
.inputW /deep/ .el-input .el-input__inner {
  text-align: center;
}
.inputW /deep/ .el-form-item__error {
  padding-left: 0;
}
.inputW /deep/ .el-checkbox {
  margin-left: 20px;
}
.inputW /deep/ .el-radio {
  margin-left: 30px;
}
.boxWidth /deep/ .el-input {
  width: 100px;
  margin-right: 15px;
}
.boxWidth /deep/ .el-input .el-input__inner {
  text-align: center;
}
.addGroupBuy /deep/ .el-button--primary {
  background: #409EFF;
  border-color: #409EFF;
}
.addGroupBuy /deep/ .el-dialog__header {
  background-color: #409EFF;
}
.addGroupBuy /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
.addGroupBuy .timeDataBox /deep/ .el-form-item__content {
  display: flex;
  align-items: center;
}
.addGroupBuy .timeDataBox /deep/ .el-form-item__label {}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
