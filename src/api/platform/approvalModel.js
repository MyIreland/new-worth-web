import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/api/approvalModel/page',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/approvalModel/' + id,
    method: 'delete'
  })
}

export function add(data) {
  return request({
    url: 'api/approvalModel',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: 'api/approvalModel/updateStatus',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/approvalModel',
    method: 'put',
    dataType: 'json',
    data
  })
}

export function get(id) {
  return request({
    url: 'api/approvalModel/' + id,
    method: 'get'
  })
}
