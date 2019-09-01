<template>
  <div class="app-container">
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item v-for="item in searchFields" :key="item.key" :label="item.label">
          <el-input v-if="!item.type || item.type==='input'" v-model="searchForm[item.key]" :placeholder="item.placeholder || '请输入' + item.label"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="batchDel" v-show="false">批量删除</el-button>
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
          v-for="item in tableConfig.tableFields"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width">
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

      <BasePagination :pagination="pagination"></BasePagination>

    </div>

    <el-dialog title="新增用户" :visible.sync="dialog.dialogFormVisible">
      <el-form :model="dialog.form" :rules="dialog.rules" ref="userForm">
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
        <el-form-item label="角色" prop="roleIds" :label-width="formLabelWidth">
          <el-select v-model="dialog.form.roleIds" multiple placeholder="请选择角色" @change="roleIdsChange">
            <el-option
              v-for="each in roleList"
              :key="each.value"
              :label="each.label"
              :value="each.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import userApi from '@/api/system/user'
  import { list } from '@/api/system/role'
  import confirm from '@/utils/confirm'
  import message from '@/utils/message'
  import BasePagination from '@/components/Table/BasePagination'

  const userType = [{ label: '正常用户', value: 0 }, { label: '管理员', value: 1 }]
  const sexType = [{ label: '男', value: 1 }, { label: '女', value: 2 }]

  export default {
    name: 'dict',
    components: {
      BasePagination
    },
    data() {
      return {
        searchFields: [
          { key: 'realName', label: '姓名', type: 'input' },
          { key: 'username', label: '用户名', type: 'input' },
          { key: 'email', label: '邮箱', type: 'input' },
          { key: 'mobile', label: '电话', type: 'input' }],
        dialog: {
          dialogFormVisible: false,
          fields: [
            { key: 'realName', label: '姓名', type: 'input' },
            { key: 'username', label: '用户名', type: 'input' },
            { key: 'mobile', label: '电话', type: 'input' },
            { key: 'email', label: '邮箱', type: 'input' },
            { key: 'sex', label: '性别', type: 'select', options: sexType },
            { key: 'type', label: '用户类型', type: 'select', options: userType }
          ],
          rules: {
            realName: [{ required: true, message: '姓名必填', trigger: 'blur' }],
            username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
            mobile: [{ required: true, message: '电话必填', trigger: 'blur' }],
            email: [{ required: true, message: '邮箱必填', trigger: 'blur' }],
            sex: [{ required: true, message: '性别必填', trigger: 'blur' }],
            type: [{ required: true, message: '用户类型必填', trigger: 'blur' }],
            roleIds: [{ required: true, message: '角色必填', trigger: 'blur' }]
          },
          form: {
            realName: '',
            username: '',
            password: '',
            rePassword: '',
            sex: '',
            mobile: '',
            email: '',
            roleIds: []
          }
        },
        pagination: {
          total: 0,
          current: 1,
          pageSize: 20,
          pageSizes: [20, 50, 100, 150, 200]
        },
        searchForm: {
          current: 1,
          size: 10
        },
        tableConfig: {
          tableFields: [
            { prop: 'id', label: 'ID', width: 100 },
            { prop: 'realName', label: '姓名', width: 80 },
            { prop: 'username', label: '用户名', width: 80 },
            { prop: 'mobile', label: '电话', width: 150 },
            { prop: 'email', label: '邮箱', width: 150 },
            { prop: 'sex', label: '性别', width: 55 },
            { prop: 'type', label: '用户类型', width: 100 },
            { prop: 'gmtCreate', label: '创建时间' }]
        },
        tableData: [],
        roleList: [],
        formLabelWidth: '120px',
        multipleSelection: []
      }
    },
    methods: {
      query() {
        this.searchForm.current = this.pagination.current
        this.searchForm.size = this.pagination.pageSize
        userApi.page(this.searchForm).then(res => {
          const data = res.data
          this.pagination.current = data.current
          this.pagination.total = data.total
          this.tableData = data.records
        })
      },
      openDialog(_index, row) {
        const _this = this
        if (row) {
          userApi.get(row.id).then(res => {
            _this.dialog.form = res.data
            _this.dialog.dialogFormVisible = true
          })
        } else {
          resetData(_this)
          _this.dialog.dialogFormVisible = true
        }
      },
      roleIdsChange(val) {
      },
      handleDelete(_index, row) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            userApi.del(row.id).then(res => {
              message.show()
              _this.query()
            })
          }
        })
      },
      batchDel() {
        const _this = this
        if (_this.multipleSelection.length > 0) {
          confirm.confirm(_this, {
            success: function() {
              const ids = []
              for (const i in _this.multipleSelection) {
                ids.push(_this.multipleSelection[i].id)
              }
              userApi.batchDel(ids).then(res => {
                message.show()
                _this.query()
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
      sure() {
        const _this = this
        _this.$refs['userForm'].validate((valid) => {
          if (valid) {
            const id = _this.dialog.form.id
            if (id) {
              userApi.update(_this.dialog.form).then(res => {
                message.show()
                _this.dialog.dialogFormVisible = false
                _this.query()
              })
            } else {
              userApi.add(_this.dialog.form).then(res => {
                message.show()
                _this.dialog.dialogFormVisible = false
                _this.query()
              })
            }
          }
        })
      },
      reset() {
        this.searchForm = {}
        this.query()
      }
    },
    created() {
      this.query()
      getRoleList(this)
    }
  }
  const resetData = function(_this) {
    _this.dialog.form = {
      realName: '',
      username: '',
      password: '',
      rePassword: '',
      sex: '',
      mobile: '',
      email: '',
      roleIds: []
    }
  }
  const getRoleList = function(_this) {
    if (_this.roleList.length === 0) {
      list().then(res => {
        const roles = res.data
        for (const i in roles) {
          const each = {}
          each.label = roles[i].roleName
          each.value = roles[i].id
          _this.roleList.push(each)
        }
      })
    }
  }
</script>

<style scoped>

</style>
