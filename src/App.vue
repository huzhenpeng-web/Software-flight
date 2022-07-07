<template>
  <div id="app">
    <el-container class="app-container">
      <el-aside :width="!isCollapse ? '160px' : '65px'">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <!-- 路由占位符 -->
          <keep-alive include="Reserve,Flight">
            <router-view></router-view>
          </keep-alive>
          <el-dialog title="用户登录" @close="handleClose" :visible.sync="showLoginDialog" width="50%">
            <Login></Login>
          </el-dialog>
          <el-dialog title="用户注册" @close="handleRegisterClose" :visible.sync="showRegisterDialog" width="50%">
            <Register></Register>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from '@/components/home/Aside.vue'
import Header from '@/components/home/Header.vue'
import Login from '@/views/User/Login.vue'
import Register from '@/views/User/Register.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  components: {
    Aside,
    Header,
    Login,
    Register
  },
  data () {
    return {
      // 登录对话框
      showLoginDialog: false,
      // 注册对话框
      showRegisterDialog: false
    }
  },
  computed: {
    ...mapState(['isCollapse', 'isLoginDialog', 'isRegisterDialog'])
  },
  methods: {
    ...mapMutations(['saveIsLoginDialog', 'saveRegisterDialog']),
    handleClose () {
      this.saveIsLoginDialog(false)
    },
    handleRegisterClose () {
      this.saveRegisterDialog(false)
    }
  },
  watch: {
    isLoginDialog (newVal) {
      this.showLoginDialog = newVal
    },
    isRegisterDialog (newVal) {
      this.showRegisterDialog = newVal
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  min-width: 1366px;
  min-height: 688px;
  .app-container {
    width: 100%;
    height: 100%;
    .el-aside {
      height: 100%;
      border-right: 1px solid #dadfe6;
      overflow: hidden;
    }
    .el-main {
      background-color: #eef1f6;
      overflow-x: hidden;
    }
  }
}
</style>
