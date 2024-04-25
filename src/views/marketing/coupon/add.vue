<template>
  <div class="addCoupon">
    <!-- 新增用户 -->
    <div class="addCouponBox">
      <div class="addCouponTit">{{ shopCouponId ? '修改优惠券' : '新增优惠券' }}</div>
      <el-form ref="ruleForm" class="formBox" :model="addForm" label-width="150px" :rules="couponRules">
        <el-form-item label="优惠券类型">
          <el-radio v-model="addForm.couponType" label="1">满减券</el-radio>
          <el-radio v-model="addForm.couponType" label="2">折扣券</el-radio>
        </el-form-item>
        <div class="flexBox">
          <el-form-item label="优惠券名称" prop="couponName">
            <el-input v-model="addForm.couponName" placeholder="请输入优惠券名称" onblur="value=value.replace(/(^\s*)|(\s*$)/g, '')" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm.remark" placeholder="请输入备注" />
          </el-form-item>
        </div>
        <el-form-item class="applyType" label="适用商品" prop="applyType">
          <el-radio v-model="addForm.applyType" label="1">全部商品</el-radio>
          <el-radio v-model="addForm.applyType" label="2" @change="chooseProduct(type = '2')">指定商品可用</el-radio>
          <span class="selectBtn" @click="chooseProduct(type = '2')">请选择<i v-if="addForm.applyType === '2' && idList.length !== 0" class="selectNum">{{ idList.length }}</i></span>
          <el-radio v-model="addForm.applyType" label="3" @change="chooseProduct(type = '3')">指定商品不可用</el-radio>
          <span class="selectBtn" @click="chooseProduct(type = '3')">请选择<i v-if="addForm.applyType === '3' && idList.length !== 0" class="selectNum">{{ idList.length }}</i></span>
        </el-form-item>
        <el-form-item class="inputW" label="使用门槛" prop="threshold">
          订单满<el-input v-model="addForm.threshold" :disabled="isThreshold" type="number" oninput="value=value.replace(/-/, '')" />元
          <el-checkbox v-model="isThreshold" @change="changeThreshold">无门槛</el-checkbox>
        </el-form-item>
        <el-form-item v-if="addForm.couponType === '1'" class="inputW" label="优惠内容" prop="couponContent">
          减<el-input v-model="addForm.couponContent" type="number" />元
        </el-form-item>
        <el-form-item v-else class="inputW discount" label="优惠内容" prop="couponContent">
          打<el-input v-model="addForm.couponContent" type="number" />折
          <label>输入值要大于0 小于10，可保留一位小数</label>
        </el-form-item>
        <el-form-item class="timeDataBox" label="用券时间">
          <el-radio v-model="addForm.timeType" label="1">固定时间</el-radio>
          <div class="dateBox">
            <el-form-item>
              <el-date-picker
                v-model="dateInfo"
                :disabled="addForm.timeType === '2'"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item class="boxWidth">
          <el-radio v-model="addForm.timeType" label="2">领券当日起</el-radio>
          <el-input v-model="addForm.effectiveDay" :disabled="addForm.timeType !== '2'" oninput="value=value.replace(/[^\d]/g,'')" type="number" />天内可用
        </el-form-item>
        <el-form-item class="boxWidth" label="发放数量" prop="number">
          <el-input v-model="addForm.number" type="number" oninput="value=value.replace(/[^\d]/g,'')" />张
        </el-form-item>
        <el-form-item class="boxWidth" label="每人限领次数">
          <el-radio v-model="addForm.receiveType" label="1">无限制</el-radio>
          <el-radio v-model="addForm.receiveType" label="2">限制</el-radio>
          <el-input v-model="addForm.frequency" :disabled="addForm.receiveType === '1'" oninput="value=value.replace(/[^\d]/g,'')" type="number" />次
        </el-form-item>
        <el-form-item label="叠加平台优惠">
          <el-radio-group v-model="addForm.ifAdd">
            <el-radio label="0">不叠加</el-radio>
            <el-radio label="1">叠加</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addCouponFn('ruleForm')">保 存</el-button>
      <el-button @click="goToCoupon">取 消</el-button>
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
          <el-table-column label="产品主图" width="220" align="center">
            <template slot-scope="scope">
              <img height="80" width="80" :src="scope.row.image " alt srcset>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" width="220" />
          <el-table-column prop="productId" label="产品id" show-overflow-tooltip />
          <!--          <el-table-column prop="discountPrice" label="售价（元）" show-overflow-tooltip />-->
          <el-table-column prop="originalPrice" label="原价（元）" show-overflow-tooltip />
          <el-table-column prop="stockNumber" label="库存（件）" show-overflow-tooltip />
          <!--          <el-table-column prop="volume" label="销量" show-overflow-tooltip />-->
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
import { addCoupon, getProducts, couponDetail, updateCoupon } from '@/api/marketing'

