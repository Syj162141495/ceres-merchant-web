// import router from '@/router'
import api from '../api'
import {sendReq} from './sendReqMixin'
import { mapMutations } from 'vuex'
import canvasConfig from '../config'
/*
 * 公共方法的 mixin
 */
export const tool = {
  mixins: [sendReq],
  props: {
    isNoData: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    console.log('加载了组件')
  },

  methods: {
    ...mapMutations({
      setCurrentPro: 'SET_CURRENTPRO'
    }),
    // 判断url
    jumpLink (linkObj) {
      var link = ''
      if(linkObj && linkObj.typeText && linkObj.data){
        switch (linkObj.typeText) {
          case '类别':
            router.push({name:'category',query:{classifyData:JSON.stringify(linkObj.data)}})
            break
          case '店辅':
            router.push({
              path: '/store',
              query: {shopId: linkObj.data.shopId}
            });
            break
          case '商品':
            this.setCurrentPro(linkObj.data)
            router.push("/productDetail");
            break
          case '自定义':
            // router.push("/category");
            break
        }
      } else if(linkObj.selsectValue==='/index'){
        router.push("/index");
      }
      return link
    },
    // 跳转到类别主页
    jumpCategory(item){
    },
    // 跳转到店铺主页
    jumpStore(item){

    },
    // 跳转到商品详情
    jumpProductDetail(item){
    },
    // 跳转到秒杀专区
    jumpSeckills(item){
    },
    // 跳转到拼团专区
    jumpGroupWorks(item){
    },
    // 跳转到折扣专区
    jumpDiscount(item){
    },
    // 跳转到会员专区
    jumpVip(){
    },
    // 跳转到公告详情
    jumpNoticeDetail(item){
    },
    // 领取优惠券
    receiveCoupon(item) {
      var key = canvasConfig.getToken()
      if (key) {
        var paramsData = {}
        if(this.typeId === 1){
          paramsData.couponId = item.couponId
        } else if(this.typeId === 3) {
          paramsData.shopCouponId = item.shopCouponId
          paramsData.shopId = this.shopId
        }
        let params = {
          url: api.takeCoupon,
          method: 'POST',
          data: paramsData
        }
        this.sendReq(params, (res) => {
          this.$message({
            message: '领取成功！',
            type: 'success'
          })
          this.getData()
        })
      } else {
        this.$message({
          message: '请先登录'
        })
        this.$router.push({path: '/login'})
      }
    },
    // 加入购物车
    addCart(id){
      console.log(id)
    }
  }
}
