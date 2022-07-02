<template>
  <!-- 用户登录 -->
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="login_avatar">
        <img src="@/assets/images/avatar/tx.png" alt="">
      </div>
      <!-- 登录表单 -->
      <div class="login_div">
        <div>
          <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules">
            <el-form-item label="账号:" prop="username">
              <el-input v-model="loginForm.username" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input v-model="loginForm.password" type="password" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <span slot="footer" class="dialog-footer">
            <el-button @click="showLoginDialog">取 消</el-button>
            <el-button type="primary" @click="login">登 录</el-button>
          </span>
        </div>
        <span class="register" @click="register">点击注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { loginUser } from '@/api/user'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loginStatus: false
    }
  },
  methods: {
    ...mapMutations(['saveIsLoginDialog', 'saveRegisterDialog', 'saveToken', 'changeLoginStatus', 'saveUser']),
    showLoginDialog () {
      this.saveIsLoginDialog(false)
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.warning('请填写完整信息')
        const { data: res } = await loginUser(this.loginForm.username, this.loginForm.password)
        console.log(res)
        if (res.resultCode === 200) {
          this.$message.success('登录成功')
          this.changeLoginStatus(true)
          // 保存token
          this.saveToken(res.data.token)
          this.saveUser(res.data.user)
          this.saveIsLoginDialog(false)
        } else {
          this.$message.error('登录失败')
        }
      })
    },
    register () {
      // 关闭登录弹框 打开注册弹框
      this.saveIsLoginDialog(false)
      this.saveRegisterDialog(true)
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  .login_box {
    width: 80%;
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    .login_avatar {
      margin: 0 auto;
      border: 1px solid #409eff;
      width: 100px;
      height: 100px;
      padding: 2px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        -webkit-user-drag: none;
      }
    }
    .login_div {
      width: 100%;
      margin-top: 30px;
      .el-input {
        width: 80%;
      }
      .footer {
        display: flex;
        justify-content: center;
      }
      .register{
        color: red;
        cursor: pointer;
      }
    }
  }
}
</style>
