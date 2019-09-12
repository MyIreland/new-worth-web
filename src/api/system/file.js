import request from '@/utils/request'

export function page(data) {
  return request({
    url: '/api/file/page',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/file/' + id,
    method: 'delete'
  })
}

export function delBatch(data) {
  return request({
    url: '/api/file/delBatch',
    method: 'post',
    dataType: 'json',
    data
  })
}
