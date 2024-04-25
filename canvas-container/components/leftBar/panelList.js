// 导入api接口模块
export const panelList = [
  {
    title: '基础组件',
    type: 1,
    classList: [
      {
        title: '轮播图',
        iconClass: 'icon-lunbo',
        type: 'banner',
        componentContent: {
          height: 500,
          bannerData: [{
            bannerUrl: '',
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            }
          }]
        }
      },
      {
        title: '标题文本',
        iconClass: 'icon-wenben',
        type: 'text',
        componentContent: {
          title: '标题', // 标题内容
          describe: '描述', // 描述内容
          textPos: 'left', // 文本对齐方向
          fontSizeNum: '16', // 文本字体大小
          describeSizeNum: '14', // 描述字体大小
          textFontW: 'normal', // 文本粗细
          describeFontW: 'normal', // 描述粗细
          titColor: '#333333', // 文本颜色
          describeColor: '#666666', // 描述颜色
          bgColor: '#FFFFFF', // 文本背景
          showLine: false, // 显示隐藏下划线
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
          link: '' // 查看更多链接
        }
      },
      {
        title: '公告',
        iconClass: 'icon-gonggao1',
        type: 'notice',
        onlyAdmin: true, // 平台端显示
        componentContent: {
          titColor: '#FFFFFF', // 文本颜色
          bgColor: '#333333', // 文本背景
        }
      },
      {
        title: '品牌列表',
        iconClass: 'icon-pinpailiebiao',
        type: 'brandList',
        componentContent: {
          title: '品牌列表',
          imgList: [{
            title: '标题一',
            imgData: '',
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            }
          }, {
            title: '标题二',
            imgData: '',
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            }
          }, {
            title: '标题三',
            imgData: '',
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            }
          }, {
            title: '标题四',
            imgData: '',
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            }
          }],
          textAlign: 'left',
          imgCurrent: null
        }
      },
      {
        title: '图文',
        iconClass: 'icon-tuwen',
        type: 'imageText',
        componentContent: {
          imageUrl: '',
          linkObj: {
            selsectValue: '',
            selectName: '',
            typeText: '',
            url: ''
          },
          positionValue: 'left',
          title: 'title',
          content: ''
        }
      },
      {
        title: '图文列表',
        iconClass: 'icon-tuwenliebiao',
        type: 'imageTextList',
        componentContent: {
          title: '标题',
          textAlign: 'left',
          imgTextData: [{
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            },
            isShow: true,
            title: '图文标题',
            describe: '告别生活，畅享便携生活',
            imgData: ''
          }, {
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            },
            isShow: true,
            title: '图文标题',
            text: '告别生活，畅享便携生活',
            imgData: ''
          }, {
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            },
            isShow: true,
            title: '图文标题',
            describe: '告别生活，畅享便携生活',
            imgData: ''
          }]
        }
      },
      {
        title: '图文导航',
        iconClass: 'icon-tuwendaohang',
        type: 'imageTextNav',
        componentContent: {
          imgTextData: [{
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            },
            title: '标题',
            img: ''
          }, {
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            },
            title: '标题',
            img: ''
          }, {
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            },
            title: '标题',
            img: ''
          }]
        }
      },
      {
        title: '铺助分割',
        iconClass: 'icon-fuzhufenge',
        type: 'assistDiv',
        componentContent: {
          height: 20,
          bgColor: '#ffffff'
        }
      },
      {
        title: '自定义',
        iconClass: 'icon-mofang1',
        type: 'custom',
        componentContent: {
          layoutType: 'L1',
          density: '4',
          maxH: 0,
          imgClearance: 0,
          pageSpacing: 0,
          averageBoxData: [], // 记录格子的激活状态
          imgBoxActive: 0, // 记录框的位置
          elementNum: 1, // 生成格子数量
          imgData: [{
            src: '',
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            }
          }, {
            src: '',
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            }
          }]
        }
      },
      {
        title: '视频',
        iconClass: 'icon-shipin',
        type: 'videoBox',
        componentContent: {
          title: '标题',
          videoUrl: 'http://cereshop.oss-cn-shenzhen.aliyuncs.com/0000/2020/05/432bb17e-536c-4762-a699-b3f5a2642742.mp4',
          mainBody: '描述'
        }
      }
    ]
  },
  {
    title: '商品组件',
    type: 1,
    classList: [
      {
        title: '商品列表',
        iconClass: 'icon-shangpin',
        type: 'productList',
        componentContent: {
          title: '商品列表',
          productData: {
            sourceType: '1',
            categoryId: 0,
            categoryName: '',
            imgTextData: [],
            productIdList: [],
          },
          productRowNum: 1, // 展示行数
          productNum: 4, //  展示列数
          arrangeType: '多行多列', // 布局方式
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
          linkObj: {
            selsectValue: '',
            selectName: '',
            typeText: '',
            url: ''
          } // 查看更多链接
        }
      },
      {
        title: '类别列表',
        iconClass: 'icon-leibieliebiao',
        type: 'categoryList',
        componentContent: {
          title: '类别列表',
          categoryData: [
            {
              id: '1',
              selClassData: [],
              img: ''
            },
            {
              id: '2',
              selClassData: [],
              img: ''
            },
            {
              id: '3',
              selClassData: [],
              img: ''
            },
            {
              id: '4',
              selClassData: [],
              img: ''
            }
          ],
          textAlign: 'center'
        }
      }
    ]
  },
  {
    title: '店铺组件',
    type: 2,
    classList: [
      {
        title: '拼团专区',
        iconClass: 'icon-pintuan1',
        type: 'groupList',
        componentContent: {
          // title: '拼团专区',
          productData: {
            products:[]
          },
          productRowNum: 1, // 展示行数
          productNum: 4, //  展示列数
          arrangeType: '多行多列', // 布局方式
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
          shopGroupWorkId: '',
        }
      },
      {
        title: '秒杀专区',
        iconClass: 'icon-miaosha1',
        type: 'spikeList',
        componentContent: {
          // title: '秒杀专区',
          productData: {
            products:[]
          },
          shopSeckillId: ''
        }
      },
      {
        title: '限时折扣',
        iconClass: 'icon-zhekou1',
        type: 'discountList',
        componentContent: {
          // title: '限时折扣',
          productData: {},
          discountId: '',
          arrangeType: '多行多列', // 布局方式
          moreBg: ''
        }
      },
      {
        title: '定价捆绑',
        iconClass: 'icon-price',
        type: 'priceList',
        onlyMerchant: true, // 商家端显示
        componentContent: {
          // title: '定价捆绑',
          productData: {
            composeProducts:[]
          },
          productRowNum: 1, // 展示行数
          productNum: 4, //  展示列数
          arrangeType: '多行多列', // 布局方式
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样Z
          priceId: ''
        }
      },
      {
        title: '会员专区',
        iconClass: 'icon-huiyuan',
        type: 'vip',
        onlyAdmin: true, // 平台端显示
        componentContent: {
          // title: '会员专区',
          productData: {
            productIdList: [],
          },
          productRowNum: 1, // 展示行数
          productNum: 4, //  展示列数
          arrangeType: '多行多列', // 布局方式
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
        }
      },
      {
        title: '优惠券',
        iconClass: 'icon-youhuiquan',
        type: 'coupon',
        componentContent: {
          arrangeActiveIndex: 2,
          cardActiveIndex: 1,
          colorActiveIndex: 0,
          selectedCoupon: [],
        }
      },
      {
        title: '每日上新',
        iconClass: 'icon-new',
        type: 'newProduct',
        onlyApp: true, // 只在app显示
        componentContent: {
          productData: {
            sourceType: '1',
            imgTextData: [],
            productIdList: [],
          },
          showMore: false, // 显示隐藏更多
          styleValue: '1', // 查看更多样式
          linkObj: {
            selsectValue: '',
            selectName: '',
            typeText: '',
            url: ''
          } // 查看更多链接
        }
      },
      {
        title: '每日好店',
        iconClass: 'icon-toubu',
        type: 'shop',
        onlyApp: true, // 只在app显示
        componentContent: {
          imgTextData: [{
            linkObj: {
              selsectValue: '',
              selectName: '',
              typeText: '',
              url: ''
            },
            img: ''
          }]
        }
      }
    ]
  }
]
export default panelList
