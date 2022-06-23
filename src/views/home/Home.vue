<template>
  <div>
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="item in carouselImgs" :key="item.url">
        <a href="#">
          <img :src="item.url" width="100%" height="100%" />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      carouselImgs: [
        { url: require('../../assets/images/plane1.jpg') },
        { url: require('../../assets/images/plane2.jpg') },
        { url: require('../../assets/images/plane3.jpg') },
        { url: require('../../assets/images/plane4.jpg') },
        { url: require('../../assets/images/barImg1.jpg') }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.el-carousel{
  margin-top:15px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
