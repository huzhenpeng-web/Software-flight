<template>
  <div class="home-container">
    <img src="@/assets/svg/color-scheme-right.svg" class="img1">
    <img src="@/assets/svg/color-scheme-left.svg" alt="" class="img2">
    <div class="flight">
      <Clock></Clock>
      <div>即刻起飞!</div>
      <el-button @click="goReserve">
        <i class="el-icon-position" style="margin-right:10px;"></i>
        查询
      </el-button>
    </div>
  </div>
</template>

<script>
import Clock from 'vue-clock2'
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['updateActivePath']),
    goReserve () {
      this.updateActivePath('/reserve')
      this.$router.push('/reserve')
    }
  },
  components: {
    Clock
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: linear-gradient(to right top, #845ec2, #a55dbd, #c15db5, #d95fab, #ec64a0, #f76e91, #fd7b84, #ff8a7a, #ffa26e, #ffbd66, #ffda65, #f9f871);
  .img1 {
    width: 400px;
    height: 400px;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .img2 {
    width: 400px;
    height: 400px;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .flight {
    color: #fff;
    font-size: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    top: 100px;
    .el-button {
      margin-top: 50px;
      border-radius: 50px;
      background: #00c9b7;
      width: 180px;
      height: 50px;
      text-align: center;
      cursor: pointer;
      transition: all 0.5s;
      text-transform: uppercase;
      border: none;
      color: #fff;
    }
  }
}
</style>
