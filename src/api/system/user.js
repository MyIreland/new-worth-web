import request from '@/utils/request'
const T = {}
T.page = function(data) {
  return request({
    url: 'api/user/page',
    method: 'post',
    data
  })
}

T.add = function(data) {
  return request({
    url: 'api/user',
    method: 'post',
    dataType: 'json',
    data
  })
}

T.update = function(data) {
  return request({
    url: 'api/user',
    method: 'put',
    dataType: 'json',
    data
  })
}

T.del = function(userId) {
  return request({
    url: 'api/user/' + userId,
    method: 'delete'
  })
}

T.get = function(userId) {
  return request({
    url: 'api/user/' + userId,
    method: 'get'
  })
}

T.setRole = function(data) {
  return request({
    url: 'api/user/setRole',
    method: 'post',
    data
  })
}
export default T
