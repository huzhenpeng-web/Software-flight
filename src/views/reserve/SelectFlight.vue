<template>
  <div class="selectFlight-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预订</el-breadcrumb-item>
      <el-breadcrumb-item>选择航班</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 没有此航班 -->
    <el-empty :description="emptyDescription" v-show="isEmpty"></el-empty>
    <!-- 城市选择 -->
    <!-- <div>城市选择</div> -->
    <!-- <div>日期</div> -->
    <!-- 航班选择 -->
    <div class="select-flight">
      <el-card v-for="(item,index) in flightInfo" :key="index">
        <div class="card">
          <!-- 左 -->
          <div class="left">
            <!-- 航空公司图标 -->
            <img :src="item.airlineImg" alt="">
            <!-- 名字 -->
            <div>
              {{item.airlineCompanyName}}
              <span>{{item.flightNo}}</span>
            </div>
          </div>
          <!-- 中 -->
          <div class="medium">
            <div class="medium-left">
              <span class="time">{{item.departTime | timeFormat}}</span>
              <span class="airport">{{item.departPortName}}</span>
            </div>
            <div>
              <img src="@/assets/images/flight/jiantou.png" alt="">
            </div>
            <div class="medium-right">
              <span class="time">{{item.arriveTime | timeFormat}}</span>
              <span class="airport">{{item.arrivePortName}}</span>
            </div>
            <div class="timeRate">到达准点率:{{item.onTimeRate}}</div>
          </div>
          <!-- 右 -->
          <div class="right">
            <div class="right-left">
              <span class="price">￥{{item.price}}</span>
              <span style="color: #0086f6;">起</span>
            </div>
            <div class="right-right">
              <el-button type="warning">订票</el-button>
            </div>
          </div>
        </div>

      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isEmpty: false,
      emptyDescription: '',
      flightInfo: ''
    }
  },
  computed: {
    ...mapState(['reserveFlight', 'reserveForm'])
  },
  methods: {
    ...mapMutations(['saveReserveFlight', 'saveReserveForm']),
    // 是否显示空状态
    showEmpty () {
      if (this.reserveFlight.resultCode !== 200) {
        this.isEmpty = true
        this.emptyDescription = `您查询的 ${this.reserveForm.departcureCity} 至
        ${this.reserveForm.arriveCity}（出发日期：${this.reserveForm.departcureDate}） 的机票可能因无航班或航班座位已售完导致暂时无法查询到对应价格。 建议您更换旅行日期或旅行城市重新查询`
      }
    },
    // 读取sessionStorage
    readSessionStorage () {
      if (sessionStorage.getItem('reserveFlight')) {
        this.saveReserveFlight(JSON.parse(sessionStorage.getItem('reserveFlight')))
        this.flightInfo = this.reserveFlight.data
      }
      if (sessionStorage.getItem('reserveForm')) {
        this.saveReserveForm(JSON.parse(sessionStorage.getItem('reserveForm')))
      }
    }
  },
  created () {
    this.readSessionStorage()
    console.log(this.reserveFlight)
    this.showEmpty()
  }
}
</script>

<style lang="less" scoped>
.selectFlight-container {
  width: 100%;
  .select-flight {
    margin-top: 30px;
    width: 100%;
    .card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        width: 33%;
        display: flex;
        align-items: center;
        img{
          -webkit-user-drag: none;
        }
        div {
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          span {
            color: #0086f6;
            font-size: 8px;
          }
        }
      }
      .right {
        width: 33%;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .right-left {
          width: 80%;
          .price {
            color: #0086f6;
            font-size: 30px;
          }
        }
        .right-right {
          width: 20%;
        }
      }
      .medium {
        width: 33%;
        text-align: center;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .medium-left,
        .medium-right {
          display: flex;
          flex-direction: column;
          .airport {
            font-size: 12px;
          }
        }
        .timeRate {
          color: #0086f6;
          font-size: 8px;
        }
        .time {
          font-size: 30px;
        }
      }
    }
  }
}
</style>
