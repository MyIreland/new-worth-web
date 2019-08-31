<template>
  <div>
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
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
          width="55"
          v-show="tableConfig.selection">
        </el-table-column>
        <el-table-column
          v-for="item in fieldMap"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop">
        </el-table-column>
        <el-table-column v-show="tableConfig.options" label="操作">
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

    <div class="pagination-area" v-show="tableConfig.pagination">
      <span class="demonstration">完整功能</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
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
    name: 'BaseTable',
    props: {
      tableConfig: {
        type: Object,
        default: () => {}
      },
      fieldMap: {
        type: Array,
        default: () => []
      },
      tableData: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {}
    },
    methods: {
      handleSelectionChange(val) {
        this.$parent.childHandleSelectionChange(val)
      },
      add() {
        this.$parent.childAdd()
      },
      batchDel() {
        this.$parent.childBatchDel()
      },
      handleSizeChange() {},
      handleCurrentChange() {}
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
