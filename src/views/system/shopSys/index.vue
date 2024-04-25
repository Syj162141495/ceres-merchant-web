<template>
  <div class="setting-shop-page">
    <el-form ref="form" :model="form" label-width="100px">
      <div class="h5">
        <div class="title">店铺信息</div>
        <el-button type="text" @click="editDisabled1">编辑</el-button>
        <el-button v-if="!disabled1" type="text" @click="editDisabled1">取消</el-button>
        <el-button v-if="!disabled1" type="text" @click="updateStore">保存</el-button>
      </div>
      <div class="shop-details">
        <el-form-item label="店铺logo">
          <el-upload
            :class="[{'avatar-uploader': !storeDetails.shopLogo}]"
            :headers="headers"
            :data="dataObj"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :disabled="disabled1"
          >
            <img
              v-if="storeDetails.shopLogo"
              :src="storeDetails.shopLogo"
              class="avatar"
              width="80"
              height="80"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input v-model="storeDetails.shopName" :disabled="disabled1" />
        </el-form-item>
        <el-form-item label="发货地址">
          <el-input
            v-model="storeDetails.shopAdress"
            :disabled="disabled1"
            :resize="`${disabled1? 'none':''}`"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="店铺简介">
          <el-input
            v-model="storeDetails.shopBrief"
            :disabled="disabled1"
            :resize="`${disabled1? 'none':''}`"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="注册手机号">
          <el-input v-model="storeDetails.shopPhone" :disabled="disabled1" />
        </el-form-item>
      </div>
      <div class="h5">
        <div class="title">店铺认证</div>
      </div>
      <div class="shop-details" style="overflow: hidden;line-height:40px;">
        微信支付-商户认证
        <!-- <el-button type="primary" style="float:right" @click="approve">立即认证</el-button> -->
      </div>
      <div class="h5">
        <div class="title">退货地址</div>
      </div>
      <div class="shop-details">
        <el-form-item label="地址">
          <el-input v-model="storeDetails.shopReturn.returnAdress" :disabled="disabled1" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="storeDetails.shopReturn.returnPerson" :disabled="disabled1" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="storeDetails.shopReturn.returnPhone" :disabled="disabled1" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { shopSysGetById, shopSysUpdate } from '@/api/shopSys'
import { uploadUrl } from '@/utils/request'
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        logo: ''
      },
      headers: {
        Authorization: ''
      },
      action: uploadUrl,
      dataObj: {
        folderId: 1
      },
      disabled1: true,
      storeDetails: {}
    }
  },
  created() {
    this.getStoreDetails()
  },
  methods: {
    async getStoreDetails() {
      const res = await shopSysGetById({ })
      if (res.code === '') {
        this.storeDetails = res.data
      }
    },
    onSubmit() {
      console.log('submit!')
    },
    // 编辑取消
    editDisabled1() {
      this.disabled1 = !this.disabled1
    },
    async updateStore() {
      const res = await shopSysUpdate(this.storeDetails)
      if (res.code === '') {
        this.disabled1 = true
        this.$message({
          message: '成功',
          type: 'success'
        })
      }
    },
    handleAvatarSuccess(response) {
      const { url } = response.data
      this.storeDetails.shopLogo = url
    },
    approve() {
      this.$router.push({ path: '/setting/shop/wechat-approve' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url("../../../styles/elDialog.scss");
.setting-shop-page {
  margin-top: 20px;
  min-height: calc(100% - 20px);
  background-color: #ffffff;
  padding: 15px 20px;
  .h5 {
    max-width: 1000px;
    display: flex;
    font-size: 20px;
    margin: 20px auto;
    padding-left: 10px;
    padding-right: 300px;
    flex-wrap: 800;
    .title {
      flex: 1;
    }
  }
  .shop-details {
    max-width: 800px;
    margin: auto;
    .el-input,
    .el-textarea {
      width: 380px;
    }
    // 不能编辑样式
    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner {
      cursor: inherit;
      background-color: #f8f8f8;
      border: 1px solid #f8f8f8;
      color: #606266;
    }
  }
  .avatar-uploader {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    line-height: 80px;
    text-align: center;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
      }
    }
  }
}
</style>
