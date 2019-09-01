import request from '@/utils/request'

export function page(data) {
  return request({
    url: 'api/role/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/role',
    method: 'post',
    dataType: 'json',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/role',
    method: 'put',
    dataType: 'json',
    data
  })
}

export function list(data) {
  return request({
    url: 'api/role/list',
    method: 'post',
    data
  })
}

export function del(roleId) {
  return request({
    url: 'api/role/' + roleId,
    method: 'delete'
  })
}

export function get(roleId) {
  return request({
    url: 'api/role/' + roleId,
    method: 'get'
  })
}

export function roleTreeListByIdUser(idUser) {
  return request({
    url: '/role/roleTreeListByIdUser',
    method: 'get',
    params: {
      idUser: idUser
    }
  })
}

export function savePermissons(params) {
  return request({
    url: '/role/savePermisson',
    method: 'post',
    params
  })
}
