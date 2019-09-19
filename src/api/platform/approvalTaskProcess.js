import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/api/approvalTaskProcess/updateStatus',
    method: 'post',
    data
  })
}
