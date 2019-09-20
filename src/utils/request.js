import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import { getToken } from '@/utils/auth'
import message from '@/utils/message'
// 请自行在引入 MessageBox
import { MessageBox } from 'element-ui'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  fixedContentType(config)
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    const code = res.code
    if (code) {
      if (code === 200) {
        if (res.message) {
          message.show(res.message)
        }
        return res
      } else {
        message.error(res.message)
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        if (code === 50008 || code === 50012 || code === 50014) {
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }
        return Promise.reject('error')
      }
    }
    return res
  },
  error => {
    const errorData = error.response.data
    console.log(errorData) // for debug
    const msg = errorData.msg || errorData.message || errorData.error_description || '未知错误！'
    message.error(msg)

    return Promise.reject(error)
  })

const fixedContentType = function(config) {
  const dataType = config.dataType || 'form'
  switch (dataType) {
    case 'json':
      config.headers['Content-Type'] = 'application/json'
      break
    case 'file':
      config.headers['Content-Type'] = 'multipart/form-data'
    // eslint-disable-next-line no-fallthrough
    default:
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      // 序列化
      config.data = qs.stringify(config.data)// 温馨提示,后台可以直接接受json 格式,可以不用 qs 来序列化的
  }
}
export default service
