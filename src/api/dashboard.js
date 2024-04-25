import request from '@/utils/request'

//* ******************** 财务统计  *********************
// 财务统计数据查询
export function dashIndex(data) {
  return request({
    url: '/index/index',
    method: 'post',
    data
  })
}
