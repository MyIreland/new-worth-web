import request from '@/utils/request'

export function page(data) {
  return request({
    url: 'api/task/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/task',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/task/' + id,
    method: 'delete'
  })
}

export function get(id) {
  return request({
    url: 'api/task/' + id,
    method: 'get'
  })
}

export function batchRemove(ids) {
  return request({
    url: 'api/task/batchRemove',
    method: 'post',
    dataType: 'json',
    data: {
      ids: ids
    }
  })
}

export function changeStatus(data) {
  return request({
    url: 'api/task/changeStatus',
    method: 'post',
    data
  })
}

export function updateCron(data) {
  return request({
    url: 'api/task/updateCron',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/task',
    method: 'put',
    dataType: 'json',
    data
  })
}
