<template>
  <div class="home-container">
    <div class="flight">
      <Clock></Clock>
      <div>即刻起飞!</div>
      <el-button @click="goReserve">
        <i class="el-icon-position" style="margin-right:10px;"></i>
        查询
      </el-button>
      <img src="@/assets/svg/color-scheme-right.svg" class="img1">
      <img src="@/assets/svg/color-scheme-left.svg" alt="" class="img2">
    </div>
    <div class="recommend">
      <div class="recommend_city">
        <div class="title">
          <h2>航班推荐</h2>
        </div>
        <div class="depart">
          <div>出发城市:</div>
          <div class="city_left">
            <City @transfer="getDepartucreCity"></City>
          </div>
        </div>
        <div class="depart">
          <div>到达城市:</div>
          <div class="city_left">
            <City @transfer="getArriveCity"></City>
          </div>
        </div>
        <div>
          <el-button @click="getRecommendFlight" type="success" icon="el-icon-search" circle></el-button>
        </div>
      </div>
      <div class="no_result">
        <el-empty v-if="noResultShow" image="https://webresource.c-ctrip.com/ResH5FlightOnline/flight-home/online/no_result.png">抱歉，没有找到满足条件的航班</el-empty>
        <!-- 推荐城市 -->
        <div v-loading="loadingStatus" element-loading-text="航班路线正在加载中">
          <div class="result" v-if="cities.length !==0">共为您推荐{{cities.length}}条航班路线</div>
          <el-card v-for="(item,index) in cities" :key="index">
            <div class="content">
              <span style="margin-right:10px;">{{index + 1}}</span>
              <span>{{item}}</span>
            </div>
          </el-card>
        </div>
        <el-button v-if="loadingStatus" style="margin-top:50px;" type="danger" @click="cancelRecommend">取消推荐</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Clock from 'vue-clock2'
import City from '@/components/city/City.vue'
import { roadRecommend } from '@/api/query'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      departucreCity: '',
      arriveCity: '',
      noResultShow: false,
      cities: [],
      loadingStatus: false
    }
  },
  methods: {
    ...mapMutations(['updateActivePath']),
    goReserve () {
      this.updateActivePath('/reserve')
      this.$router.push('/reserve')
    },
    // 航班推荐
    async getRecommendFlight () {
      try {
        if (this.departucreCity === '' || this.arriveCity === '') return this.$message.warning('出发和到达城市都要填写完整')
        this.loadingStatus = true
        this.noResultShow = true
        const { data: res } = await roadRecommend(this.departucreCity, this.arriveCity)
        if (res.resultCode === 500) this.noResultShow = true
        this.cities = res.data
        this.noResultShow = false
        this.loadingStatus = false
      } catch (e) {
        this.noResultShow = true
      }
    },
    getDepartucreCity (val) {
      this.departucreCity = val
    },
    getArriveCity (val) {
      this.arriveCity = val
    },
    // 取消推荐
    cancelRecommend () {
      this.loadingStatus = false
      const cancelToken = axios.CancelToken
      const source = cancelToken.source()
      source.cancel('取消航班路线请求')
    }
  },
  components: {
    Clock,
    City
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  position: relative;
  .flight {
    width: 100%;
    height: 550px;
    background-image: linear-gradient(to right top, #845ec2, #a55dbd, #c15db5, #d95fab, #ec64a0, #f76e91, #fd7b84, #ff8a7a, #ffa26e, #ffbd66, #ffda65, #f9f871);
    color: #fff;
    font-size: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
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
  }
  .recommend {
    width: 100%;
    margin-top: 30px;
    .recommend_city {
      display: flex;
      .title {
        width: 20%;
      }
      .depart {
        width: 25%;
        display: flex;
        align-items: center;
        .city_left {
          margin-left: 10px;
        }
      }
    }
    .no_result {
      text-align: center;
      .content {
        display: flex;
        align-items: center;
      }
    }
  }
  .login-status {
    width: 100%;
    position: absolute;
    top: 80%;
  }
}
.result{
  margin: 30px;
  font-size: 35px;
}
</style>
