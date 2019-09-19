import request from '@/utils/request'
const T = {}
T.page = function(data) {
  return request({
    url: '/api/approvalTask/page',
    method: 'post',
    data
  })
}

T.add = function(data) {
  return request({
    url: 'api/approvalTask/add',
    method: 'post',
    data
  })
}

T.pageMyApprove = function(data) {
  return request({
    url: 'api/approvalTask/pageMyApprove',
    method: 'post',
    data
  })
}

T.listByUser = function(data) {
  return request({
    url: 'api/approvalTask/listByUser',
    method: 'post',
    data
  })
}

T.update = function(data) {
  return request({
    url: 'api/approvalTask',
    method: 'put',
    dataType: 'json',
    data
  })
}

T.get = function(id) {
  return request({
    url: 'api/approvalTask/' + id,
    method: 'get'
  })
}

T.del = function(id) {
  return request({
    url: 'api/approvalTask/' + id,
    method: 'delete'
  })
}

export default T
