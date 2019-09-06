<template>
  <div class="base-dialog">
    <el-dialog :title="title" :visible.sync="show">
      <el-form :model="form" :rules="rules" ref="userForm">
        <el-form-item v-for="item in fields" :key="item.key" :label="item.label" :prop="item.key"
                      :label-width="formLabelWidth">
          <el-input v-if="!item.type || item.type==='input'" v-model="form[item.key]"
                    :placeholder="item.placeholder || '请输入' + item.label"></el-input>
          <el-select v-else-if="item.type==='select'" v-model="form[item.key]" :multiple="item.multiple"
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
</template>

<script>
  export default {
    name: 'BaseDialog',
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      title: {
        type: String,
        default: ''
      },
      fields: {
        type: Array,
        default: () => []
      },
      rules: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        formLabelWidth: '120px',
        form: {}
      }
    },
    methods: {
      dialogSure() {
        this.$parent.dialogSure(this.form)
      },
      dialogCancel() {
        this.show = false
      }
    }
  }
</script>

<style scoped>

</style>
