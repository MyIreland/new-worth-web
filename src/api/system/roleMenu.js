import request from '@/utils/request'

export function getMenuIdsByRoleId(roleId) {
  return request({
    url: 'api/roleMenu/' + roleId,
    method: 'get'
  })
}

export function bindRoleMenu(data) {
  return request({
    url: 'api/roleMenu/bindRoleMenu',
    method: 'post',
    dataType: 'json',
    data
  })
}
