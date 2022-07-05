<template>
  <div class="header-container">
    <!-- 左侧 -->
    <div class="header-left">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-feiji3"></use>
      </svg>
      <span>国内航班查询与预定系统</span>
    </div>
    <!-- 右侧 -->
    <div class="header-right" v-if="!loginStatus">
      <el-dropdown>
        <div @click="login">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yonghu"></use>
          </svg>
          <span>请登录</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="register">点击注册</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-if="loginStatus">
      当前登录用户:
      <span class="avatar">{{$store.state.user.name}}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['saveIsLoginDialog', 'saveRegisterDialog']),
    login () {
      this.saveIsLoginDialog(true)
    },
    register () {
      this.saveRegisterDialog(true)
    }
  },
  computed: {
    ...mapState(['loginStatus'])
  }
}
</script>

<style lang="less" scoped>
.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-left {
    font-size: 20px;
    .icon {
      width: 30px;
      margin-right: 20px;
    }
  }
  .header-right {
    width: 80px;
    font-size: 15px;
    background-color: #f2f8fe;
    border-radius: 16px 16px 16px 16px;
    cursor: pointer;
    .icon {
      width: 30px;
      height: 20px;
    }
  }
  .header-right:hover {
    color: #409eff;
  }
  .avatar {
    cursor: pointer;
    color: #409eff;
  }
}
</style>
