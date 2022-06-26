<template>
  <div class="selectFlight-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预订</el-breadcrumb-item>
      <el-breadcrumb-item>选择航班</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 没有此航班 -->
    <el-empty :description="emptyDescription" v-if="isEmpty">
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
    </el-empty>
    <!-- 当前预订类型和日期 -->
    <div v-if="!isEmpty">
      <div class="flight-title">
        <span>单程:</span>
        <span class="city">{{flightReserveForm.departcureCity}}-{{flightReserveForm.arriveCity}}</span>
        <span>{{this.$route.query.date | dateFormat}}</span>
      </div>
      <!-- 筛选框 -->
      <Select v-if="hackReset"></Select>
      <!-- 航班选择 -->
      <div class="select-flight">
        <el-collapse accordion>
          <el-card class="select-card" v-for="(item,index) in reserveFlight.data" :key="index" v-loading="loading">
            <div class="card">
              <!-- 左 -->
              <div class="left">
                <!-- 航空公司图标 -->
                <el-image :src="item.airlineImg" alt="">
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
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
            <el-collapse-item @click.native="handleChange(item)" title="查看航班剩余座位">
              <div v-if="code === 200" class="seat">
                <el-tag effect="dark">
                  头等舱:{{ seatInfo.firstSurplus}}张
                </el-tag>
                <el-tag effect="dark" type="success">
                  商务舱:{{ seatInfo.businessSurplus}}张
                </el-tag>
                <el-tag effect="dark" type="info">
                  经济舱:{{ seatInfo.economySurplus}}张
                </el-tag>
                <el-tag effect="dark" type="danger">
                  总座位:{{ seatInfo.countSeat}}
                </el-tag>
              </div>
              <div v-if="code === 500">
                <el-alert title="购票时间已过" :closable="false" center type="error" effect="dark">
                </el-alert>
              </div>
              <div v-if="code === 404">
                <el-alert title="获取当前座位数失败,请刷新后重试!" :closable="false" center type="error" effect="dark">
                </el-alert>
              </div>
            </el-collapse-item>
          </el-card>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { flightQuery } from '@/api/query'
import { getSeat } from '@/api/ticket'
import Select from '@/components/Reserve/Select.vue'
import moment from 'moment'
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
      loading: true,
      path: {
        depart: '',
        arrive: '',
        date: ''
      },
      seatInfo: [],
      code: 0,
      hackReset: false
    }
  },
  computed: {
    ...mapState(['reserveFlight', 'reserveForm'])
  },
  methods: {
    ...mapMutations(['saveReserveFlight', 'saveReserveForm']),
    // 是否显示空状态
    async showEmpty () {
      const { data: res } = await flightQuery(this.$route.query.depart, this.$route.query.arrive, this.$route.query.date)
      window.sessionStorage.setItem('reserveFlight', JSON.stringify(res))
      this.saveReserveFlight(res)
      this.$nextTick(() => {
        this.hackReset = true
      })
      if (this.reserveFlight.resultCode !== 200) {
        this.isEmpty = true
        this.emptyDescription = `您查询的 ${this.reserveForm.departcureCity} 至
        ${this.reserveForm.arriveCity}（出发日期：${this.$route.query.date}）的机票可能因无航班或航班座位已售完导致暂时无法查询到对应价格。 建议您更换旅行日期或旅行城市重新查询`
      }
    },
    // 读取sessionStorage
    readSessionStorage () {
      this.flightReserveForm = this.reserveForm
    },
    // 订票
    async bookTicket (item) {
      try {
        const { data: res } = await getSeat(item.id, item.departDate)
        if (res.resultCode === 500) {
          return this.$message.error('此航班无位置或时间已过,请选择其他航班')
        }
        this.$router.push({ path: '/reserve/book', query: { flightId: item.id, flightDate: item.departDate } })
      } catch (e) {
        this.$message.error('订票失败,刷新后重试')
      }
    },
    async handleChange (item) {
      try {
        const { data: res } = await getSeat(item.id, item.departDate)
        this.code = res.resultCode
        this.seatInfo = res.data
      } catch (e) {
        this.code = 404
      }
    },
    // 判断路径的时间是否小于今天
    decideTime () {
      // 今天的时间
      const now = moment(new Date()).format('YYYY-MM-DD')
      const path = moment(this.$route.query.date).format('X')
      // 保存当前路径的参数
      this.path.depart = this.$route.query.depart
      this.path.arrive = this.$route.query.arrive
      this.path.date = this.$route.query.date
      if (path < moment(now).format('X')) {
        this.path.date = now
        return this.$router.replace(`/reserve/selectFlight?depart=${this.$route.query.depart}&arrive=${this.$route.query.arrive}&date=${now}`).catch(err => err)
      }
    }
  },
  created () {
    this.loading = false
    this.showEmpty()
    this.readSessionStorage()
  },
  mounted () {
    this.decideTime()
    localStorage.setItem('path', JSON.stringify(this.path))
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
    .select-card:hover {
      box-shadow: 0 0 15px rgb(0 0 0 / 20%);
    }
    .seat {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
