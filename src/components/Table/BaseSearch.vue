<template>
  <div class="search-area">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item v-for="item in fieldMap" :key="item.fieldName" :label="item.fieldDesc">
        <el-input v-if="!item.type || item.type==='input'" v-model="searchForm[item.fieldName]" :placeholder="item.placeholder || '请输入' + item.fieldDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SimpleTable',
    props: {
      /**
       * formMap: [{ fieldName: 'type', fieldDesc: '字典类型', type: 'input', placeholder: '请输入字典类型' }]
       */
      fieldMap: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        searchForm: {}
      }
    },
    methods: {
      query() {
        this.$parent.query(this.searchForm)
      },
      reset() {
        this.searchForm = {}
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
