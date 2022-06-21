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
          <keep-alive include="Reserve">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from '@/components/home/Aside.vue'
import Header from '@/components/home/Header.vue'
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: {
    Aside,
    Header
  },
  computed: {
    ...mapState(['isCollapse'])
  }
}
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  min-width: 1366px;
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
    }
  }
}
</style>
