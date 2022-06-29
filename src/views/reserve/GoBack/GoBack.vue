<template>
  <!-- 往返 -->
  <div class="go_back_container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预订</el-breadcrumb-item>
      <el-breadcrumb-item>选择航班</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 航班 -->
    <div v-if="!isEmpty" class="flightDiv">
      <!-- 选择往返 -->
      <div class="go_back_tab">
        <!-- 左 -->
        <div @click="changeTab(0)" :class="{'left':isGo,'right':isBack}">
          <span class="seq_mark">1</span>
          <span class="title">选择去程</span>
          <span class="sub_title">
            <span>{{reserveForm.departcureCity}}-</span>
            <span>{{reserveForm.arriveCity}}</span>
            <span>{{reserveForm.departcureDate | dateFormat}}</span>
          </span>
        </div>
        <!-- 右 -->
        <div @click="changeTab(1)" :class="{'left':!isGo,'right':!isBack}">
          <span class="seq_mark">2</span>
          <span class="title">选择返程</span>
          <span class="sub_title">
            <span>{{reserveForm.arriveCity}}-</span>
            <span>{{reserveForm.departcureCity}}</span>
            <span>{{reserveForm.backDate | dateFormat}}</span>
          </span>
        </div>
      </div>
      <Select v-if="hackReset"></Select>
      <!-- 出发航班数据 -->
      <div class="go_flight" v-show="isGo">
        <el-collapse accordion>
          <el-card class="go_card" v-for="(item,index) in reserveFlight.data" :key="index">
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
                  <div>去程价格</div>
                </div>
                <div class="right-right">
                  <el-button type="warning" @click="selectGo(item,index)">选为去程</el-button>
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
      <!-- 返程航班数据 -->
      <div class="go_flight" v-show="isBack">
        <el-card>
          <div class="go_flight_card">
            <div>
              <span>
                已选去程:{{flightItem.departPortName}}-{{flightItem.arrivePortName}}
              </span>
              <span style="color:red;">{{flightItem.flightNo}}</span>
              <span>{{flightItem.departDate | dateFormat}}</span>
              <span>{{flightItem.departTime | timeFormat}}-{{flightItem.arriveTime | timeFormat}}</span>
              <span style="color:red;" v-if="tishiShow">暂无返程航班,请修改去程</span>
            </div>
            <div>
              <el-button type="primary" @click="changeTab(0)">修改去程</el-button>
            </div>
          </div>
        </el-card>
        <el-collapse accordion>
          <el-card class="go_card" v-for="(item,index) in reserveFlight.data" :key="index">
            <div class="card">
              <!-- 左 -->
              <div class="left">
                <!-- 航空公司图标 -->
                <el-image :src="item.airlineImg">
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
                  <span class="price">￥{{item.price + price}}</span>
                  <span style="color: #0086f6;">起</span>
                  <div>往返总价</div>
                </div>
                <div class="right-right">
                  <el-button type="warning" @click="orderTicket(item)">订票</el-button>
                </div>
              </div>
            </div>
            <el-collapse-item @click.native="handleChange(item)">
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
            </el-collapse-item>
          </el-card>
        </el-collapse>
      </div>
    </div>
    <!-- 没有此航班 -->
    <el-empty :description="emptyDescription" v-show="isEmpty">
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
    </el-empty>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Select from '@/components/Reserve/Select.vue'
