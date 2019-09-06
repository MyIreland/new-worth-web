<template>
  <div class="table-component">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
    </div>

    <div class="table-area">
      <el-table
        :data="data"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-for="item in fields"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
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
  </div>
</template>

<script>
  export default {
    name: 'BaseTable',
    props: {
      fields: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        multipleSelection: []
      }
    },
    methods: {
      openDialog(_index, row) {
        this.$parent.openDialog(_index, row)
      },
      batchDel() {
        this.$parent.batchDel(this.multipleSelection)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      edit(_index, row) {
        this.$parent.edit(_index, row)
      },
      handleDelete(_index, row) {
        this.$parent.handleDelete(_index, row)
      }
    }
  }
</script>

<style scoped>

</style>
