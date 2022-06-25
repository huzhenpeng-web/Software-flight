<template>
  <!-- 支付页面 -->
  <div class="pay_container">
    <!-- 步骤条 -->
    <el-steps :active="3" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="增值服务"></el-step>
      <el-step description="支付"></el-step>
      <el-step description="完成"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.pay_container {
  width: 100%;
  height: 100%;
}
</style>
