const T = {}
/* 1.用浏览器内部转换器实现html编码（转义）*/
T.htmlEncode = function(html) {
  // 1.首先动态创建一个容器标签元素，如DIV
  let temp = document.createElement('div');
  // 2.然后将要转换的字符串设置为这个元素的innerText或者textContent
  (temp.textContent !== undefined) ? (temp.textContent = html) : (temp.innerText = html)
  // 3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
  const output = temp.innerHTML
  temp = null
  return output
}
/* 2.用浏览器内部转换器实现html解码（反转义）*/
T.htmlDecode = function(text) {
  // 1.首先动态创建一个容器标签元素，如DIV
  let temp = document.createElement('div')
  // 2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
  temp.innerHTML = text
  // 3.最后返回这个元素的innerText或者textContent，即得到经过HTML解码的字符串了。
  const output = temp.innerText || temp.textContent
  temp = null
  return output
}

/* 3.用正则表达式实现html编码（转义）*/
T.htmlEncodeByRegExp = function(str) {
  var temp = ''
  if (str.length === 0) return ''
  temp = str.replace(/&/g, '&amp;')
  temp = temp.replace(/</g, '&lt;')
  temp = temp.replace(/>/g, '&gt;')
  temp = temp.replace(/\s/g, '&nbsp;')
  temp = temp.replace(/\'/g, '&#39;')
  temp = temp.replace(/\"/g, '&quot;')
  return temp
},
/* 4.用正则表达式实现html解码（反转义）*/
T.htmlDecodeByRegExp = function(str) {
  var temp = ''
  if (str.length === 0) return ''
  temp = str.replace(/&amp;/g, '&')
  temp = temp.replace(/&lt;/g, '<')
  temp = temp.replace(/&gt;/g, '>')
  temp = temp.replace(/&nbsp;/g, ' ')
  temp = temp.replace(/&#39;/g, "\'")
  temp = temp.replace(/&quot;/g, '"')
  return temp
},
/* 5.用正则表达式实现html编码（转义）（另一种写法）*/
T.html2Escape = function(sHtml) {
  return sHtml.replace(/[<>&"]/g, function(c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] })
},
/* 6.用正则表达式实现html解码（反转义）（另一种写法）*/
T.escape2Html = function(str) {
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) { return arrEntities[t] })
}

export default T