export default {
  name: 'AddCoupon',
  data() {
    return {
      // 新增
      getRowKeys(row) {
        return row.productId
      },
      addForm: {
        applyType: '1', //  适用商品 1-全部商品 2-指定商品可用 3-指定商品不可用
        couponContent: null, // 优惠内容减多少元
        couponName: '', //  优惠券名称
        couponType: '1', //  优惠券类型 1-满减券 2-折扣券
        effectiveDay: null, //  领券当日几天内（天数）
        effectiveStart: '', //  用券开始时间
        effectiveEnd: '', //  用券结束时间
        frequency: null, //  限制次数
        ids: [], //  选中的商品id数组
        ifAdd: '0', //  是否叠加平台优惠 1-是 0-否
        number: null, //  发放数量
        receiveType: '1', //  每人限领次数 1-无限次 2-限制几次
        remark: '', //  备注
        shopCouponId: null, //  店铺优惠券id
        threshold: '0', //  使用门槛满多少元，无门槛为0
        timeType: '1' //  用券时间 1-固定时间 2-领券当日起几天内可用
      },
      proOption: {
        page: 1,
        pageSize: 10
      },
      dateInfo: [],
      idList: [],
      isThreshold: true,
      total: 0,
      tableData: [],
      currentPage: 1,
      currentType: '1',
      shopCouponId: '', // 优惠券ID
      couponRules: {
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        couponContent: [{ required: true, message: '请输入优惠金额' }],
        dateInfo: [{ type: 'date', required: true, message: '请选择时间' }],
        number: [{ required: true, message: '请输入发放数量', trigger: 'blur' }]
      },
      multipleSelection: [],
      roleList: [],
      isVisible: false // 选择商品弹窗
    }
  },
  mounted() {
    this.getProList()
    this.shopCouponId = this.$route.query.shopCouponId
    if (this.shopCouponId) {
      console.log(this.shopCouponId, '111')
      this.getCouponInfo()
    }
  },
  methods: {
    proving1(e) {
      var keynum = window.event ? e.keyCode : e.which // 获取键盘码
      // var keychar = String.fromCharCode(keynum) // 获取键盘码对应的字符
      console.log(
        e.key
          .replace(/[^\d^\.]+/g, '')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
      )
      console.log(keynum)
      if (
        e.key
          .replace(/[^\d^\.]+/g, '')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.') === '' &&
        keynum !== 8
      ) {
        this.$message.warning('禁止输入中文或空')
        e.target.value = ' '
      }
    },
    addCouponFn(ruleForm) {
      console.log(this.addForm)
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.addForm.timeType === '1' && this.dateInfo.length === 0) {
            this.$message({
              message: '请选择用券时间开始和结束日期',
              type: 'warning'
            })
            return false
          }
          if (this.addForm.timeType === '2' && this.addForm.effectiveDay === null) {
            this.$message({
              message: '请填写领券多久内可以使用时间',
              type: 'warning'
            })
            return false
          }
          if (this.addForm.receiveType === ' 2' && this.addForm.frequency === null) {
            this.$message({
              message: '请填写每人限领次数',
              type: 'warning'
            })
            return false
          }
          if (this.addForm.couponType === '2') {
            var regExp = /^([1-9]{1})(.\d{1})?$/
            if (!regExp.test(this.addForm.couponContent)) {
              this.$message({
                message: '格式输入不正确',
                type: 'warning'
              })
              return false
            }
          }
          this.addForm.effectiveStart = this.dateInfo[0]
          this.addForm.effectiveEnd = this.dateInfo[1]
          if (this.shopCouponId) {
            updateCoupon(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({ name: 'coupon' })
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
          } else {
            addCoupon(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$router.push({ name: 'coupon' })
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
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
      if (this.currentType !== type) {
        this.idList = []
        if (this.multipleSelection.length !== 0) {
          this.$refs.multipleTable.clearSelection()
        }
      }
      this.currentType = type
    },
    getProList() {
      getProducts(this.proOption).then(res => {
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
        idList.push(i.productId)
      })
      this.idList = idList
      this.addForm.ids = idList
      this.addForm.applyType = this.currentType
      this.isVisible = false
    },
    // 取消选择
    closeSelect() {
      this.isVisible = false
    },
    // 跳转优惠券列表
    goToCoupon() {
      this.$router.push({ name: 'coupon' })
    },
    async getCouponInfo() {
      const res = await couponDetail({ shopCouponId: this.shopCouponId })
      this.addForm = res.data
      this.addForm.applyType = res.data.applyType.toString()
      this.addForm.couponContent = res.data.couponContent
      this.addForm.couponName = res.data.couponName
      this.addForm.couponType = res.data.couponType.toString()
      this.addForm.effectiveDay = res.data.effectiveDay
      this.addForm.effectiveStart = res.data.effectiveStart
      this.addForm.effectiveEnd = res.data.effectiveEnd
      this.addForm.frequency = res.data.frequency
      this.addForm.ids = res.data.ids
      this.addForm.ifAdd = res.data.ifAdd.toString()
      this.addForm.number = res.data.number
      this.addForm.receiveType = res.data.receiveType.toString()
      this.addForm.remark = res.data.remark
      this.addForm.shopCouponId = res.data.shopCouponId
      this.addForm.threshold = res.data.threshold.toString()
      this.addForm.timeType = res.data.timeType.toString()
      this.dateInfo = [this.addForm.effectiveStart, this.addForm.effectiveEnd]
      console.log(res, 'res')
    },
    changeThreshold(val) { // 输入框值改变
      if (val) {
        this.addForm.threshold = 0
      }
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.addCoupon {
  margin-top: 20px;
  padding: 30px;
  background: #FFFFFF;
  .addCouponTit {
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
  .discount label {
    color: #cccccc;
    font-weight: 500;
    padding-left: 30px;
  }
}
</style>
<style scoped>
.flexBox /deep/ .el-input {
  width: 300px;
}
.inputW /deep/ .el-input {
  width: 100px;
  margin: 0 8px;
}
.inputW /deep/ .el-input .el-input__inner {
  text-align: center;
}
.inputW /deep/ .el-form-item__error {
  padding-left: 25px;
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
.addCoupon /deep/ .el-button--primary {
  background: #409EFF;
  border-color: #409EFF;
}
.addCoupon /deep/ .el-dialog__header {
  background-color: #409EFF;
}
.addCoupon /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}
.addCoupon .timeDataBox /deep/ .el-form-item__content {
  display: flex;
  align-items: center;
}
.addCoupon .timeDataBox /deep/ .el-form-item__label {}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
