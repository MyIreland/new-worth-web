import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/api/tenant/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/tenant',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/tenant',
    method: 'put',
    dataType: 'json',
    data
  })
}

export function list(data) {
  return request({
    url: 'api/tenant/list',
    method: 'post',
    data
  })
}

export function del(tenantId) {
  return request({
    url: 'api/tenant/' + tenantId,
    method: 'delete'
  })
}

export function batchDel(data) {
  return request({
    url: 'api/tenant/batchDel',
    method: 'post',
    data
  })
}

export function get(tenantId) {
  return request({
    url: 'api/tenant/' + tenantId,
    method: 'get'
  })
}
