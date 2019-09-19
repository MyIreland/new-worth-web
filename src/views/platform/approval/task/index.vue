<template>
  <div class="app-container">
    <BaseSearch :fields="searchFields" ref="baseSearch"/>

    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="addOrUpdate">添加</el-button>
    </div>

    <div class="table-area">
      <el-table
        :data="table.data"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-for="item in table.fields"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="update(scope.$index, scope.row)">编辑
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

    <el-dialog title="新建任务" :visible.sync="dialog.show">
      <el-form :model="dialog.form" ref="dialogForm">
        <el-form-item prop="name" label="任务名称" :label-width="dialog.formLabelWidth" :rules="[{required: true, message: '任务名称必填'}]">
          <el-input v-model="dialog.form.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item prop="modelId" label="任务模型" :label-width="dialog.formLabelWidth" :rules="[{required: true, message: '任务模型必选'}]">
          <el-select v-model="dialog.form.modelId" placeholder="请选择任务模型">
            <el-option v-for="item in dialog.modelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" ref="dialogUpdateForm" :visible.sync="updateDialog.show">
      <el-form :model="updateDialog.form" :rules="updateDialog.rules" ref="form">
        <p class="form-item-title">基本信息</p>
        <el-form-item v-for="item in updateDialog.fields" :key="item.key" :label="item.label" :prop="item.key"
                      :label-width="updateDialog.formLabelWidth">
          <el-input v-if="!item.type || item.type==='input'" v-model="updateDialog.form[item.key]" disabled
                    :placeholder="item.placeholder || '请输入' + item.label"></el-input>
          <el-select v-else-if="item.type==='select'" v-model="updateDialog.form[item.key]" :multiple="item.multiple" disabled
                     :placeholder="item.placeholder || '请选择' + item.label">
            <el-option
              v-for="each in item.options"
              :key="each.value"
              :label="each.label"
              :value="each.value">
            </el-option>
          </el-select>
        </el-form-item>
        <p class="form-item-title">模型流程</p>
        <el-form-item prop="processes"
                      v-for="(item, index) in processes"
                      :key="item.name"
                      :label="item.name"
                      :label-width="updateDialog.formLabelWidth">
          <el-select v-model="item.each" label="审批人" placeholder="请选择审批人" @change="userChange($event, item)" disabled>
            <el-option
              v-for="(each, idx) in userList"
              :key="each.id"
              :label="each.realName"
              :value="each.id + ':' + each.realName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="updateDialogSure()">确 定</el-button>
      </div>
    </el-dialog>

    <BasePagination :pagination="pagination"/>

  </div>
</template>

<script>
  import BaseSearch from '@/components/Table/BaseSearch'
  import BasePagination from '@/components/Table/BasePagination'
  import { page } from '@/api/platform/approvalModel'
  import userApi from '@/api/system/user'
  import taskApi from '@/api/platform/approvalTask'
  import confirm from '@/utils/confirm'
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
        processes: [{ name: '节点1' }],
        userList: [],
        multipleSelection: [],
        dialog: {
          show: false,
          formLabelWidth: '80px',
          modelList: [],
          form: {}
        },
        updateDialog: {
          formLabelWidth: '80px',
          show: false,
          form: {},
          rules: {
            name: [{ required: true, message: '任务名称必填' }]
          },
          fields: [{ key: 'name', label: '名称', type: 'input' }]
        },
        table: {
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
        pagination: {
          total: 0,
          current: 1,
          pageSize: 20
        },
        searchFields: [
          { key: 'name', label: '任务名称', type: 'input' },
          { key: 'type', label: '任务类型', type: 'select', options: modelTypes },
          { key: 'status', label: '任务状态', type: 'select', options: modelStatuses }
        ]
      }
    },
    created() {
      this.queryModel()
      this.queryUserList()
    },
    methods: {
      userChange(each, item) {
        const split = each.split(':')
        item.userName = split[1]
        item.userId = split[0]
      },
      queryUserList() {
        const _this = this
        const data = {
          current: 1,
          size: 1000000
        }
        userApi.page(data).then(res => {
          _this.userList = res.data.records
        })
      },
      update(index, row) {
        const _this = this
        _this.updateDialog.show = true
        if (row) {
          taskApi.get(row.id).then(res => {
            _this.updateDialog.form = res.data
            const processes = res.data.processes
            for (const i in processes) {
              processes[i].each = processes[i].userId + ':' + processes[i].userName
            }
            this.processes = processes
          })
        }
      },
      queryModel() {
        const _this = this
        const queryData = {
          current: 1,
          size: 20
        }
        page(queryData).then(res => {
          _this.dialog.modelList = res.data.records
        })
      },
      query(searchForm) {
        const _this = this
        searchForm.current = _this.pagination.current
        searchForm.size = _this.pagination.pageSize
        taskApi.page(searchForm).then(res => {
          const data = res.data
          _this.pagination.current = data.current
          _this.pagination.total = data.total
          _this.table.data = data.records
        })
      },
      addOrUpdate() {
        this.dialog.show = true
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(val) {
        this.pagination.current = 1
        this.pagination.pageSize = val
        this.$refs.baseSearch.query()
      },
      handleCurrentChange(val) {
        this.pagination.current = val
        this.$refs.baseSearch.query()
      },
      updateStatus() {},
      updateDialogSure() {},
      dialogSure() {
        const _this = this
        taskApi.add(_this.dialog.form).then(res => {
          showAndQuery(_this)
          _this.dialog.show = false
        })
      },
      handleDelete(_index, row) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            taskApi.del(row.id).then(res => {
              showAndQuery(_this)
            })
          }
        })
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
