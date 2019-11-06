<template>
  <div class="app-container">
    <div class="menu-tree-container">
      <div class="block">
        <div class="header-options">
          <el-button size="mini" type="primary" @click="openDialog()">添加资源</el-button>
        </div>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="id">
          <div class="menu-tree-node" slot-scope="{ node, data }">
            <span class="custom-tree-node-text">{{ node.label }}</span>
            <span class="custom-tree-node-buttons">
              <el-button
                type="text"
                size="mini"
                @click="openDialog(data)">
                <svg-icon class='drag-handler' icon-class="add-blue"></svg-icon>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => get(data)">
                <svg-icon class='drag-handler' icon-class="input"></svg-icon>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(data)">
                <svg-icon class='drag-handler' icon-class="garbage"></svg-icon>
              </el-button>
            </span>
          </div>
        </el-tree>
      </div>
    </div>

    <el-dialog title="新增菜单" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="menuForm">
        <el-form-item prop="name" label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="菜单类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择菜单类型">
            <el-option label="菜单" value="0"/>
            <el-option label="按钮" value="1"/>
            <el-option label="链接" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="url" label="链接" :label-width="formLabelWidth">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item prop="method" label="请求方法" :label-width="formLabelWidth">
          <el-select v-model="form.method" placeholder="请选择请求方式">
            <el-option label="POST" value="post"/>
            <el-option label="GET" value="get"/>
            <el-option label="PUT" value="put"/>
            <el-option label="DELETE" value="delete"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="permission" label="菜单权限标识" :label-width="formLabelWidth">
          <el-input v-model="form.permission"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" @keyup.native="formateNumber()"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import message from '@/utils/message'
  import confirm from '@/utils/confirm'
  import menuApi from '@/api/system/menu'

  export default {
    data() {
      return {
        rules: {
          name: [{ required: true, message: '菜单名称必填', trigger: 'blur' }],
          // permission: [{ required: true, message: '权限码必填', trigger: 'blur' }],
          // url: [{ required: true, message: 'url必填', trigger: 'blur' }],
          // method: [{ required: true, message: '请求方式必填', trigger: 'blur' }],
          type: [{ required: true, message: '菜单类型必填', trigger: 'blur' }]
        },

        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogFormVisible: false,
        form: {
          id: '',
          name: '',
          permission: '',
          url: '',
          method: '',
          icon: '',
          sort: '',
          type: ''
        },
        formLabelWidth: '120px'
      }
    },

    methods: {
      getMenuTree() {
        menuApi.tree().then(response => {
          this.treeData = response.data
        }).catch(error => {
          console.log(error)
        })
      },
      formateNumber() {
        this.form.sort = this.form.sort.replace(/[^\.\d]/g, '')
        this.form.sort = this.form.sort.replace('.', '')
      },
      openDialog(data) {
        if (data) {
          this.form.parentId = data.id
        } else {
          this.form.parentId = ''
        }
        resetForm(this)
        this.dialogFormVisible = true
      },
      get(data) {
        menuApi.get(data.id).then(res => {
          this.form = res.data
          this.dialogFormVisible = true
        })
      },
      add() {
        const _this = this
        _this.$refs['menuForm'].validate((valid) => {
          if (valid) {
            const id = _this.form.id
            if (id) {
              menuApi.update(_this.form).then(res => {
                message.show()
                _this.dialogFormVisible = false
                this.getMenuTree()
              })
            } else {
              menuApi.add(_this.form).then(res => {
                message.show()
                _this.dialogFormVisible = false
                this.getMenuTree()
              })
            }
          }
        })
      },

      remove(data) {
        const _this = this
        confirm.confirm(_this, {
          success: function() {
            menuApi.delMenu(data.id).then(res => {
              message.show()
              _this.getMenuTree()
            })
          }
        })
      }
    },
    created() {
      this.getMenuTree()
    }
  }

  const resetForm = function(_this) {
    _this.form = {
      id: '',
      name: '',
      permission: '',
      url: '',
      method: '',
      icon: '',
      sort: '',
      type: ''
    }
  }
</script>

<style scoped>
  .custom-tree-node-text {
    width: 200px;
  }

  .menu-tree-container {
    border-radius: 4px;
    border: 1px solid #ebeef5;
    overflow: hidden;
    padding: 20px;
  }

  .header-options {
    padding: 15px 9px;
  }

  .menu-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
