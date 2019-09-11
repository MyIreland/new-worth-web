<template>
  <div class="app-container">
    <div class="search-area">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item v-for="item in searchFields" :key="item.key" :label="item.label">
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
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-component">
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
            fixed
            width="55">
          </el-table-column>
          <el-table-column
            v-for="item in tableFields"
            :prop="item.prop"
            :label="item.label"
            :key="item.prop"
            :width="item.width"
            :fixed="item.fixed">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :type="scope.row.jobStatus === '0' ? 'success' : 'danger'"
                @click="changeStatus(scope.$index, scope.row)">{{scope.row.jobStatus === '0' ? "开启" : "关闭"}}
              </el-button>
              <el-button
                size="mini"
                type="primary"
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

    <div class="pagination-area">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        layout="sizes, prev, pager, next, total, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>

    <div class="base-dialog">
      <el-dialog :title="dialog.title" :visible.sync="dialog.show">
        <el-form :model="dialog.form" :rules="dialog.rules" ref="form">
          <el-form-item v-for="item in dialog.fields" :key="item.key" :label="item.label" :prop="item.key"
                        :label-width="formLabelWidth">
            <el-input v-if="!item.type || item.type==='input'" v-model="dialog.form[item.key]"
                      :placeholder="item.placeholder || '请输入' + item.label"></el-input>
            <el-select v-else-if="item.type==='select'" v-model="dialog.form[item.key]" :multiple="item.multiple"
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCancel()">取 消</el-button>
          <el-button type="primary" @click="dialogSure()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import { page, get, add, update, del, batchRemove, changeStatus } from '@/api/system/task'
  import confirm from '@/utils/confirm'
  import message from '@/utils/message'

  const groupTypes = [{ label: 'group1', value: 'group1' }, { label: 'group1', value: 'group2' }]
  const statusTypes = [{ label: '未开始', value: 0 }, { label: '进行中', value: 1 }]

  export default {
    name: 'task',
    data() {
      return {
        searchForm: {},
        searchFields: [
          { key: 'jobName', label: '任务名称', type: 'input' },
          { key: 'jobGroup', label: '任务分组', type: 'select', options: groupTypes },
          { key: 'jobStatus', label: '任务状态', type: 'select', options: statusTypes }
        ],
        tableFields: [
          { prop: 'id', label: 'ID', width: 50, fixed: true },
          { prop: 'jobName', label: '任务名称', width: 100, fixed: true },
          { prop: 'jobGroup', label: '任务分组', width: 80, fixed: true },
          { prop: 'jobStatus', label: '任务状态', width: 100 },
          { prop: 'cronExpression', label: '表达式', width: 100 },
          { prop: 'beanClass', label: '实体类', width: 300 },
          { prop: 'gmtCreate', label: '创建时间', width: 200 },
          { prop: 'description', label: '任务描述', width: 300 }
        ],
        dialog: {
          show: false,
          title: '新增任务',
          fields: [
            { key: 'jobName', label: '任务名称', type: 'input' },
            { key: 'jobGroup', label: '任务分组', type: 'select', options: groupTypes },
            { key: 'cronExpression', label: '表达式', type: 'input' },
            { key: 'beanClass', label: '实体类', type: 'input' },
            { key: 'description', label: '任务描述', type: 'input' }
          ],
          rules: {
            jobName: [{ required: true, message: '任务名称', trigger: 'blur' }],
            jobGroup: [{ required: true, message: '任务分组', trigger: 'blur' }],
            cronExpression: [{ required: true, message: '表达式', trigger: 'blur' }],
            beanClass: [{ required: true, message: '实体类名称', trigger: 'blur' }]
          },
          form: {
            name: '',
            briefName: '',
            type: '',
            phone: '',
            email: ''
          }
        },
        pagination: {
          pageSizes: [20, 30],
          total: 0,
          current: 1,
          pageSize: 20
        },
        tableData: [],
        formLabelWidth: '120px',
        multipleSelection: []
      }
    },
    methods: {
      changeStatus(_index, row) {
        const _this = this
        if (row.id) {
          // 状态取反
          confirm.confirm(_this, {
            success: function() {
              let jobStatus = row.jobStatus
              jobStatus = jobStatus === '0' ? '1' : '0'
              changeStatus({ jobId: row.id, status: jobStatus }).then(res => {
                message.show()
                _this.query()
              })
            }
          })
        }
      },
      query() {
        const _this = this
        _this.searchForm.current = _this.pagination.current
        _this.searchForm.size = _this.pagination.pageSize
        page(_this.searchForm).then(res => {
          const data = res.data
          _this.pagination.current = data.current
          _this.pagination.total = data.total
          _this.tableData = data.records
        })
      },
      reset() {
        this.searchForm = {}
        this.query()
      },
      openDialog(_index, row) {
        const _this = this
        if (row) {
          get(row.id).then(res => {
            _this.dialog.form = res.data
            showDialog(_this)
          })
        } else {
          resetData(_this)
          showDialog(_this)
        }
      },
      handleDelete(_index, row) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            del(row.id).then(res => {
              message.show()
              _this.$refs.baseSearch.query()
            })
          }
        })
      },
      batchDel(data) {
        const _this = this
        if (data.length > 0) {
          confirm.confirm(_this, {
            success: function() {
              const ids = []
              for (const i in data) {
                ids.push(data[i].id)
              }
              batchRemove(ids).then(res => {
                message.show()
                _this.$refs.baseSearch.query()
              })
            }
          })
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(val) {
        this.pagination.current = 1
        this.pagination.pageSize = val
        this.query()
      },
      handleCurrentChange(val) {
        this.pagination.current = val
        this.query()
      },
      dialogSure() {
        const _this = this
        const id = _this.dialog.form.id
        if (id) {
          update(_this.dialog.form).then(res => {
            message.show()
            _this.query()
            this.dialogCancel()
          })
        } else {
          add(_this.dialog.form).then(res => {
            message.show()
            _this.query()
            this.dialogCancel()
          })
        }
      },
      dialogCancel() {
        this.dialog.show = false
      }
    },
    created() {
      this.query()
    }
  }

  const resetData = function(_this) {
    _this.dialog.form = {}
  }
  const showDialog = function(_this) {
    _this.dialog.show = true
  }
</script>


