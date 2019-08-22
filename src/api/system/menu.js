import request from '@/utils/request'

const T = {}

T.tree = function() {
  return request({
    url: 'api/menu/tree',
    method: 'post'
  })
}

T.update = function(data) {
  return request({
    url: 'api/menu',
    method: 'put',
    dataType: 'json',
    data
  })
}

T.get = function(id) {
  return request({
    url: 'api/menu/' + id,
    method: 'get'
  })
}

T.add = function(data) {
  return request({
    url: '/api/menu',
    method: 'post',
    dataType: 'json',
    data
  })
}

T.delMenu = function(id) {
  return request({
    url: 'api/menu/' + id,
    method: 'delete'
  })
}

export default T
