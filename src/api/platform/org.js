import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/api/org/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/org',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/org',
    method: 'put',
    dataType: 'json',
    data
  })
}

export function list(data) {
  return request({
    url: 'api/org/list',
    method: 'post',
    data
  })
}

export function del(orgId) {
  return request({
    url: 'api/org/' + orgId,
    method: 'delete'
  })
}

export function batchDel(data) {
  return request({
    url: 'api/org/batchDel',
    method: 'post',
    data
  })
}

export function get(orgId) {
  return request({
    url: 'api/org/' + orgId,
    method: 'get'
  })
}
