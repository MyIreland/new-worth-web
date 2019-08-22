import message from '@/utils/message'
const T = {}

T.confirm = function(_this, param) {
  const title = param.title || '是否执行该操作吗？'
  const type = param.type || 'warning'
  const successFun = param.success || message.show
  const errorFun = param.error || message.error
  _this.$confirm(title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: type
  }).then(() => {
    successFun()
  }).catch((res) => {
    errorFun(res)
  })
}
export default T
