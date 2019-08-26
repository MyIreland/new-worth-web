<template>
  <div class="components-container">
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
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
          label="ID">
        </el-table-column>
        <el-table-column
          prop="description"
          label="字典类型描述">
        </el-table-column>
        <el-table-column
          prop="label"
          label="字典文本描述">
        </el-table-column>
        <el-table-column
          prop="type"
          label="字典码">
        </el-table-column>
        <el-table-column
          prop="value"
          label="字典值">
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


    <el-dialog title="新增字典" :visible.sync="dialog.dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="dictForm">
        <el-form-item prop="label" label="标签名" :label-width="formLabelWidth">
          <el-input v-model="form.label"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="字典类型" :label-width="formLabelWidth">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="字典描述" :label-width="formLabelWidth">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item prop="value" label="字典值" :label-width="formLabelWidth">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item prop="remarks" label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import dictApi from '@/api/system/dict'
import conrifm from '@/utils/confirm'
import message from '@/utils/message'

export default {
  name: 'index',
  data() {
    return {
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
      searchForm: {
        type: '',
        description: '',
        current: 1,
        size: 10
      },
      formLabelWidth: '120px',
      tableData: [],
      multipleSelection: []
    }
  },
  methods: {
    search() {
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
      conrifm.confirm(_this, {
        success: function() {
          dictApi.del(row.id).then(res => {
            message.show()
            _this.search()
          })
        }
      })
    },
    batchDel() {
      if (this.multipleSelection.length > 0) {
        const ids = []
        for (const i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].id)
        }
        dictApi.batchDel(ids).then(res => {
          message.show()
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    add() {
      const _this = this
      _this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          const id = _this.form.id
          if (id) {
            dictApi.update(_this.form).then(res => {
              message.show()
              _this.dialog.dialogFormVisible = false
              this.getMenuTree()
            })
          } else {
            dictApi.save(_this.form).then(res => {
              message.show()
              _this.dialog.dialogFormVisible = false
              this.getMenuTree()
            })
          }
        }
      })
    }
  },
  created() {
    this.search()
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