import { goBackQuery, flightQuery } from '@/api/query.js'
import { getSeat } from '@/api/ticket'
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
      // 去？ 返？
      isGo: true,
      isBack: false,
      // 是否已选过去程
      flag: false,
      // 选择的去程航班价格
      price: 0,
      // 按钮样式
      // buttonType: [],
      // 选择去程的数据
      flightItem: {},
      seatInfo: [],
      code: 0,
      tishiShow: false,
      hackReset: false
    }
  },
  methods: {
    ...mapMutations(['saveReserveForm', 'saveReserveFlight']),
    // 判断是否为空
    async showEmpty () {
      // 取出路径参数
      const { data: res } = await flightQuery(this.$route.query.depart, this.$route.query.arrive, this.$route.query.date)
      if (res.resultCode !== 200) {
        this.isEmpty = true
        this.emptyDescription = `您查询的 ${this.reserveForm.departcureCity} 至
        ${this.reserveForm.arriveCity}（出发日期：${this.reserveForm.departcureDate}） 的机票可能因无航班或航班座位已售完导致暂时无法查询到对应价格。 建议您更换旅行日期或旅行城市重新查询`
      }
      this.saveReserveFlight(res)
      // 刷新子组件
      this.$nextTick(() => {
        this.hackReset = true
      })
      window.sessionStorage.setItem('reserveFlight', JSON.stringify(res))
    },
    // 选择去程并查询返程的数据
    async selectGo (item) {
      const { data: results } = await getSeat(item.id, item.departDate)
      if (results.resultCode === 500) return this.$message.error('买票时间已过,请重新选择')
      this.flightItem = item
      this.price = item.price
      const flightInfo = {
        flightId: item.id,
        arriveCityName: this.reserveForm.departcureCity,
        departureCityName: this.reserveForm.arriveCity,
        beforeDate: this.reserveForm.departcureDate,
        afterDate: this.reserveForm.backDate
      }
      const { data: res } = await goBackQuery(flightInfo)
      if (res.resultCode === 500) return this.$message.info('查询不到返程航班,请更换航班')
      if (res.data.length === 0) this.tishiShow = true
      if (res.resultCode === 200) {
        // 复制去程数据
        window.sessionStorage.setItem('reserveFlightCopy', JSON.stringify(this.reserveFlight))
        // reserveFlight保存返程数据
        this.saveReserveFlight(res)
        // 复制返程数据
        window.sessionStorage.setItem('reserveFlightCopy2', JSON.stringify(res))
        window.sessionStorage.setItem('reserveFlight', JSON.stringify(res))
        this.isActive = true
        this.isGo = false
        this.isBack = true
        this.flag = true
      }
    },
    // 切换tab
    changeTab (index) {
      if (index === 0) {
        // 切换去程数据
        this.saveReserveFlight(JSON.parse(sessionStorage.getItem('reserveFlightCopy')))
        window.sessionStorage.setItem('reserveFlight', JSON.stringify(this.reserveFlight))
        this.isGo = true
        this.isBack = false
        this.isActive = false
      }
      if (index === 1) {
        if (this.flag === false) return this.$message.warning('请先选择去程航班')
        this.saveReserveFlight(JSON.parse(sessionStorage.getItem('reserveFlightCopy2')))
        window.sessionStorage.setItem('reserveFlight', JSON.stringify(this.reserveFlight))
        this.isGo = false
        this.isBack = true
      }
    },
    // 订票
    async orderTicket (item) {
      const { data: results } = await getSeat(item.id, item.departDate)
      if (results.resultCode === 500) return this.$message.error('买票时间已过,请重新选择')
      const path = {
        depart: this.$route.query.depart,
        arrive: this.$route.query.arrive,
        date: this.$route.query.date
      }
      localStorage.setItem('goBackPath', JSON.stringify(path))
      this.$router.push(`/reserve/goback/book?goflightid=${this.flightItem.id}&goflightdate=${this.reserveForm.departcureDate}&backflightid=${item.id}&backflightDate=${this.reserveForm.backDate}`)
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
      if (path < moment(now).format('X')) {
        return this.$router.replace(`/reserve/goback?depart=${this.$route.query.depart}&arrive=${this.$route.query.arrive}&date=${now}`).catch(err => err)
      }
    }
  },
  computed: {
    ...mapState(['reserveForm', 'reserveFlight'])
  },
  created () {
    if (sessionStorage.getItem('vuex')) {
      const vuexData = JSON.parse(sessionStorage.getItem('vuex'))
      // 从sessionStorage中赋值
      this.saveReserveForm(vuexData.reserveForm)
      /*       this.reserveFlight.data.forEach(item => {
        this.buttonType.push({ type: 'warning', content: '选为去程' })
      }) */
    }
  },
  mounted () {
    this.decideTime()
    this.showEmpty()
  }
}
</script>

<style lang="less" scoped>
.go_back_container {
  width: 100%;
  .flightDiv {
    width: 90%;
    margin: 0 auto;
    margin-top: 30px;
    .go_back_tab {
      width: 100%;
      .left {
        background-color: #fff;
        cursor: pointer;
        min-width: 336px;
        height: 44px;
        display: inline-block;
        box-sizing: border-box;
        vertical-align: middle;
        padding: 10px 28px 0 24px;
        border-radius: 8px;
        margin-right: -10px;
        z-index: 1;
        .seq_mark {
          display: inline-block;
          font-weight: 700;
          width: 24px;
          height: 24px;
          border-radius: 14px;
          background: #0086f6;
          text-align: center;
          color: #fff;
          line-height: 22px;
          font-size: 19px;
        }
        .title {
          color: #0086f6;
          font-size: 18px;
          padding-left: 8px;
        }
        .sub_title {
          padding-left: 5px;
        }
      }
      .right {
        background-color: #dde4ed;
        min-width: 336px;
        cursor: pointer;
        height: 44px;
        vertical-align: middle;
        padding: 10px 28px 0 24px;
        border-radius: 8px;
        display: inline-block;
        z-index: 0;
        color: #5678a8;
        .seq_mark {
          display: inline-block;
          font-weight: 700;
          width: 24px;
          height: 24px;
          border-radius: 14px;
          background-color: #5678a8;
          text-align: center;
          color: #fff;
          line-height: 22px;
          font-size: 19px;
        }
      }
    }
    .go_flight {
      margin-top: 15px;
      .go_flight_card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          margin-right: 5px;
        }
        .el-button {
          float: right;
        }
      }
      .el-card {
        margin-top: 5px;
      }
      .go_card:hover {
        box-shadow: 0 0 15px rgb(0 0 0 / 20%);
      }
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
            padding-right: 5px;
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
    }
  }
}
.seat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
