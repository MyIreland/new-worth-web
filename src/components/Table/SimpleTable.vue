<template>
  <div class="components-container">
    <div class="search-area" v-if="searchAreaConfig.showFlag">
      <el-form :inline="true" :model="searchAreaConfig.form" class="demo-form-inline">
        <el-form-item label="字典类型">
          <el-input v-model="searchForm.type" placeholder="请输入字典类型"></el-input>
        </el-form-item>
        <el-form-item label="字典描述">
          <el-input v-model="searchForm.description" placeholder="请输入字典描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="success" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
    </div>

    <div class="table-area">
      <el-table
        :data="tableData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="55">
        </el-table-column>
        <el-table-column
          prop="type"
          label="字典码">
        </el-table-column>
        <el-table-column
          prop="description"
          label="字典码描述">
        </el-table-column>
        <el-table-column
          prop="value"
          label="字典值">
        </el-table-column>
        <el-table-column
          prop="label"
          label="字典值描述">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="openDialog(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-area">
      <span class="demonstration">完整功能</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SimpleTable',
    props: {
      // 查询参数
      searchParam: {
        type: Object,
        default: {}
      },
      // 表单数据
      tableForm: {
        type: Object,
        required: true
      },
      // 分页功能
      pageConfig: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        searchAreaConfig: {
          showFlag: true,
          form: {},
          formMap: {}

        },
        tableConfig: {

        },
        pageConfig: {

        }
      }
    }
  }
</script>

<style scoped>

</style>
