<template>
  <div class="app-container">
    <BaseSearch :fields="searchFields" ref="baseSearch"/>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我创建的" name="myCreated">
        <el-table
          :data="myCreatedTable.data"
          ref="multipleTable"
          stripe
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="item in myCreatedTable.fields"
            :prop="item.prop"
            :label="item.label"
            :key="item.prop"
            :width="item.width">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="待我审批" name="myApprove">
        <el-table
          :data="myApproveTable.data"
          ref="multipleTable"
          stripe
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="item in myApproveTable.fields"
            :prop="item.prop"
            :label="item.label"
            :key="item.prop"
            :width="item.width">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <BasePagination :pagination="pagination"/>
  </div>
</template>

<script>
  import BaseSearch from '@/components/Table/BaseSearch'
  import BasePagination from '@/components/Table/BasePagination'
  import approvalTaskApi from '@/api/platform/approvalTask'
  import message from '@/utils/message'
  const modelTypes = [{ label: 'finance', value: 10 }, { label: '11', value: 11 }]
  const modelStatuses = [{ label: '进行中', value: 0 }, { label: '审批通过', value: 1 }, { label: '审批拒绝', value: 2 }, { label: '审批取消', value: 3 }]
  export default {
    name: 'index',
    components: {
      BaseSearch,
      BasePagination
    },
    data() {
      return {
        activeName: 'myCreated',
        myCreatedTable: {
          data: [],
          fields: [
            { prop: 'id', label: 'ID', width: 50 },
            { prop: 'name', label: '名称' },
            { prop: 'type', label: '类型' },
            { prop: 'status', label: '状态', width: 50 },
            { prop: 'userCreate', label: '创建人' },
            { prop: 'gmtCreate', label: '创建时间' }
          ]
        },
        myApproveTable: {
          data: [],
          fields: [
            { prop: 'id', label: 'ID', width: 50 },
            { prop: 'name', label: '名称' },
            { prop: 'type', label: '类型' },
            { prop: 'status', label: '状态', width: 50 },
            { prop: 'userCreate', label: '创建人' },
            { prop: 'gmtCreate', label: '创建时间' }
          ]
        },
        searchFields: [
          { key: 'name', label: '任务名称', type: 'input' },
          { key: 'type', label: '任务类型', type: 'select', options: modelTypes },
          { key: 'status', label: '任务状态', type: 'select', options: modelStatuses }
        ],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 20
        }
      }
    },
    methods: {
      handleDelete(_index, row) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            approvalTaskApi.del(row.id).then(res => {
              showAndQuery(_this)
            })
          }
        })
      },
      handleClick(tab, event) {
        this.$refs.baseSearch.query()
      },
      query(data) {
        const _this = this
        data.current = _this.pagination.current
        data.size = _this.pagination.pageSize
        if (_this.activeName === 'myCreated') {
          approvalTaskApi.pageByUser(data).then(res => {
            _this.myCreatedTable.data = res.data.records
          })
        } else if (_this.activeName === 'myApprove') {
          approvalTaskApi.pageMyApprove(data).then(res => {
            _this.myApproveTable.data = res.data.records
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
    }
  }
  const showAndQuery = function(_this) {
    message.show()
    _this.$refs.baseSearch.query()
  }
</script>

<style scoped>

</style>
