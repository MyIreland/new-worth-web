import request from '@/utils/request'
const T = {}

T.page = function(data) {
  return request({
    url: 'api/dict/page',
    method: 'post',
    data
  })
}

T.get = function(id) {
  return request({
    url: 'api/dict/' + id,
    method: 'get'
  })
}

T.save = function(data) {
  return request({
    url: 'api/dict',
    method: 'post',
    dataType: 'json',
    data
  })
}

T.update = function(data) {
  return request({
    url: 'api/dict',
    method: 'put',
    dataType: 'json',
    data
  })
}

T.del = function(id) {
  return request({
    url: 'api/dict/' + id,
    method: 'delete'
  })
}

T.batchDel = function(ids) {
  return request({
    url: 'api/dict/batchDel',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export default T
