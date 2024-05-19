<!--  -->
<template>
  <div>
    <div class="pending">
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="服务名称">
            <el-input v-model="formInline.search" placeholder="请输入服务名称" />
          </el-form-item>
          <el-form-item label="上架状态">
            <el-select v-model="formInline.shelveState" placeholder="请选择上架状态">
              <el-option label="全部" :value="null" />
              <el-option label="下架" value="0" />
              <el-option label="上架" value="1" />
              <el-option label="待审核" value="2" />
              <el-option label="审核失败" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="服务分类">
            <el-cascader
              v-model="formInline.classifyId"
              :options="categoryList"
              clearable
              :props="{
                checkStrictly: true,
                expandTrigger: 'hover',
                label:'categoryName',
                value:'id',
                children:'childs'
              }"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
            <span v-for="(item,index) in btnList" :key="index" class="promissStyle">
              <el-button type="success" plain @click="btnClick(item)">{{ item.permissionName }}</el-button>
            </span>
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
          <el-table-column prop="productId" label="序号" show-overflow-tooltip />
          <el-table-column prop="productType" label="类型" show-overflow-tooltip />
          <el-table-column prop="productCategory" label="大类" show-overflow-tooltip />
          <el-table-column prop="productSubCategory" label="小类" show-overflow-tooltip />
          <el-table-column prop="productName" label="服务名称" width="220" />
          <el-table-column prop="shopName" label="服务提供商" width="220" />
          <el-table-column prop="priceInterval" label="价格区间" show-overflow-tooltip />
          <el-table-column prop="shopLocation" label="区域" show-overflow-tooltip />
          <el-table-column prop="isRecommended" label="是否推荐" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.isRecommended==0">否</span>
              <span v-if="scope.row.isRecommended==1">是</span>
            </template>
          </el-table-column>
          <el-table-column prop="volume" label="服务状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.shelveState==0">未上架</span>
              <span v-if="scope.row.shelveState==1">已上架</span>
              <span v-if="scope.row.shelveState==2">待审核</span>
              <span v-if="scope.row.shelveState==3">审核失败</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <div class="btnList">
                <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.shelveState==0" type="text" @click="down(scope.row)">上架</el-button>
                <el-button v-if="scope.row.shelveState==1" type="text" @click="down(scope.row)">下架</el-button>
                <el-button v-if="scope.row.shelveState!=1" type="text" @click="del(scope.row)">删除</el-button>
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
    <!-- 批量导入 -->
    <el-dialog
      title="批量导入服务"
      :visible.sync="batchAdd"
      :close-on-click-modal="false"
      center
      width="50%"
    >
      <div>
        <el-upload
          drag
          :limit="1"
          :auto-upload="false"
          accept=".xlsx"
          :action="UploadUrls"
          :before-upload="beforeUploadFile"
          :on-change="fileChange"
          :on-remove="batchRemove"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="batchFileList"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            <em>点击上传</em>
          </div>
          <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过10M</div>
          <div slot="tip" class="el-upload__tip">
            上传前不知道excel模板的，请点击
            <span class="clickMe" @click="poDownload">点我下载模板</span> 去下载
          </div>
        </el-upload>
        <br>
        <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="设置会员价"
      :visible.sync="vipPriceVisible"
      width="50%"
      class="vipDialog"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="优惠方式">
          <el-radio-group v-model="mode" @change="modeChange">
            <el-radio :label="1">折扣</el-radio>
            <el-radio :label="2">指定价格</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="priceTable">
          <table>
            <tr>
              <th>规格</th>
              <th>售价</th>
              <th v-for="(item,index) in gradeList" :key="index">
                {{ item }}
              </th>
            </tr>
            <tr v-for="(item,index) in productData" :key="index">
              <td>
                {{ item.value }}
              </td>
              <td>
                {{ item.price }}
              </td>
              <td v-for="(itemJ,indexJ) in item.memberPrices" :key="indexJ">
                <el-input v-model="itemJ.price" oninput="value=value.replace(/([^\d|\.])/g, '')" /> {{ mode==1?'折':'元' }}
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vipPriceVisible = false">取 消</el-button>
        <el-button type="primary" @click="vipPriceSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getBtnList } from '@/utils/auth'
