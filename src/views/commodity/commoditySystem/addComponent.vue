<template>
  <div class="style-information-component">
    <!-- <label style="margin-right: 10px;">服务标签</label>
    <el-select v-model="form.choosenLabels" multiple>
      <el-option
        v-for="(item, index) in labels"
        :key="index"
        :label="item.label"
        :value="item.label"
        >
        <el-tag
          :key="index"
          :color="item.color"
        >
          <span style="color: azure;">{{ item.label }}</span>
        </el-tag>
      </el-option>
    </el-select> -->
    <div style="display: flex;" v-show="form.additionalInfoFlag">
      <el-form-item label="机构星级" style="margin-right: 20px;">
        <el-input v-model="form.starRating" placeholder="请输入机构星级" />
      </el-form-item>
      <el-form-item label="机构面积" style="margin-right: 20px;">
        <el-input v-model="form.area" placeholder="请输入机构面积" />
      </el-form-item>
    </div>
    <el-form-item label="服务图片" />
    <div class="upload-wrap">
      <el-upload
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :headers="headers"
        :data="dataObj"
        :file-list="form.imgs"
        :limit="20"
        :on-success="handleImageSuccess"
        :action="action"
      >
        <i slot="default" class="el-icon-plus" />
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.imgPath">
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in" />
            </span>
            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </el-upload>
    </div>
    <el-form-item label="服务规格设置">
      <el-radio-group v-model="form.attrStyle" @change="changeAttrStyle">
        <el-radio :label="0">单服务规格</el-radio>
        <el-radio :label="1">多服务规格</el-radio>
      </el-radio-group>
    </el-form-item>
    <div class="style-container">
      <div v-if="form.attrStyle === 0" class="single-style">
        <el-table
          :data="skuList"
          style="width: 100%"
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        >
          <el-table-column label="服务规格">
            <template slot-scope="scope">
              <el-input v-model="singleStyle.skuValue" :sss="scope" maxlength="40" />
            </template>
          </el-table-column>
          <el-table-column label="服务价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" type="number" oninput="value=value.replace(/-/, '')" />
            </template>
          </el-table-column>
          <el-table-column label="原价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.originalPrice" type="number" oninput="value=value.replace(/-/, '')" />
            </template>
          </el-table-column>
          <el-table-column label="成本价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stockNumber" type="number" oninput="value=value.replace(/[^\d]/g,'')" />
            </template>
          </el-table-column>
          <el-table-column label="服务介绍">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sku" />
            </template>
          </el-table-column>
<!--          <el-table-column label="SKU">-->
<!--            <template slot-scope="scope">-->
<!--              <el-input v-model="scope.row.sku" />-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
      </div>
      <div v-else class="multiple-styles">
        <div v-for="(skuAttr, index) in form.skuAttrList" :key="index" class="sku-attr-list">
          <!-- <el-form-item label="规格名">
            <el-input v-model="skuAttr.skuName" maxlength="20" />
            <i v-if="index != 0" class="el-icon-close delImg" @click="delSkuAttrList(index)"></i>
            <el-checkbox
              v-if="index === 0"
              v-model="skuAttr.needImg"
              style="margin-left: 20px;"
            >需要配图</el-checkbox>
          </el-form-item> -->
          <el-form-item label="规格值">
            <div class="attr-value-list">
              <div
                v-for="(sku, index1) in skuAttr.values"
                :key="index + '-' + index1"
                class="main-diagram m-8"
              >
                <el-input v-model="sku.skuValue" maxlength="10"/>
                <i v-if="index === 0 && index1 === 0"></i>
                <i v-else class="el-icon-close delImg" @click="delValue(index,index1)"></i>
                <div v-if="skuAttr.needImg && index === 0" class="upload-wrap diagram-upload">
                  <div class="span-wrap">
                    <el-upload
                      list-type="picture-card"
                      :show-file-list="false"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      :headers="headers"
                      :data="dataObj"
                      :file-list="[sku]"
                      :multiple="false"
                      :on-success="handleImageSuccess1"
                      :action="action"
                    >
                      <i v-if="!sku.image" slot="trigger" class="el-icon-plus" />
                      <div v-else class="attr-value-img">
                        <img class="attr-thumbnail" :src="sku.image">
                      </div>
                    </el-upload>
                    <div v-if="sku.image" class="attr-actions">
                      <span
                        class="attr-preview"
                        @click="handlePictureCardPreview({imgPath:sku.image})"
                      >
                        <i class="el-icon-zoom-in" />
                      </span>
                      <span class="attr-delete" @click="handleRemove1(sku)">
                        <i class="el-icon-delete" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <el-button type="text" style="margin-left: 10px;" @click="addAttrValue(index)">添加</el-button>
            </div>
          </el-form-item>
        </div>
        <!-- <el-button class="add-attr-btn" type="primary" @click="addSkuAttrList">添加规格</el-button> -->
        <el-table
          :data="skuList"
          style="width: 100%"
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        >
          <el-table-column
            v-for="(skuAttr, index) in skuAttrName"
            :key="index"
            :label="skuAttr.skuName"
          >
            <template slot-scope="scope">
              {{
                scope.row.skuAttrCodeDTOList &&
                  scope.row.skuAttrCodeDTOList[index]
                  | attrValueFilter(form.skuAttrList)
              }}
            </template>
          </el-table-column>
          <el-table-column label="服务价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" type="number" oninput="value=value.replace(/-/, '')" />
            </template>
          </el-table-column>
          <el-table-column label="原价格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.originalPrice" type="number" oninput="value=value.replace(/-/, '')" />
            </template>
          </el-table-column>
          <el-table-column label="成本价格">
            <template slot-scope="scope">
                <el-input v-model="scope.row.stockNumber" type="number" oninput="value=value.replace(/[^\d]/g,'')" />
            </template>
          </el-table-column>
          <el-table-column label="服务介绍">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sku" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delAttrValue(scope.row,scope.$index,scope.row,scope)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
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
import { uploadUrl } from '@/utils/request';
import { getClassify } from '@/api/commodity';

