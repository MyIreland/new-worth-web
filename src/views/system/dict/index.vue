<template>
  <div class="app-container">
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item v-for="item in searchFields" :key="item.fieldName" :label="item.fieldDesc">
          <el-input v-if="!item.type || item.type==='input'" v-model="searchForm[item.fieldName]" :placeholder="item.placeholder || '请输入' + item.fieldDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
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
          v-for="item in tableConfig.tableFields"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop">
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

    <el-dialog title="新增字典" :visible.sync="dialog.dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="dictForm">
        <el-form-item prop="type" label="字典码" :label-width="formLabelWidth">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="字典码描述" :label-width="formLabelWidth">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item prop="value" label="字典值" :label-width="formLabelWidth">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item prop="label" label="字典值描述" :label-width="formLabelWidth">
          <el-input v-model="form.label"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" @keyup.native="formateNumber()"></el-input>
        </el-form-item>
        <el-form-item prop="remarks" label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remarks"></el-input>
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
  import dictApi from '@/api/system/dict'
  import confirm from '@/utils/confirm'
  import message from '@/utils/message'
  export default {
    name: 'dict',
    data() {
      return {
        searchFields: [
          { fieldName: 'type', fieldDesc: '字典码', type: 'input' },
          { fieldName: 'description', fieldDesc: '字典码描述', type: 'input' }],
        searchForm: {
          current: 1,
          size: 10
        },
        tableConfig: {
          tableFields: [
            { prop: 'id', label: 'ID', width: 55 },
            { prop: 'type', label: '字典码' },
            { prop: 'description', label: '字典码描述' },
            { prop: 'value', label: '字典值' },
            { prop: 'label', label: '字典值描述' },
            { prop: 'sort', label: '排序' }]
        },
        form: {
          label: '',
          type: '',
          description: '',
          value: '',
          remarks: '',
          sort: ''
        },
        rules: {
          label: [{ required: true, message: '标签名必填', trigger: 'blur' }],
          type: [{ required: true, message: '字典类型必填', trigger: 'blur' }],
          description: [{ required: true, message: '字典描述必填', trigger: 'blur' }],
          value: [{ required: true, message: '字典值必填', trigger: 'blur' }],
          sort: [{ required: true, message: '排序必填', trigger: 'blur' }]
        },
        dialog: {
          dialogFormVisible: false
        },
        tableData: [],
        formLabelWidth: '120px',
        multipleSelection: []
      }
    },
    methods: {
      query() {
        dictApi.page(this.searchForm).then(res => {
          this.tableData = res.data.records
        })
      },
      openDialog(_index, row) {
        if (row) {
          dictApi.get(row.id).then(res => {
            this.form = res.data
            this.dialog.dialogFormVisible = true
          })
        } else {
          resetData(this)
          this.dialog.dialogFormVisible = true
        }
      },
      handleDelete(_index, row) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            dictApi.del(row.id).then(res => {
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
              dictApi.batchDel(ids).then(res => {
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
      sure() {
        const _this = this
        _this.$refs['dictForm'].validate((valid) => {
          if (valid) {
            const id = _this.form.id
            if (id) {
              dictApi.update(_this.form).then(res => {
                message.show()
                _this.dialog.dialogFormVisible = false
                _this.query()
              })
            } else {
              dictApi.save(_this.form).then(res => {
                message.show()
                _this.dialog.dialogFormVisible = false
                _this.query()
              })
            }
          }
        })
      },
      reset() {
        this.searchForm = {
          type: '',
          description: '',
          current: 1,
          size: 10
        }
        this.search()
      },
      formateNumber() {
        this.form.sort = this.form.sort.replace(/[^\.\d]/g, '')
        this.form.sort = this.form.sort.replace('.', '')
      }
    },
    created() {
      this.query()
    }
  }
  const resetData = function(_this) {
    _this.form = {
      label: '',
      type: '',
      description: '',
      value: '',
      remarks: '',
      sort: ''
    }
  }
</script>

<style scoped>

</style>
