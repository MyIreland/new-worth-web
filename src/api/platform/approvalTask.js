import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/api/approvalTask/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/approvalTask',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function pageMyApprove(data) {
  return request({
    url: 'api/approvalTask/pageMyApprove',
    method: 'post',
    data
  })
}

export function listByUser(data) {
  return request({
    url: 'api/approvalTask/listByUser',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/approvalTask',
    method: 'put',
    dataType: 'json',
    data
  })
}

export function get(id) {
  return request({
    url: 'api/approvalTask/' + id,
    method: 'get'
  })
}
