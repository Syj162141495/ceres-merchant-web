<template>
  <div>
    <!-- 卡片 -->
    <div>
      <el-card class="box-card">
        <div slot="header">
          <span v-if="!productId" class="addTitle">新增服务</span>
          <span v-else class="addTitle">编辑服务</span>
          <el-button v-if="active" class="btnList" @click="back">取消</el-button>
          <el-button v-if="active" type="primary" class="btnList" @click="next">下一步</el-button>
          <el-button v-if="!active" type="primary" class="btnList" @click="save">保存</el-button>
          <el-button v-if="!active" class="btnList" @click="last">上一步</el-button>
        </div>
        <!-- 步骤条 -->
        <div class="stepsColor common">
          <div class="stepsOne common">
            <div :class="active ? 'one_class common' : 't_class common'">1</div>
            <div :class="active ? 'two_class' : 'w_class'">基本属性&服务描述</div>
          </div>
          <div class="line" />
          <div class="stepsTwo common">
            <div :class="active ? 't_class common' : 'one_class common'">2</div>
            <div :class="active ? 'w_class' : 'two_class' ">基本属性&服务描述</div>
          </div>
        </div>
      </el-card>
      <!-- 服务 -->
      <div class="addCom common">
        <div v-if="active" class="leftCom">
          <el-form ref="form" :model="form" label-width="80px" style="padding: 40px 40px;">
            <el-form-item label="服务名称">
              <el-input v-model="form.productName" maxlength="20" />
            </el-form-item>
            <el-form-item>
              <Tinymce ref="content" v-model="form.productText" class="tinymce-wrap" :height="200" />
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active" class="rightCom">
          <el-form ref="form" :model="form" label-width="80px" style="margin:20px 20px">
            <el-form-item label="服务分类">
              <el-cascader
                v-model="form.classifyId"
                :options="classifyList"
                clearable
                :props="{
                  checkStrictly: true,
                  label:'categoryName',
                  value:'id',
                  children:'childs'
                }"
              />
            </el-form-item>
            <!-- <el-form-item label="服务分组">
              <el-select v-model="form.shopGroupId" placeholder="请选择服务分组">
                <el-option
                  v-for="(item,index) in groupList"
                  :key="index"
                  :label="item.groupName"
                  :value="item.shopGroupId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="供应商">
              <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
            </el-form-item> -->
            <el-form-item label="需要物流">
              <el-radio-group v-model="form.ifLogistics">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上架状态">
              <el-radio-group v-model="form.shelveState">
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="允许超卖">
              <el-radio-group v-model="form.ifOversold">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--            <el-form-item label="花呗分期">-->
            <!--              <el-radio-group v-model="form.ifHuabei">-->
            <!--                <el-radio :label="1">支持</el-radio>-->
            <!--                <el-radio :label="0">不支持</el-radio>-->
            <!--              </el-radio-group>-->
            <!--            </el-form-item>-->
          </el-form>
        </div>
        <div v-if="!active" class="centerCom">
          <el-form ref="form" :model="params" label-width="80px">
            <StyleInformation :form="params" />
          </el-form>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      class="check-image-dialog"
      title="查看图片"
      center="center"
    >
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import {
  getGroupSelect,
  getClassify,
  getClassifyAdd,
  getClassifyGetById,
  getClassifyUpdate
} from '@/api/commodity'
import { uploadUrl } from '@/utils/request'
import StyleInformation from './addComponent'
export default {
  name: '',
  components: {
    Tinymce,
    StyleInformation
  },
  data() {
    return {
      active: 1,
      action: uploadUrl,
      form: {
        productName: '', // 服务名称
        productBrief: '', // 服务简介
        shopGroupId: '', // 服务分组id
        classifyId: '', // 分类id
        supplierName: '', // 供应商名称
        ifLogistics: '', // 是否需要物流 1-是 0-否
        shelveState: ' ', // 是否上架 1-上架 0-不上架
        ifOversold: '', // 是否允许超卖 1-是 0-否
        ifHuabei: 1, // 是否支持花呗分期 1-是 0-否
        productText: '', // 服务描述（富文本）
        images: [], // "图片地址"
        deletes:[], //删除的规格id数组
        names: [
          {
            code: '', // 级别
            skuName: '', // 规格名
            values: [
              {
                valueCode: '', // 级别
                skuValue: '', // 规格值
                image: '' // 图片
              }
            ]
          }
        ],
        skus: [
          {
            skuName: '', // 规格名称
            skuValue: '', // 规格值
            price: '', // 售价
            originalPrice: '', // 原价
            stockNumber: '', // 库存数量
            weight: '', // 重量
            skuImage: '', // 配图地址
            style: '' // 款式  1-单款式 2-多款式
          }
        ]
      },
      params: {
        applyPrice: 0,
        attrStyle: 0,
        categoryId: '',
        oversold: 1,
        collects: 0,
        groupId: '',
        imgs: [],
        deletes:[],   //删除规格数据
        isDelete: 0,
        limitCount: 0,
        minusStock: '',
        needLogistics: 1,
        platform: '',
        price: 0,
        productCode: '',
        productName: '',
        sellCount: 0,
        sellDesc: '',
        sellType: '',
        shortName: '',
        skuAttrList: [
          {
            code: '',
            skuName: '',
            needImg: false,
            values: [
              {
                skuValue: '',
                valueCode: '',
                image: ''
              }
            ]
          }
        ],
        skuList: [
          {
            isDelete: '',
            skuAttrCodeDTOList: [
              {
                code: '',
                valueCode: ''
              }
            ],
            skuAttrList: [],
            sku: '',
            skuImg: '',
            price: 0,
            originalPrice: 0,
            stockNumber: 0,
            weight: 0
          }
        ],
        sortOrder: '',
        status: '',
        stock: '',
        supplierName: '',
        views: '',
        weight: '',
        classifyId: 0,
        choosenLabels: []
      },
      imgList: [],
      groupList: [],
      classifyList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    }
  },
  mounted() {
    this.groups()
    this.selectList()
    console.log(this.productId)
    if (this.productId) {
      this.details()
    }
  },
  methods: {
    handleImageSuccess(response) {
      const { url } = response.data
      this.imgList.push(url)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.imgPath
      this.dialogVisible = true
    },
    // 移除图片
    handleRemove(file) {
      const { imgPath } = file
      this.form.imgs = this.form.imgs.filter(item => {
        return item.imgPath !== imgPath
      })
    },
    // 下一步
    next() {
      if (this.active === 1) {
        this.active = 0
        // console.log(this.form);
        sessionStorage.setItem('form', JSON.stringify(this.form.skus))
        this.params.classifyId = this.form.classifyId;
      }
    },
    // 返回
    back() {
      this.$router.go(-1)
    },
    // 上一步
    last() {
      if (this.active !== 1) {
        this.active = 1
      }
    },
    // 保存
    async save() {
      console.log(this.params.skuAttrList)
      if (this.params.attrStyle === 1) {
        for (let i = 0; i < this.params.skuAttrList.length; i++) {
          if (this.params.skuAttrList[i].skuName === '') {
            this.$message({
              message: '规格名不能为空',
              type: 'warning'
            })
            return false
          }
        }
      }
      this.form.names = this.params.skuAttrList
      this.params.skuList.forEach(element => {
        element.style = this.params.attrStyle
      })
      this.form.skus = this.params.skuList
      this.form.images = this.params.imgs
      this.form.deletes = this.params.deletes
      this.form.classifyId =
        this.form.classifyId[2] ||
        this.form.classifyId[1] ||
        this.form.classifyId[0] ||
        this.form.classifyId;
      this.form.productBrief = !this.params.choosenLabels || this.params.choosenLabels.length === 0 ? "" : this.params.choosenLabels.join(',')
      console.log(this.form)
      if (this.productId) {
        this.form.productId = this.productId
        const sku = JSON.parse(sessionStorage.getItem('form'))
        console.log(sku)
        sku.forEach((element, i) => {
          for (let index = 0; index < this.form.skus.length; index++) {
            if (i === index) {
              this.form.skus[index].skuId = element.skuId
            }
          }
        })
        console.log(this.form,'this.form')
        const res = await getClassifyUpdate(this.form)
        console.log(res)
        if (res.code === '') {
          this.$message({
            type: 'success',
            message: '成功!'
          })
          this.$router.push({
            name: 'commoditySystem'
          })
        }
      } else {
        const res = await getClassifyAdd(this.form)
        console.log(res)
        if (res.code === '') {
          this.$message({
            type: 'success',
            message: '成功!'
          })
          this.$router.push({
            name: 'commoditySystem'
          })
        }
      }
    },
    // 获取服务分组
    async groups() {
      const res = await getGroupSelect({
      })
      this.groupList = res.data
    },
    // 获取详情
    async details() {
      const res = await getClassifyGetById({ productId: this.productId })
      this.form = res.data
      if (res.data.names.length !== 0) {
        this.params.skuAttrList = res.data.names
      }
      // this.params.skuAttrList.forEach((item) => {
      //   var data = {}
      //   var arr = Object.keys(res.data)
      //   if (arr.length === 0) {
      //     item.needImg = false
      //   }
      // })
      this.params.skuList = this.form.skus
      this.params.attrStyle = res.data.skus[0].style
      this.params.imgs = res.data.images
      this.params.choosenLabels = res.data.productBrief.split(',') ? res.data.productBrief.split(',') : []
    },
    async selectList() {
      const res = await getClassify()
      this.classifyList = res.data
    }
  }
}
</script>

