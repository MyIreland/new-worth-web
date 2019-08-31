<template>
  <div class="components-container">
    <baseSearch :fieldMap="searchFields"></baseSearch>

    <baseTable :tableConfig="tableConfig.config" :fieldMap="tableConfig.tableFields" :tableData="tableConfig.tableData"></baseTable>

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
        <el-button type="primary" @click="sure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import dictApi from '@/api/system/dict'
  import confirm from '@/utils/confirm'
  import message from '@/utils/message'
  import baseSearch from '@/components/Table/BaseSearch'
  import baseTable from '@/components/Table/BaseTable'

  export default {
    name: 'index',
    components: {
      baseSearch,
      baseTable
    },
    data() {
      return {
        searchFields: [
          { fieldName: 'type', fieldDesc: '字典码', type: 'input' },
          { fieldName: 'description', fieldDesc: '字典码描述', type: 'input' }],
        tableConfig: {
          config: {
            selection: true,
            options: true,
            pagination: true
          },
          tableFields: [
            { prop: 'id', label: 'ID', width: 55 },
            { prop: 'type', label: '字典码' },
            { prop: 'description', label: '字典码描述' },
            { prop: 'value', label: '字典值' },
            { prop: 'label', label: '字典值描述' },
            { prop: 'sort', label: '排序' }],
          tableData: []
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
        formLabelWidth: '120px',
        multipleSelection: []
      }
    },
    methods: {
      query(param) {
        dictApi.page(param).then(res => {
          this.tableConfig.tableData = res.data.records
        })
      },
      childAdd() {
        this.openDialog()
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
      childBatchDel() {
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
      childHandleSelectionChange(val) {
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
