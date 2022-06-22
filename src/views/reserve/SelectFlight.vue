<template>
  <div class="selectFlight-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预订</el-breadcrumb-item>
      <el-breadcrumb-item>选择航班</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 没有此航班 -->
    <el-empty :description="emptyDescription" v-show="isEmpty">
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
    </el-empty>
    <!-- 当前预订类型和日期 -->
    <div v-if="!isEmpty">
      <div class="flight-title">
        <span>单程:</span>
        <span class="city">{{flightReserveForm.departcureCity}}-{{flightReserveForm.arriveCity}}</span>
        <span>{{flightReserveForm.departDate | dateFormat}}</span>
      </div>
      <!-- 筛选框 -->
      <Select></Select>
      <!-- 航班选择 -->
      <div class="select-flight">
        <el-card class="select-card" v-for="(item,index) in reserveFlight.data" :key="index" v-loading="loading">
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
                <el-button type="warning" @click="bookTicket(item)">订票</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Select from '@/components/Reserve/Select.vue'
export default {
  components: {
    Select
  },
  data () {
    return {
      // 是否为空
      isEmpty: false,
      // 空状态描述
      emptyDescription: '',
      flightReserveForm: {},
      loading: true
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
      }
      if (sessionStorage.getItem('reserveForm')) {
        this.saveReserveForm(JSON.parse(sessionStorage.getItem('reserveForm')))
        this.flightReserveForm = this.reserveForm
      }
    },
    // 订票
    bookTicket (item) {
      this.$router.push({ path: '/reserve/book', query: { flightId: item.id, flightDate: item.departDate } })
    }
  },
  created () {
    this.readSessionStorage()
    this.loading = false
    this.showEmpty()
    console.log(this.reserveFlight)
  }
}
</script>

<style lang="less" scoped>
.selectFlight-container {
  width: 100%;
  .flight-title {
    margin-top: 30px;
    font-size: 20px;
    display: flex;
    width: 30%;
    justify-content: space-between;
    align-items: center;
    color: #999;
    .city {
      color: black;
      font-size: 30px;
    }
  }
  .select-flight {
    width: 100%;
    margin-top: 20px;
    .card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        width: 33%;
        display: flex;
        align-items: center;
        img {
          -webkit-user-drag: none;
        }
        div {
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          span {
            color: #0086f6;
            font-size: 14px;
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
          font-size: 12px;
        }
        .time {
          font-size: 30px;
        }
      }
    }
    .select-card:hover{
      box-shadow: 0 0 15px rgb(0 0 0 / 20%);
    }
  }
}
</style>
