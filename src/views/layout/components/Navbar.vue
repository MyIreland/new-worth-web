<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

      <breadcrumb class="breadcrumb-container"></breadcrumb>

      <div class="right-menu">
        <error-log class="errLog-container right-menu-item"></error-log>

        <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
          <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip>

        <lang-select class="international right-menu-item"></lang-select>

        <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"></theme-picker>
        </el-tooltip>

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{$t('navbar.dashboard')}}
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span @click="openDialog" style="display:block;">我的信息</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>

    <el-dialog title="用户信息" :visible.sync="dialog.show">
      <el-form :model="userForm" :rules="dialog.rules" ref="editForm">
        <el-form-item label="头像" :label-width="dialog.formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :http-request="uploadSubmit">
            <el-avatar shape="square" v-if="avatarUrl" :size="100" fit="contain" :src="avatarUrl"></el-avatar>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-for="item in dialog.fields" :key="item.key" :label="item.label" :prop="item.key"
                      :label-width="dialog.formLabelWidth">
          <el-input v-if="!item.type || item.type==='input'" v-model="userForm[item.key]"
                    :placeholder="item.placeholder || '请输入' + item.label"></el-input>

          <el-select v-else-if="item.type==='select'" v-model="userForm[item.key]" :multiple="item.multiple"
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
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="updateInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userApi from '@/api/system/user'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import fileUtils from '@/utils/fileUtils'
import message from '@/utils/message'
const sexType = [{ label: '男', value: 1 }, { label: '女', value: 2 }]
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userId',
      'name',
      'avatar'
    ])
  },
  data() {
    return {
      uploadUrl: 'api/file/batchUpload',
      avatarUrl: '',
      userForm: {
        name: ''
      },
      dialog: {
        show: false,
        fields: [
          { key: 'realName', label: '姓名', type: 'input' },
          { key: 'sex', label: '性别', type: 'select', options: sexType },
          { key: 'mobile', label: '电话', type: 'input' },
          { key: 'email', label: '邮箱', type: 'input' }
        ],
        rules: {},
        formLabelWidth: '120px',
        form: {}
      }
    }
  },
  methods: {
    uploadSubmit(file) {
      const _this = this
      // 1. 创建formData 利用AXIOS传递
      var formData = new FormData()
      formData.append('files', file.file)
      formData.append('module', 'admin')
      formData.append('bizType', 'avatar')
      fileUtils.import({
        url: _this.uploadUrl,
        data: formData,
        success: function(data) {
          _this.userForm.avatar = data.data[0].url
          _this.avatarUrl = '/api/file/download?fileUrl=' + data.data[0].url
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    updateInfo() {
      const _this = this
      userApi.editSelfInfo(_this.userForm).then(res => {
        message.show()
        _this.dialog.show = false
      })
    },
    openDialog() {
      const _this = this
      userApi.get(_this.userId).then(res => {
        _this.userForm.realName = res.data.realName
        _this.userForm.email = res.data.email
        _this.userForm.mobile = res.data.mobile
        _this.userForm.sex = res.data.sex
        _this.userForm.avatar = res.data.avatar
        _this.avatarUrl = res.data.avatar.startsWith('http') ? res.data.avatar : '/api/file/download?fileUrl=' + res.data.avatar
        _this.dialog.show = true
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
