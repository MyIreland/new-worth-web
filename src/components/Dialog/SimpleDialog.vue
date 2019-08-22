<template>
  <el-dialog title="新增菜单" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="menuForm">
      <el-form-item label="菜单名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="菜单类型" :label-width="formLabelWidth">
        <el-select v-model="form.type" placeholder="请选择菜单类型">
          <el-option label="菜单" value="0"/>
          <el-option label="按钮" value="1"/>
          <el-option label="链接" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="链接" :label-width="formLabelWidth">
        <el-input v-model="form.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请求方法" :label-width="formLabelWidth">
        <el-select v-model="form.method" placeholder="请选择请求方式">
          <el-option label="POST" value="post"/>
          <el-option label="GET" value="get"/>
          <el-option label="PUT" value="put"/>
          <el-option label="DELETE" value="delete"/>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单权限标识" :label-width="formLabelWidth">
        <el-input v-model="form.permission" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth">
        <el-input v-model="form.sort" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图标" :label-width="formLabelWidth">
        <el-input v-model="form.icon" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="add()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'SimpleDialog',
    props: {
      title: {
        type: String,
        default: ''
      },
      form: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>