import { uploadUrl } from '@/utils/request'
import {
  getClassifyGetAll,
  getClassifyDelete,
  getClassifyStart,
  downloadTemplate,
  importProduct,
  getClassify,
  getProductMembers,
  setProductMember
} from '@/api/commodity'
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      btnList: '',
      activeName: 'first',
      formInline: {
        type: '养老服务',
        search: '', // 搜索字段
        shelveState: '', // 上架状态 1-上架 0-不上架 null-全部
        stock: '', // 库存状态 1-有库存 0-无库存 null-全部
        classifyId: '', // 最下级分类id
        page: 1, // 当前页
        pageSize: 10
      },
      batchAdd: false,
      batchFileList: [],
      total: 1,
      tableData: [],
      currentPage: 1,
      categoryList: [],
      UploadUrl: uploadUrl,
      vipPriceVisible: false,
      productId: 0,
      mode: 1,
      productData: [],
      gradeList: []
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  async mounted() {
    await this.queryAllCategory()
    await this.getAll(this.formInline)

    this.btnList = getBtnList()
  },
  // 方法集合
  methods: {
    btnClick(id) {
      console.log(id)
      if (id.permissionName === '批量导入') {
        this.sends()
      } else if (id.permissionName === '新增服务') {
        this.add()
      }
    },
    handleSizeChange(val) {
      console.log(val)
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    //  查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 重置
    clear() {
      this.formInline = {
        search: '', // 搜索字段
        shelveState: '', // 上架状态 1-上架 0-不上架 null-全部
        stock: '', // 库存状态 1-有库存 0-无库存 null-全部
        classifyId: '', // 最下级分类id
        page: 1, // 当前页
        pageSize: 10
      }
    },
    // 新增服务
    add() {
      this.$router.push({ name: 'addCommodity', params: { id: '1' }})
    },
    // 批量导入
    sends() {
      this.batchAdd = true
      this.ba会员价tchFileList = []
    },
    // 编辑服务
    async edit(row) {
      this.$router.push({
        name: 'addCommodity',
        params: { productId: row.productId }
      })
      // let res = await getClassifyGetById({ productId: row.productId });
      // console.log(res);
    },
    // 设置会员价
    setVipPrice(row) {
      var _ = this
      this.productId = row.productId
      getProductMembers({ productId: row.productId }).then(res => {
        if (res.code === '') {
          _.productData = res.data
          if (_.productData && _.productData.length > 0) {
            _.gradeList = []
            const _memberPrices = _.productData[0].memberPrices
            _memberPrices.forEach(function(item, i) {
              _.gradeList.push(item.memberLevelName)
            })
            _.mode = _.productData[0].mode ? _.productData[0].mode : 1
            _.vipPriceVisible = true
          }
        }
      })
    },
    // 设置会员价提交
    vipPriceSubmit() {
      for (let i = 0; i < this.productData.length; i++) {
        this.productData[i].mode = this.mode
        for (let j = 0; j < this.productData[i].memberPrices.length; j++) {
          this.productData[i].memberPrices[j].mode = this.mode
          var _price = this.productData[i].memberPrices[j].price
          if (!_price) {
            this.$message({
              type: 'warning',
              message: '会员价格不能为空！'
            })
            return false
          }else if (this.productData[i].mode === 1) {
            if (_price < 0 || _price > 10) {
              this.$message({
                type: 'warning',
                message: '会员折数范围为0～10！'
              })
              return false
            }
          } else if (this.productData[i].mode === 2) {
            if (_price > this.productData[i].price) {
              this.$message({
                type: 'warning',
                message: '会员价格不能大于原价！'
              })
              return false
            }
          }
        }
      }
      console.log(JSON.stringify({ productId: this.productId, members: this.productData }))
      setProductMember({ productId: this.productId, members: this.productData }).then(res => {
        if (res.code === '') {
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
          this.getAll(this.formInline)
          this.vipPriceVisible = false
        }
      })
    },
    // 删除服务
    del(row) {
      this.$confirm('选中数据将被永久删除, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          getClassifyDelete({ productId: row.productId }).then(res => {
            if (res.code === '') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getAll(this.formInline)
            }
          })
        })
        .catch(() => {})
    },
    // 服务上下架
    async down(row) {
      console.log(row.shelveState)
      if (row.shelveState) {
        console.log(111)
        const res = await getClassifyStart({
          productId: row.productId,
          shelveState: 0
        })
        if (res.code === '') {
          this.$message({
            type: 'success',
            message: '下架成功!'
          })
          this.getAll(this.formInline)
        }
      } else {
        console.log(222)
        const res = await getClassifyStart({
          productId: row.productId,
          shelveState: 1
        })
        if (res.code === '') {
          this.$message({
            type: 'success',
            message: '上架成功!'
          })
          this.getAll(this.formInline)
        }
      }
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      console.log("this.formInline.classifyId ", this.formInline.classifyId)
      if (this.formInline.classifyId.length === 0) {
        this.formInline.classifyId = ""
      } else {
        this.formInline.classifyId =
        this.formInline.classifyId[2] ||
        this.formInline.classifyId[1] ||
        this.formInline.classifyId[0] ||
        this.formInline.classifyId
      }

      const res = await getClassifyGetAll(formInline)
      for (const item of res.data.list) {
        let productCategory = "";
        let productSubCategory = "";
        for (const category of this.categoryList.find(item => item.categoryName === '养老服务')['childs']) {
          for (const subCategory of category["childs"]) {
            if (subCategory["id"] === item.classifyId) {
              productCategory = category["categoryName"];
              productSubCategory = subCategory["categoryName"];
            }
          }
        }
        item.productCategory = productCategory;
        item.productSubCategory = productSubCategory;
      }
      this.total = res.data.total
      this.tableData = res.data.list
    },
    // 初始化查询所有分类
    async queryAllCategory() {
      const res = await getClassify()
      this.categoryList = res.data
    },
    // *********************导入部分
    UploadUrls: function() {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ''
    },
    // 下载模板
    poDownload() {
      downloadTemplate().then(res => {
        console.log(res, 1111)
        // const content = res
        const blob = new Blob([res])
        const fileName = '批量导入服务模板.xlsx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    // 导入
    uploadFile() {
      console.log(this.batchFileList)
      if (this.batchFileList.length === 0) {
        this.$message.warning('请上传文件')
      } else {
        const formDate = new FormData()
        formDate.append('file', this.batchFileList[0])
        console.log(formDate.get('file'))
        importProduct(formDate).then(res => {
          console.log(res)
          if (res.code === '') {
            this.$message.success('导入成功')
            this.batchAdd = false
            this.batchFileList = []
            this.getAll(this.formInline)
          }
        })
      }
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log('before upload')
      console.log(file)
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024 / 1024
      if (extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件')
      }
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M')
      }
    },
    // 文件状态改变时的钩子
    fileChange(file, batchFileList) {
      console.log(file.raw)
      this.batchFileList.push(file.raw)
      console.log(this.batchFileList)
    },
    batchRemove(file, batchFileList) {
      this.batchFileList = []
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, batchFileList) {
      this.$message.warning(`只能选择1个文件`)
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, batchFileList) {
      this.$message.success('文件上传成功')
    },
    // 文件上传失败时的钩子
    handleError() {
      this.$message.error('文件上传失败')
    },
    // 切换清除内容
    modeChange() {
      this.productData.forEach(item => {
        item.memberPrices.forEach(itemJ => {
          itemJ.price = ''
        })
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
.clickMe {
  color: #3a68f2;
  cursor: pointer;
}
.vipDialog{
  .priceTable{
    table{
      width: 100%;
      text-align: center;
      border-left: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
      font-size: 14px;
      color: #606266;
      border-collapse: collapse;
      tr{
        border-top: 1px solid #EBEEF5;
        th{
          padding: 12px 0;
          background: #EEF3FF;
          color: #333;
          border-right: 1px solid #EBEEF5;
        }
        td{
          padding: 12px 0;
          border-right: 1px solid #EBEEF5;
          &:nth-child(1),&:nth-child(2){
            width: 80px;
          }
          .el-input{
            width: 100px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
