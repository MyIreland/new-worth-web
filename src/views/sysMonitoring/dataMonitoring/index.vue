<template>
  <div class="app-container">
    <div v-html="html"></div><!--todo 代理css跟js的请求位添加api前缀-->
  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    name: 'index',
    data() {
      return {
        html: ''
      }
    },
    created() {
      const _this = this
      request.get('api/druid/index.html').then(res => {
        res.replace('href=\'', 'href=\'api/')
        res.replace('src="', 'src="api/')
        console.log(res)
        _this.html = res
      })
    }
  }
</script>

<style scoped>

</style>
