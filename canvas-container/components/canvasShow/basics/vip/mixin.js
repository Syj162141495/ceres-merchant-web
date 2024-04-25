import { directive, Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import api from '../../config/api'
import {funMixin} from '../../config/mixin'

export const commonMixin = {
  name: 'productList',
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
      productData: []
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
      _.sendReq({
        url: `${api.getMemberProducts}?page=1&pageSize=20`,
        method: 'GET'
      }, (proRes) => {
        _.productData = proRes.data.list
      })
    }
  }
}
