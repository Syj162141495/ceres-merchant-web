import { directive, Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import api from '../../config/api'
import {funMixin} from '../../config/mixin'

export const commonMixin = {
  name: 'price',
  mixins: [funMixin],
  props: {
    terminal: {
      type: Number,
      default: 4
    },
    typeId: {
      type: Number,
      default: 1
    },
    shopId: {
      type: Number,
      default: 0
    },
    componentContent: {
      type: Object
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  data () {
    return {
      productData: {
        composeProducts:[],
        rules: [{
          price: null,
          number: null
        }]
      }
    }
  },
  watch: {
    'componentContent': {
      handler(newVal, oldVal) {
        this.getData()
      },
      deep: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
      getData() {
        const _ = this
        if(_.componentContent.priceId){
          const params = {
            method: 'GET',
            url: `${api.getPrices}?shopId=${_.shopId}&ids=${_.componentContent.priceId}`,
          }
          this.sendReq(params, (res) => {
            if( res.data.length > 0){
              _.productData = res.data[0]
            }
          })
        } else {
          _.productData = {
            products:[]
          }
        }
      },
  }
}
