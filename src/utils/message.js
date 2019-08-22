import { Message } from 'element-ui'
const T = {}
T.error = function(msg, second) {
  second = second || 5 * 1000
  Message({
    message: msg,
    type: 'error',
    duration: second
  })
}

T.show = function(msg, type, second) {
  msg = msg || '操作成功'
  type = type || 'success'
  second = second || 5 * 1000
  Message({
    message: msg,
    type: type,
    duration: second
  })
}
export default T
