<template>
  <div class="app-container">
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item v-for="item in searchFields" :key="item.key" :label="item.label">
          <el-input v-if="!item.type || item.type==='input'" v-model="searchForm[item.key]"
                    :placeholder="item.placeholder || '请输入' + item.label"></el-input>

          <el-select v-else-if="item.type==='select'" v-model="searchForm[item.key]" :multiple="item.multiple"
                     :placeholder="item.placeholder || '请选择' + item.label">
            <el-option
              v-for="each in item.options"
              :key="each.value"
              :label="each.label"
              :value="each.value">
            </el-option>

          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog">添加</el-button>
    </div>

    <div class="table-area">
      <el-table
        :data="tableData"
        ref="multipleTable"
        stripe
        style="width: 100%">
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
              type="success"
              @click="openTreeDialog(scope.$index, scope.row)">授权资源
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

      <BasePagination :pagination="pagination"></BasePagination>
    </div>

    <el-dialog title="新增角色" :visible.sync="dialog.dialogFormVisible">
      <el-form :model="dialog.form" :rules="dialog.rules" ref="roleForm">
        <el-form-item v-for="item in dialog.dialogFields" :key="item.key" :label="item.label" :prop="item.key"
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
        <el-button @click="dialog.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="绑定资源"
      :visible.sync="treeDialog.visible"
      width="30%"
      center>
      <el-tree
        :data="treeDialog.data"
        show-checkbox
        ref="menuSelected"
        :props="treeDialog.defaultProps"
        node-key="id">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="bindPermissions()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { add, update, get, del, page } from '@/api/system/role'
  import { getMenuIdsByRoleId, bindRoleMenu } from '@/api/system/roleMenu'
  import menuApi from '@/api/system/menu'
  import confirm from '@/utils/confirm'
  import message from '@/utils/message'
  import BasePagination from '@/components/Table/BasePagination'

  const roleTypes = [{ label: '正常角色', value: 0 }, { label: '管理员角色', value: 1 }]

  export default {
    name: 'dict',
    components: {
      BasePagination
    },
    data() {
      return {
        dialog: {
          dialogFormVisible: false,
          dialogFields: [
            { key: 'roleName', label: '角色名称', type: 'input' },
            { key: 'roleCode', label: '角色编码', type: 'input' },
            { key: 'roleType', label: '角色类型', type: 'select', options: roleTypes },
            { key: 'roleDesc', label: '角色描述', type: 'input' }
          ],
          form: {
            roleName: '',
            roleCode: '',
            roleType: '',
            roleDesc: ''
          },
          rules: {
            roleName: [{ required: true, message: '角色名称必填', trigger: 'blur' }],
            roleCode: [{ required: true, message: '角色编码必填', trigger: 'blur' }],
            roleType: [{ required: true, message: '角色类型必填', trigger: 'blur' }]
          }
        },
        treeDialog: {
          id: 0,
          visible: false,
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          data: []
        },
        searchFields: [
          { key: 'roleName', label: '角色名称', type: 'input' },
          { key: 'roleCode', label: '角色编码', type: 'input' },
          { key: 'roleType', label: '角色类型', type: 'select', options: roleTypes }],
        searchForm: {},
        pagination: {
          total: 0,
          current: 1,
          pageSize: 20,
          pageSizes: [20, 50, 100, 150, 200]
        },
        tableConfig: {
          tableFields: [
            { prop: 'id', label: 'ID', width: 55 },
            { prop: 'roleName', label: '角色名称', width: 100 },
            { prop: 'roleCode', label: '角色编码', width: 140 },
            { prop: 'roleType', label: '角色类型', width: 100 },
            { prop: 'gmtCreate', label: '创建时间' }]
        },
        tableData: [],
        formLabelWidth: '120px'
      }
    },
    methods: {
      query() {
        page(this.searchForm).then(res => {
          const data = res.data
          this.pagination.current = data.current
          this.pagination.total = data.total
          this.tableData = data.records
        })
      },
      openDialog(_index, row) {
        if (row) {
          get(row.id).then(res => {
            this.dialog.form = res.data
            this.dialog.dialogFormVisible = true
          })
        } else {
          resetData(this)
          this.dialog.dialogFormVisible = true
        }
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
      openTreeDialog(_index, row) {
        const _this = this
        initMenuTree(_this)
        const id = row.id
        if (id) {
          _this.treeDialog.id = id
          getMenuIdsByRoleId(id).then(res => {
            _this.$refs.menuSelected.setCheckedKeys(res.data)
          })
          _this.treeDialog.visible = true
        }
      },
      bindPermissions() {
        const _this = this
        const roleId = _this.treeDialog.id
        if (roleId) {
          bindRoleMenu({ roleId: roleId, menuIds: _this.$refs.menuSelected.getCheckedKeys() }).then(res => {
            message.show()
          })
        }
        _this.treeDialog.visible = false
      },
      handleDelete(_index, row) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            del(row.id).then(res => {
              message.show()
              _this.query()
            })
          }
        })
      },
      sure() {
        const _this = this
        _this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            const id = _this.dialog.form.id
            if (id) {
              update(_this.dialog.form).then(res => {
                message.show()
                _this.dialog.dialogFormVisible = false
                _this.query()
              })
            } else {
              add(_this.dialog.form).then(res => {
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
    }
  }
  const resetData = function(_this) {
    _this.dialog.form = {
      roleName: '',
      roleCode: '',
      roleType: '',
      roleDesc: ''
    }
  }

  const initMenuTree = function(_this) {
    if (_this.treeDialog.data.length === 0) {
      menuApi.tree().then(res => {
        _this.treeDialog.data = res.data
      })
    }
  }
</script>

