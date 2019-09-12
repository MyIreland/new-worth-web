<template>
  <div class="app-container">
    <BaseSearch :fields="searchFields" ref="baseSearch"></BaseSearch>

    <ImageItem v-for="each in data" :key="each.id" :item="each"></ImageItem>
    <div class="clearBoth"></div>
    <BasePagination :pagination="pagination"></BasePagination>
  </div>
</template>

<script>
  import ImageItem from '@/components/Image/ImageItem'
  import { page, del } from '@/api/system/file'
  import BasePagination from '@/components/Table/BasePagination'
  import BaseSearch from '@/components/Table/BaseSearch'
  import message from '@/utils/message'

  const fileTypes = [{ label: '图片', value: 'img' }, { label: '文档', value: 'doc' }]
  export default {
    name: 'ImageList',
    components: {
      ImageItem,
      BasePagination,
      BaseSearch
    },
    data() {
      return {
        searchFields: [
          { key: 'type', label: '文件类型', type: 'select', options: fileTypes },
          { key: 'bizType', label: '业务类型', type: 'select', options: fileTypes },
          { key: 'url', label: '链接', type: 'input' }
        ],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 30
        },
        data: []
      }
    },
    methods: {
      query(searchForm) {
        const _this = this
        searchForm.current = this.pagination.current
        searchForm.size = this.pagination.pageSize
        page(searchForm).then(res => {
          const data = res.data
          _this.pagination.current = data.current
          _this.pagination.total = data.total
          _this.data = data.records
        })
      },
      deleteItem(item) {
        const id = item.id
        if (id) {
          del(id).then(res => {
            message.show()
            this.$refs.baseSearch.query()
          })
        }
      },
      handleSizeChange(val) {
        this.pagination.current = 1
        this.pagination.pageSize = val
        this.$refs.baseSearch.query()
      },
      handleCurrentChange(val) {
        this.pagination.current = val
        this.$refs.baseSearch.query()
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
