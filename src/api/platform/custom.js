import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/api/custom/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/custom',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/custom',
    method: 'put',
    dataType: 'json',
    data
  })
}

export function list(data) {
  return request({
    url: 'api/custom/list',
    method: 'post',
    data
  })
}

export function del(customId) {
  return request({
    url: 'api/custom/' + customId,
    method: 'delete'
  })
}

export function batchDel(data) {
  return request({
    url: 'api/custom/batchDel',
    method: 'post',
    data
  })
}

export function get(customId) {
  return request({
    url: 'api/custom/' + customId,
    method: 'get'
  })
}
