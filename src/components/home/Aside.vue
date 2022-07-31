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
        <el-submenu index="/order">
          <template slot="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-quanbudingdan"></use>
            </svg>
            <span>我的订单</span>
          </template>
          <el-menu-item v-for="(i,ind) in submenu" :key="ind" :index="i.path">
            <i :class="i.icon"></i>
            <span slot="title">{{i.name}}</span>
          </el-menu-item>
        </el-submenu>
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
        { name: '航线地图', icon: '#icon-ditu1', path: '/map' },
        { name: '机票预定', icon: '#icon-feiji', path: '/reserve' }
      ],
      // 订单
      submenu: [
        { name: '待支付', icon: 'el-icon-s-order', path: '/order/pay' },
        { name: '待出行', icon: 'el-icon-s-order', path: '/order/go' },
        { name: '已退款', icon: 'el-icon-s-order', path: '/order/refund' },
        { name: '全部订单', icon: 'el-icon-s-order', path: '/order/all' }
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
      console.log(1)
      return this.updateActivePath('/reserve')
    } else if (this.$route.path.includes('/query')) {
      return this.updateActivePath('/query')
    }
    this.updateActivePath(this.activePath)
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
