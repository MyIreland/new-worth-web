<template>
  <div class="pagination-area">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-size="pagination.pageSize"
      :page-sizes="pageSizes"
      layout="sizes, prev, pager, next, total, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'BasePagination',
    props: {
      pagination: {
        type: Object,
        default: () => {
          return {
            current: 1,
            pageSize: 20,
            total: 0
          }
        }
      },
      pageSizes: {
        type: Array,
        default: () => [20, 30, 50, 100, 150, 200]
      }
    },
    methods: {
      handleSizeChange(val) {
        this.$parent.handleSizeChange(val)
      },
      handleCurrentChange(val) {
        this.$parent.handleCurrentChange(val)
      }
    }
  }
</script>

<style scoped>

</style>
