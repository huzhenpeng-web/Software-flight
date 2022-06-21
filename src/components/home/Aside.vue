<template>
  <div class="aside-container">
    <!-- 菜单icon -->
    <div class="aside-icon">
      <svg class="icon" aria-hidden="true" @click="updateCollapse">
        <use xlink:href="#icon-caidan"></use>
      </svg>
    </div>
    <!-- 导航选项 -->
    <div>
      <el-menu :collapse="isCollapse" :collapse-transition="false" :default-active="activePath" @select="changeActivePath" router>
        <el-menu-item v-for="(item,index) in menus" :key="index" :index="item.path">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      // 菜单信息
      menus: [
        { name: '首页', icon: '#icon-shouye', path: '/home' },
        { name: '查询航班', icon: '#icon-sousuo', path: '/query' },
        { name: '机票预定', icon: '#icon-feiji', path: '/reserve' },
        { name: '我的订单', icon: '#icon-quanbudingdan', path: '/order' }
      ]
    }
  },
  methods: {
    ...mapMutations(['updateCollapse', 'updateActivePath']),
    // 导航栏发生改变
    changeActivePath (path) {
      this.updateActivePath(path)
    }
  },
  computed: {
    ...mapState(['activePath', 'isCollapse'])
  },
  mounted () {
    if (this.$route.path.includes('/reserve')) {
      return this.updateActivePath('/reserve')
    } else if (this.$route.path.includes('/query')) {
      console.log(this.$route.path)
      return this.updateActivePath('/query')
    }
    this.updateActivePath(this.$route.path)
  }
}
</script>

<style lang="less" scoped>
.aside-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  .aside-icon {
    margin: 14px auto;
    .icon {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
  .el-menu {
    margin-top: 30px;
    .icon {
      width: 30px;
      height: 30px;
      margin-right: 15px;
    }
  }
}
</style>
