<template>
  <!-- 购买机票页面 -->
  <div class="book-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预定</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reserve/selectFlight' }">选择航班</el-breadcrumb-item>
      <el-breadcrumb-item>填写信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 展示信息 -->
    <div class="userInfo">
      <!-- 左 -->
      <div class="left">
        <el-alert title="出行提醒" type="warning" show-icon>
        </el-alert>
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="right-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.book-container {
  width: 100%;
  height: 100%;
  .userInfo {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    margin-top: 30px;
    .left {
      width: 50%;
      height: 100%;
      border: 1px solid red;
    }
    .right {
      width: 50%;
      height: 100%;
      border: 1px solid red;
      .right-box {
        float: right;
        width: 398px;
        min-height: 500px;
        border: solid #d6dde2;
        border-width: 0 1px;
        background: #f5f8f9;
      }
    }
  }
}
</style>