export default {
  filters: {
    attrValueFilter(map, list) {
      const hasChilds =
        list &&
        list.filter(skuAttr => {
          const hasChild = skuAttr.values.some(attr => {
            return attr.skuValue
          })
          return skuAttr.skuName && hasChild
        })
      if (!map) {
        return ''
      }
      const { code, valueCode } = map
      let codeStr = ''
      hasChilds.map(item => {
        const { values } = item
        values &&
          values.some(attr => {
            const isSome = item.code === code && attr.valueCode === valueCode
            if (isSome) {
              codeStr = attr.skuValue
            }
            return isSome
          })
      })
      return codeStr
    }
  },
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    getClassify().then(res => {
      if (this.form.classifyId === '') {

      }
      if (!(this.form.classifyId instanceof Array)) {
        this.form.classifyId = [this.form.classifyId];
      }
      const len = this.form.classifyId.length;
      let target = res.data.find(item => item.id === this.form.classifyId[len - 1]);
      if (!target) {
        for (const item of res.data) {
          target = item.childs.find(subItem => subItem.id === this.form.classifyId[len - 1]);
          if (target) {
            break;
          }
        }
      }

      if (!target) {
        return;
      }

      let categories = new Set();
      if (target.depth === 1) {
        categories = new Set(target.childs.map(item => item.categoryName));
        if (len === 1 && this.form.classifyId[0] === 807) {
          categories = categories.union(new Set(['自理', '失能', '失智'])).union(new Set(['一星级', '二星级', '三星级', '四星级', '五星级']));
        }
      } else {
        categories = new Set([target.categoryName]);
      }
      this.labels = [...categories].map(item => ({
        label: item,
        type: ''
      }));

      // 筛选展示的标签
      this.form.choosenLabels = this.form.choosenLabels.filter(label => {
        for (const item of this.labels) {
          if (item.label === label) {
            return true;
          }
        }
        return false;
      });
      // 标签上色
      let index = Math.floor(Math.random() * this.colorList.length);
      for (const item of this.labels) {
        if (index === this.colorList.length) {
          index = 0;
        }
        item.color = this.colorList[index++];
      }
    });
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      newform: this.form,
      headers: {
        Authorization: ''
      },
      action: uploadUrl,
      dataObj: {
        folderId: 1
      },
      fileList: [],
      labels: [],
      colorList: [
        "#F6C600",
        "#EF7F00",
        "#F29596",
        "#EC453C",
        "#8A43E1",
        "#87CB4C",
        "#43A79E",
        "#73B8EE",
        "#3C80E8",
        "#21317B"
      ]
    }
  },
  computed: {
    skuAttrName() {
      console.log(this.form.skuAttrList)
      return this.form.skuAttrList;
      // return (
      //   this.form.skuAttrList &&
      //   this.form.skuAttrList.filter(skuAttr => {
      //     const hasChilds = skuAttr.values.some(attr => {
      //       return attr.skuValue
      //     })
      //     return skuAttr.skuName && hasChilds
      //   })
      // )
    },
    singleStyle() {
      if (this.form.skuAttrList && this.form.skuAttrList[0]) {
        return this.form.skuAttrList && this.form.skuAttrList[0].values[0]
      }
      return {
        skuValue: ''
      }
    },
    skuList() {
      if (this.form.attrStyle === 0) {
        if (this.form.skuList.length === 0) {
          this.form.skuList = [{
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
          }]
        }
        return this.form.skuList.slice(0, 1)
      }
      return this.form.skuList
    }
  },
  watch: {
    'form.skuAttrList': {
      handler(newVal, oldVal) {
        // 判断是否有规格值
        const hasChilds =
          this.form.skuAttrList &&
          this.form.skuAttrList.filter(skuAttr => {
            const hasChild = skuAttr.values.some(attr => {
              return attr.skuValue
            })
            return skuAttr.skuName && hasChild
          })
        if (this.form.attrStyle === 1 && hasChilds.length) {
          this.skuFormat()
        }
        // console.log(newVal);
        // console.log(oldVal);
      },
      deep: true
    },
    'form.skuList': {
      handler(newVal, oldVal) {
        // console.log(newVal);
        // console.log(oldVal);
      },
      deep: true
    }
  },
  created() {
    this.headers.tenant = 'MDAwMA=='
  },
  methods: {
    // proving1(e) {
    //   var keynum = window.event ? e.keyCode : e.which // 获取键盘码
    //   // var keychar = String.fromCharCode(keynum) // 获取键盘码对应的字符
    //   console.log(
    //     e.key
    //       .replace(/[^\d^\.]+/g, '')
    //       .replace('.', '$#$')
    //       .replace(/\./g, '')
    //       .replace('$#$', '.')
    //   )
    //   console.log(keynum)
    //   if (
    //     e.key
    //       .replace(/[^\d^\.]+/g, '')
    //       .replace('.', '$#$')
    //       .replace(/\./g, '')
    //       .replace('$#$', '.') === '' &&
    //     keynum !== 8
    //   ) {
    //     this.$message.warning('禁止输入中文或空')
    //     e.target.value = ' '
    //   }
    // },
    handleImageSuccess(response) {
      const url = response.data.url
      this.form.imgs.push({
        imgPath: url
      })
    },
    // 移除图片
    handleRemove(file) {
      const { imgPath } = file
      this.form.imgs = this.form.imgs.filter(item => {
        return item.imgPath !== imgPath
      })
    },
    handleRemove1(file) {
      file.image = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.imgPath
      this.dialogVisible = true
    },
    handleImageSuccess1(response, file, fileList) {
      const url = response.data.url
      fileList[0].image = url
    },
    del(row, index, arr) {
      console.log(row, index)
      // this.form.skuList.splice(index, 1);
      // console.log(this.form.skuAttrList);
      // console.log(this.form.skuList);
      console.log(arr)
    },
    //
    changeAttrStyle(index) {
      console.log(index)
      console.log(this.form)
      // if (index === 0) {
      //   this.form.skuAttrList = []
      // }
      if (index === 1) {
        addAttrValue(1);
      }
    },
    addSkuAttrList() {
      this.form.skuAttrList.push({
        code: '',
        skuName: '服务规格',
        values: [
          {
            skuValue: '',
            valueCode: '',
            image: '',
            isDelete: 0,
            sortOrder: 0
          }
        ],
        isDelete: 0,
        needImg: 0,
        sortOrder: 0
      })
    },
    addAttrValue(index) {
      this.form.skuAttrList[index].values.push({
        skuValue: '',
        valueCode: '',
        image: ''
      })
    },
    // 删除规格值
    delValue(index,index1){
      let newList = JSON.parse(JSON.stringify(this.form.skuAttrList[index]))
      let valueObj ={
        code:newList.code,
        skuId:newList.skuId,
        valueCode:newList.values[index1].valueCode
      }
      this.form.deletes.push(valueObj)
      this.form.skuAttrList[index].values.splice(index1,1)
    },
    // 删除规格名
    delSkuAttrList(index){
      const newList = JSON.parse(JSON.stringify(this.form.skuAttrList[index]))
      newList.values.forEach(item=>{
        const valueObj = {
          code:newList.code,
          skuId:newList.skuId,
          valueCode:''
        }
        valueObj.valueCode = item.valueCode
        this.form.deletes.push(valueObj)
      })
      this.form.skuAttrList.splice(index,1)
    },
    delAttrValue1(row,index, arr){

    },
    skuFormat() {
      const skuListArray = []
      const result = {
        isDelete: 0,
        productId: '',
        skuAttrCodeDTOList: [
          {
            code: '',
            valueCode: ''
          }
        ],
        sku: '',
        skuImg: '',
        price: 0,
        originalPrice: 0,
        stockNumber: 0,
        weight: 0
      }
      const doExchange = (arr, depth) => {
        const map = {
          arr: []
        }
        for (var i = 0; i < arr[depth].length; i++) {
          map.arr.push(arr[depth][i])
          const { code, valueCode, attrId } = arr[depth][i]
          result.skuAttrCodeDTOList[depth] = {
            code,
            valueCode,
            attrId
          }
          if (depth !== arr.length - 1) {
            doExchange(arr, depth + 1)
          } else {
            skuListArray.push(JSON.parse(JSON.stringify(result)))
          }
        }
      }
      // this.form.skuList  = skuListArray
      // 获取规格值的所有组合
      const values = []
      this.form.skuAttrList.map((skuItem, index) => {
        const attrList = []
        skuItem.code = skuItem.code || 'attr_code_' + index
        const { code } = skuItem
        skuItem.values &&
          skuItem.values.map((attrItem, index1) => {
            attrItem.valueCode = skuItem.valueCode || code + '_value_' + index1
            const skuId = attrItem.skuId
            const attrId = attrItem.attrId
            if (attrItem.skuValue) {
              attrList.push({
                skuId,
                attrId,
                code,
                valueCode: attrItem.valueCode
              })
            }
          })
        if (attrList.length) {
          values.push(attrList)
        }
      })
      // 相互组合
      if (values.length) {
        doExchange(values, 0)
      }
      this.form.skuList = skuListArray.map(sku1 => {
        const { skuAttrList, skuAttrCodeDTOList } = sku1
        const skuAttrList1 = skuAttrCodeDTOList || skuAttrList
        const skuMap = this.form.skuList.filter(sku2 => {
          const skuAttrList2 = sku2.skuAttrList
          sku2.skuAttrCodeDTOList = skuAttrList2
          if (!skuAttrList2) return false
          const ids = []
          skuAttrList1.filter(item => ids.push(item.id))
          const result = skuAttrList2.every(
            item => ids.indexOf(item.attrValueId) !== -1
          )
          return result
        })
        let selectMap = sku1
        if (skuMap && skuMap.length) {
          selectMap = JSON.parse(JSON.stringify(skuMap[0]))
          selectMap.skuAttrCodeDTOList = skuAttrCodeDTOList
        }
        return selectMap
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url("../../../styles/elDialog.scss");
.style-information-component {
  min-height: 300px;
  padding: 24px;
  background-color: rgb(255, 255, 255);
  .el-form-item {
    margin-bottom: 10px;
  }
  .attr-value-list {
    display: flex;
    flex-wrap: wrap;
    .main-diagram {
      width: 180px;
      .span-wrap {
        position: relative;
        display: inline-block;
        margin-top: 10px;
        .attr-actions {
          line-height: 100px;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: default;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          -webkit-transition: opacity 0.3s;
          transition: opacity 0.3s;
          z-index: 1;
          &:hover {
            opacity: 1;
            .attr-preview {
              display: inline-block;
            }
            i {
              color: #fff;
              font-size: 20px;
            }
          }
        }
        .attr-preview {
          display: none;
          cursor: pointer;
          font-size: 20px;
          color: #fff;
        }
        .attr-delete {
          margin-left: 15px;
          color: #fff;
        }
      }
      .attr-value-img {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
  .m-8 {
    margin-right: 8px;
  }
  .upload-btn {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 110px;
    cursor: pointer;
    border: 2px dashed #2e60f8;
    border-radius: 2px;
    background-color: #f8f9fb;
    text-align: center;
    font-size: 20px;
    color: #2e60f8;
    i {
      color: #2e60f8;
      font-size: 20px;
    }
    .upload-title {
      margin-left: 10px;
      font-size: 14px;
    }
  }
  .upload-wrap {
    margin-bottom: 25px;
    .el-upload-list__item {
      transition: none !important;
    }
    .el-upload,
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    .el-progress,
    .el-progress-circle {
      width: 80px !important;
      height: 80px !important;
    }
  }
  .sku-attr-list {
    .el-input {
      width: 180px;
    }
  }
  .single-style {
    .el-input {
      max-width: 180px;
    }
  }
  .add-attr-btn {
    margin-bottom: 25px;
  }
  .check-image-dialog {
    .el-dialog {
      margin-top: 25px;
      .el-dialog__body {
        img {
          max-width: 100%;
          max-height: 100%;
          height: 500px;
          object-fit: contain;
        }
      }
    }
  }
  .delImg{
    position: absolute;
    top: 12px;
    margin-left: -24px
  }
  .delImg:hover{
    border-radius: 50%;
    color: #ffffff;
    background:#2e60f8;
    cursor: pointer;
  }
}
</style>
