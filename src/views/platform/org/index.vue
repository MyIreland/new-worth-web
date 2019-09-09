<template>
  <div class="app-container">

    <BaseSearch :fields="searchFields" ref="baseSearch"></BaseSearch>

    <BaseTable :data="tableData" :fields="tableConfig.fields"></BaseTable>

    <BasePagination :pagination="pagination"></BasePagination>

    <BaseDialog ref="addDialog" :title="dialog.title" :fields="dialog.fields" :form="dialog.form" :rules="dialog.rules"></BaseDialog>
  </div>
</template>

<script>
  import { page, get, add, update, del, batchDel } from '@/api/platform/org'
  import confirm from '@/utils/confirm'
  import message from '@/utils/message'
  import BasePagination from '@/components/Table/BasePagination'
  import BaseTable from '@/components/Table/BaseTable'
  import BaseSearch from '@/components/Table/BaseSearch'
  import BaseDialog from '@/components/Dialog/BaseDialog'

  const companyTypes = [{ label: '正常用户', value: 0 }, { label: '管理员', value: 1 }]
  const statusTypes = [{ label: '已开通', value: 1 }, { label: '未开通', value: 2 }]

  export default {
    name: 'dict',
    components: {
      BasePagination,
      BaseSearch,
      BaseTable,
      BaseDialog
    },
    data() {
      return {
        searchFields: [
          { key: 'name', label: '名称', type: 'input' },
          { key: 'type', label: '类型', type: 'select', options: companyTypes },
          { key: 'briefName', label: '简称', type: 'input' },
          { key: 'status', label: '状态', type: 'select', options: statusTypes },
          { key: 'phone', label: '电话', type: 'input' }
        ],
        tableConfig: {
          fields: [
            { prop: 'id', label: 'ID', width: 50 },
            { prop: 'name', label: '公司名称' },
            { prop: 'briefName', label: '公司简称' },
            { prop: 'type', label: '公司类型', width: 50 },
            { prop: 'phone', label: '电话' },
            { prop: 'email', label: '邮箱' },
            { prop: 'gmtCreate', label: '创建时间' },
            { prop: 'status', label: '公司状态', width: 50 }]
        },
        dialog: {
          title: '新增公司',
          fields: [
            { key: 'name', label: '公司名称', type: 'input' },
            { key: 'briefName', label: '公司简称', type: 'input' },
            { key: 'type', label: '公司类型', type: 'select', options: companyTypes },
            { key: 'phone', label: '电话', type: 'input' },
            { key: 'email', label: '邮箱', type: 'input' }
          ],
          rules: {
            name: [{ required: true, message: '公司名称必填', trigger: 'blur' }],
            briefName: [{ required: true, message: '公司简称必填', trigger: 'blur' }],
            type: [{ required: true, message: '公司类型必填', trigger: 'blur' }],
            phone: [{ required: true, message: '电话必填', trigger: 'blur' }],
            email: [{ required: true, message: '邮箱必填', trigger: 'blur' }]
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
          total: 0,
          current: 1,
          pageSize: 20
        },
        tableData: [],
        roleList: [],
        formLabelWidth: '120px',
        multipleSelection: []
      }
    },
    methods: {
      query(searchForm) {
        const _this = this
        searchForm.current = this.pagination.current
        searchForm.size = this.pagination.pageSize
        page(searchForm).then(res => {
          const data = res.data
          _this.pagination.current = data.current
          _this.pagination.total = data.total
          _this.tableData = data.records
        })
      },
      addOrUpdate(_index, row) {
        const _this = this
        if (row) {
          get(row.id).then(res => {
            _this.dialog.form = res.data
            _this.$refs.addDialog.showDialog(true)
          })
        } else {
          resetData(_this)
          _this.$refs.addDialog.showDialog(true)
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
              batchDel(ids).then(res => {
                message.show()
                _this.$refs.baseSearch.query()
              })
            }
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
      },
      dialogSure() {
        const _this = this
        const id = _this.dialog.form.id
        if (id) {
          update(_this.dialog.form).then(res => {
            message.show()
            _this.$refs.addDialog.showDialog(false)
            _this.$refs.baseSearch.query()
          })
        } else {
          add(_this.dialog.form).then(res => {
            message.show()
            _this.$refs.addDialog.showDialog(false)
            _this.$refs.baseSearch.query()
          })
        }
      },
      dialogCancel() {
        this.$refs.addDialog.showDialog(false)
      }
    },
    created() {
    }
  }
  const resetData = function(_this) {
    _this.dialog.form = {
      name: '',
      briefName: '',
      type: '',
      phone: '',
      email: ''
    }
  }
</script>

<style scoped>

</style>
