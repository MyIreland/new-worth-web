<template>
  <div class="app-container">
    <BaseSearch :fields="searchFields" ref="baseSearch"/>

    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="addOrUpdate">添加</el-button>
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
          v-for="item in tableConfig.fields"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.status === 0 ? 'success':'danger'"
              @click="updateStatus(scope.$index, scope.row)">{{scope.row.status === 0 ? '启用':'禁用'}}
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="addOrUpdate(scope.$index, scope.row)">编辑
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

    <div class="base-dialog">
      <el-dialog title="添加模型" :visible.sync="dialogConfig.show">
        <el-form :model="dialogConfig.form" :rules="dialogConfig.rules" ref="form">
          <p class="form-item-title">基本信息</p>
          <el-form-item v-for="item in dialogConfig.fields" :key="item.key" :label="item.label" :prop="item.key"
                        :label-width="dialogConfig.formLabelWidth">
            <el-input v-if="!item.type || item.type==='input'" v-model="dialogConfig.form[item.key]"
                      :placeholder="item.placeholder || '请输入' + item.label"></el-input>
            <el-select v-else-if="item.type==='select'" v-model="dialogConfig.form[item.key]" :multiple="item.multiple"
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
                        :label-width="dialogConfig.formLabelWidth">
            <el-select v-model="item.each" label="审批人" placeholder="请选择审批人" @change="userChange($event, item)">
              <el-option
                v-for="(each, idx) in userList"
                :key="each.id"
                :label="each.realName"
                :value="each.id + ':' + each.realName">
              </el-option>
            </el-select>
            <el-button type="danger" @click.prevent="removeProcess(index)">删除</el-button>
          </el-form-item>
          <el-button type="primary" size="mini" @click="addProcess">添加流程</el-button>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCancel()">取 消</el-button>
          <el-button type="primary" @click="dialogSure()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <BasePagination :pagination="pagination"/>
  </div>
</template>

<script>
  import BaseSearch from '@/components/Table/BaseSearch'
  import BasePagination from '@/components/Table/BasePagination'
  import BaseTable from '@/components/Table/BaseTable'
  import { page, add, del, get, updateStatus, update } from '@/api/platform/approvalModel'
  import userApi from '@/api/system/user'
  import confirm from '@/utils/confirm'
  import message from '@/utils/message'
  const modelTypes = [{ label: 'finance', value: 10 }, { label: '11', value: 11 }]
  const modelStatuses = [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }]
  export default {
    name: 'index',
    components: {
      BaseTable,
      BaseSearch,
      BasePagination
    },
    data() {
      return {
        processes: [{ name: '节点1' }],
        userList: [],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 20
        },
        searchFields: [
          { key: 'type', label: '模型类型', type: 'select', options: modelTypes },
          { key: 'status', label: '模型状态', type: 'select', options: modelStatuses }
        ],
        tableConfig: {
          fields: [
            { prop: 'id', label: 'ID', width: 50 },
            { prop: 'name', label: '名称' },
            { prop: 'type', label: '类型' },
            { prop: 'status', label: '状态', width: 50 },
            { prop: 'userCreate', label: '创建人' },
            { prop: 'gmtCreate', label: '创建时间' }
          ]
        },
        multipleSelection: [],
        dialogConfig: {
          processIdx: 0,
          show: false,
          form: {},
          fields: [
            { key: 'name', label: '名称', type: 'input' },
            { key: 'type', label: '类型', type: 'select', options: modelTypes }
          ],
          rules: {
            name: [{ required: true, message: '名称必填', trigger: 'blur' }],
            type: [{ required: true, message: '类型必填', trigger: 'blur' }]
          },
          formLabelWidth: '70px'
        },
        tableData: []
      }
    },
    created() {
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
      addProcess() {
        if (!this.processes) {
          this.processes = []
        }
        const sort = this.processes.length + 1
        const item = {
          name: '节点' + sort
        }
        this.processes.push(item)
        console.log(this.processes)
      },
      removeProcess(index) {
        if (index !== -1) {
          this.processes.splice(index, 1)
        }
      },
      dialogCancel() {
        this.dialogConfig.show = false
      },
      dialogSure() {
        const _this = this
        const formData = _this.dialogConfig.form
        formData.processes = _this.processes
        if (formData.id) {
          update(formData).then(res => {
            showAndQuery(_this)
            this.dialogConfig.show = false
          })
        } else {
          add(formData).then(res => {
            showAndQuery(_this)
            this.dialogConfig.show = false
          })
        }
      },
      query(data) {
        const _this = this
        data.current = _this.pagination.current
        data.size = _this.pagination.pageSize
        page(data).then(res => {
          const data = res.data
          _this.pagination.current = data.current
          _this.pagination.total = data.total
          _this.tableData = data.records
        })
      },
      updateStatus(_index, row) {
        const _this = this
        if (row) {
          confirm.confirm(_this, {
            success: function() {
              let status = 0
              if (row.status === status) {
                status = 1
              }
              const data = { id: row.id, status: status, type: row.type }
              updateStatus(data).then(res => {
                showAndQuery(_this)
              })
            }
          })
        } else {
          _this.dialogConfig.form = {}
        }
      },
      addOrUpdate(_index, row) {
        const _this = this
        if (row) {
          get(row.id).then(res => {
            _this.dialogConfig.form = res.data
            const processes = res.data.processes
            for (const i in processes) {
              processes[i].each = processes[i].userId + ':' + processes[i].userName
            }
            this.processes = processes
          })
        } else {
          _this.dialogConfig.form = {}
          _this.processes = [{ name: '节点1' }]
        }
        _this.dialogConfig.show = true
      },
      handleDelete(_index, row) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            del(row.id).then(res => {
              showAndQuery(_this)
            })
          }
        })
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
      }
    }
  }
  const showAndQuery = function(_this) {
    message.show()
    _this.$refs.baseSearch.query()
  }

</script>
