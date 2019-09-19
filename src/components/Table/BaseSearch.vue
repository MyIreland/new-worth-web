<template>
  <div class="search-area">
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" ref="searchForm"  class="demo-form-inline">
        <el-form-item v-for="item in fields" :key="item.key" :label="item.label">
          <el-input v-if="!item.type || item.type==='input'" v-model="searchForm[item.key]"
                    :placeholder="item.placeholder || '请输入' + item.label"></el-input>

          <el-select clearable v-else-if="item.type==='select'" v-model="searchForm[item.key]" :multiple="item.multiple"
                     :placeholder="item.placeholder || '请选择' + item.label">
            <el-option
              v-for="each in item.options"
              :key="each.value"
              :label="each.label"
              :value="each.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-button">
      <el-button type="success" icon="el-icon-search" @click="query">查询</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="reset('searchForm')">重置</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseSearch',
    props: {
      fields: {
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
      reset(searchForm) {
        this.$refs[searchForm].resetFields()
        this.$parent.query(this.searchForm)
      }
    },
    created() {
      this.query()
    }
  }
</script>

<style scoped>

</style>
