<!--  -->
<template>
  <div>
    <!-- 卡片栏 -->
    <div class="cardStyle">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="card_span">店铺设置</span>
          <el-button class="btnShop" type="text" @click="save">保存</el-button>
          <el-button
            class="resBtn"
            type="text"
            @click="
              {
              }
            "
          >取消</el-button>
        </div>
        <!-- 详情 -->
        <div class="shopDetail">
          <div class="shopDetail_l">
            <div class="shopMsg">店铺信息</div>
            <div class="logo">店铺logo</div>
            <div class="shopLogon">
              <!-- 上传图片 -->
              <div class="uploadWidth">
                <el-upload
                  :action="upload"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus" />
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt>
                </el-dialog>
              </div>
            </div>
            <div class="common">
              <div class="span_1">店铺名称：</div>
              <el-input v-model="shopObj.name" placeholder="请输入店铺名称" />
            </div>
            <div class="common">
              <div class="span_1">发货地址：</div>
              <el-input v-model="shopObj.address" placeholder="请输入发货地址" />
            </div>
            <div class="common">
              <div class="span_1">店铺简介：</div>
              <el-input v-model="shopObj.det" placeholder="请输入店铺简介" />
            </div>
            <div class="common">
              <div class="span_1">注册手机号：</div>
              <el-input v-model="shopObj.phone" placeholder="请输入注册手机号" />
            </div>
          </div>
          <div class="shopDetail_r">
            <div class="shopMsg">退货地址</div>
            <div class="common">
              <div class="span_1">退货地址：</div>
              <el-input v-model="shopObj.phone" placeholder="请输入退货地址" />
            </div>
            <div class="common">
              <div class="span_1">联系人</div>
              <el-input v-model="shopObj.phone" placeholder="请输入联系人" />
            </div>
            <div class="common">
              <div class="span_1">联系电话</div>
              <el-input v-model="shopObj.phone" placeholder="请输入联系电话" />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { uploadUrl } from '@/utils/request'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      dialogImageUrl: '',
      upload: uploadUrl,
      dialogVisible: false,
      shopObj: {
        name: '',
        address: '',
        det: '',
        phone: ''
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.data.url
      this.dialogVisible = true
    },
    // 保存
    save() {
      this.$router.push({ name: 'editShopSys', params: { id: '1' }})
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.shopDetail {
  display: flex;
  margin: 50px 50px;
}
.shopDetail_l {
  width: 49%;
}
.shopDetail_r {
  width: 49%;
}
.resBtn {
  float: right;
  width: 100px;
  height: 48px;
  background: #ffffff;
  border-radius: 4px;
  color: #333333;
  border: 1px solid #e0e5eb;
  margin-right: 20px;
}
.btnShop {
  float: right;
  width: 100px;
  height: 48px;
  background: #409eff;
  border-radius: 4px;
  color: #ffffff;
}
.common {
  padding: 10px;
}
.span_f {
  display: flex;
}
.card_span {
  font-size: 24px;
  color: #333333;
}
.shopMsg {
  font-size: 24px;
  color: #333333;
  padding: 10px;
}
.logo {
  font-size: 16px;
  color: #333333;
  padding: 10px;
}
.shopLogon {
  padding: 10px;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}
.span_1 {
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;
}
.span_2 {
  font-size: 16px;
  color: #666666;
  width: 500px;
}
</style>
