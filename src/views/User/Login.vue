<template>
  <!-- 用户登录 -->
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="login_avatar"></div>
      <!-- 登录表单 -->
      <div class="login_div">
        <div>
          <el-form>
            <el-form-item label="账号:">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="密码:">
              <el-input></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <span slot="footer" class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary">登 录</el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  .login_box {
    width: 80%;
    display: flex;
    margin: 0 auto;
    .login_div{
      width: 100%;
      .el-input{
        width: 80%;
      }
      .footer{
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
