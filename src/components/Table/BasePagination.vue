<template>
  <div class="pagination-area">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
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
            pageSizes: [20, 50, 100, 150, 200],
            pageSize: 20,
            total: 0
          }
        }
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
