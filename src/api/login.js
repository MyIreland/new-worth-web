import request from '@/utils/request'

/**
 * 默认是new-worth
 * @param username
 * @param password
 */
export function loginByUsername(username, password) {
  const data = {
    username,
    password,
    grant_type: 'password'
  }
  return request({
    url: 'api/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic bmV3LXdvcnRoOjEyMzQ1Ng=='
    },
    data
  })
}

export function logout() {
  return request({
    url: 'api/oauth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: 'api/oauth/currentUser',
    method: 'get',
    dataType: 'json'
  })
}

