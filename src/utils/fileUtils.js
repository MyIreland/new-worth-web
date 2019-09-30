import http from '@/utils/request'
const T = {}

T.deleteFile = function(config) {
  http.get(config.url, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'Authorization': 'Basic bmV3LXdvcnRoOjEyMzQ1Ng=='
  }).then(function(data) {
    config.success(data)
  })
}

T.import = (config) => {
  http.post(config.url, config.data, {
    'dataType': 'file',
    'Accept': 'application/json'
  }).then(function(data) {
    config.success(data)
  })
}

T.XHRDownload = function(config) {
  var url = config.url // 下载地址
  var type = config.type || 'GET' // 请求方式
  var data = config.data // 请求参数
  var fileName = config.fileName // 文件名

  url = jointUrl(url, data)

  var xhr = new XMLHttpRequest()
  xhr.open(type, url, true) // 也可以使用POST方式，根据接口
  xhr.responseType = 'blob' // 返回类型blob
  // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
  xhr.onload = function() {
    // 请求完成
    if (this.status === 200) {
      // 返回200
      var blob = this.response
      var reader = new FileReader()
      reader.readAsDataURL(blob) // 转换为base64，可以直接放入a表情href
      reader.onload = function(e) {
        // 转换完成，创建一个a标签用于下载
        var a = document.createElement('a')
        a.download = fileName
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
      config.success(data)
    }
  }
  // 发送ajax请求
  xhr.send()
}

T.downloadByCreateAEle = function(config) {
  var url = config.url // 下载地址
  var data = config.data // 请求参数

  url = jointUrl(url, data)

  var aEle = document.createElement('a')
  aEle.href = url
  aEle.target = '_blank'
  document.body.appendChild(aEle)

  aEle.click()
  aEle.remove()
}

var jointUrl = function(url, data) {
  var firstFlag = true
  for (var i in data) {
    if (firstFlag) {
      url += '?' + i + '=' + data[i]
      firstFlag = false
    } else {
      url += '&' + i + '=' + data[i]
    }
  }
  return url
}

export default T