<style scoped lang='scss'>
@import url("../../../styles/elDialog.scss");
.btnList {
  float: right;
  padding: 3px 0;
  width: 100px;
  height: 48px;
  border-radius: 4px;
  margin-right: 30px;
}
.addTitle {
  font-size: 24px;
  color: #333333;
  line-height: 50px;
}
.common {
  display: flex;
  justify-content: center;
  align-items: center;
}
.one_class {
  width: 40px;
  height: 40px;
  background: #3a68f2;
  border-radius: 50%;
  color: #ffffff;
  font-size: 24px;
  margin: 0 10px;
}
.two_class {
  color: #3a68f2;
  font-size: 24px;
}
.line {
  width: 230px;
  height: 2px;
  background: #e0e5eb;
  margin: 0 20px;
}
.t_class {
  width: 40px;
  height: 40px;
  background: #dddddd;
  border-radius: 50%;
  font-size: 24px;
  color: #333333;
  margin: 0 10px;
}
.w_class {
  font-size: 24px;
  color: #666666;
}
.addCom {
  margin: 10px;
  justify-content: space-around;
  align-items: unset;
  .leftCom {
    width: 68%;
    background: #ffffff;
  }
  .rightCom {
    width: 28%;
    background: #ffffff;
  }
}
.centerCom {
  width: 1660px;
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px rgba(51, 51, 51, 0.15);
  border-radius: 4px;
}
</style>
