<template>
  <div class="flightNo-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/query'}">查询航班</el-breadcrumb-item>
      <el-breadcrumb-item>搜航班号</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 空状态 -->
    <el-empty description="未查询到航班，请修改条件重新查询" v-show="isShowEmpty"></el-empty>
    <!-- 航班状态 -->
    <div class="flight-status" v-show="!isShowEmpty">
      <!-- 头部航班信息 -->
      <div class="status-top">
        <span class="left" v-show="this.flightRadio === '1'">{{flight.flightNo}}</span>
        <span class="left" v-show="this.flightRadio === '2'">{{flight.departureCityName}}-{{flight.arriveCityName}}</span>
        <span class="right">{{flight.departDate}}</span>
        <span class="right">为您搜索到{{length}}条结果</span>
      </div>
      <!-- 航班内容 -->
      <div class="status-content">
        <el-card class="first-card">
          <ul>
            <li>航班信息</li>
            <li @click="departcureOnclick" ref="depContainerRef">
              计划起飞
              <i class="el-icon-arrow-down" v-show="!isDepUp"></i>
              <i class="el-icon-arrow-up" v-show="isDepUp"></i>
              <div v-if="isDepContainer" class="depContainer" >
                <div @click="depSort(0)">计划起飞 早-晚</div>
                <div @click="depSort(1)">计划起飞 晚-早</div>
              </div>
            </li>
            <li></li>
            <li @click="arriveOnclick" ref="arrContainerRef">
              计划抵达
              <i class="el-icon-arrow-down" v-show="!isArrUp"></i>
              <i class="el-icon-arrow-up" v-show="isArrUp"></i>
              <div v-if="isArrContainer" class="arrContainer">
                <div @click="arrSort(0)">计划抵达 早-晚</div>
                <div @click="arrSort(1)">计划抵达 晚-早</div>
              </div>
            </li>
            <li>航班状态</li>
          </ul>
        </el-card>
        <el-card v-for="(item,index) in flightData" :key="index" class="other-card">
          <ul>
            <li class="item1">
              <img :src="item.airlineImg" alt="">
              <div>{{item.airlineCompanyName + item.flightNo}}</div>
            </li>
            <li class="item2">
              <span class="time">{{item.departTime | timeFormat}}</span>
              <span>{{item.departPortName}}</span>
            </li>
            <li>
              <img src="@/assets/images/flight/jiantou.png" alt="">
            </li>
            <li class="item2">
              <span class="time">{{item.arriveTime | timeFormat}}</span>
              <span>{{item.arrivePortName}}</span>
            </li>
            <li :class="{successStatus:item.flightStatus === '航班按计划执行',failStatus:item.flightStatus === '航班取消'}">{{item.flightStatus}}</li>
          </ul>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      // 查询航班号的数据
      flightNoInfo: {},
      flight: [],
      flightData: [],
      // 航班号
      flightNo: '',
      isShowEmpty: false,
      length: 0,
      // 计划起飞
      isDepUp: false,
      // 计划抵达
      isArrUp: false,
      // 计划起飞面板
      isDepContainer: false,
      isArrContainer: false,
      flightRadio: ''
    }
  },
  methods: {
    // 判断是否有此航班号
    decideFlight () {
      if (this.flightNoInfo.resultCode === 500) {
        this.isShowEmpty = true
      }
    },
    // 计划起飞
    departcureOnclick () {
      this.isDepUp = !this.isDepUp
      this.isDepContainer = !this.isDepContainer
    },
    // 计划抵达
    arriveOnclick () {
      this.isArrUp = !this.isArrUp
      this.isArrContainer = !this.isArrContainer
    },
    // 点击其他区域关闭
    otherClose (e) {
      if (!this.$refs.depContainerRef.contains(e.target)) {
        this.isDepContainer = false
      }
      if (!this.$refs.arrContainerRef.contains(e.target)) {
        this.isArrContainer = false
      }
    },
    // 起飞排序
    depSort (index) {
      this.flightData.forEach(item => {
        item.time = new Date(item.departDate + ' ' + item.departTime).getTime()
      })
      // 早-晚
      if (index === 0) {
        const up = (a, b) => { return a.time - b.time }
        return this.flightData.sort(up)
      } else {
      // 晚-早
        const down = (a, b) => { return b.time - a.time }
        return this.flightData.sort(down)
      }
    },
    // 抵达排序
    arrSort (index) {
      this.flightData.forEach(item => {
        item.time = new Date(item.departDate + ' ' + item.arriveTime).getTime()
      })
      // 早-晚
      if (index === 0) {
        const up = (a, b) => { return a.time - b.time }
        return this.flightData.sort(up)
      } else {
      // 晚-早
        const down = (a, b) => { return b.time - a.time }
        return this.flightData.sort(down)
      }
    }
  },
  computed: {
    ...mapState(['flightNoData'])
  },
  created () {
    if (window.sessionStorage.getItem('flightRadio')) {
      this.flightRadio = JSON.parse(window.sessionStorage.getItem('flightRadio'))
    }
  },
  mounted () {
    // 按航班号搜索
    if (this.flightRadio === '1') {
      const data = JSON.parse(sessionStorage.getItem('flightNoData'))
      this.flightNoInfo = data
      if (data.resultCode === 200) {
        this.length = this.flightNoInfo.data.length
        this.flight = this.flightNoInfo.data[0]
        this.flightData = this.flightNoInfo.data
      }
    } else { // 按起降地搜索
      const data = JSON.parse(sessionStorage.getItem('flightData'))
      this.flightNoInfo = data
      if (data.resultCode === 200) {
        this.length = this.flightNoInfo.data.length
        this.flight = this.flightNoInfo.data[0]
        this.flightData = this.flightNoInfo.data
      }
    }
    this.decideFlight()
    window.addEventListener('click', this.otherClose)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.otherClose)
  }
}
</script>

<style lang="less" scoped>
.flightNo-container {
  width: 100%;
  .flight-status {
    width: 90%;
    margin: 0 auto;
    .status-top {
      margin-top: 30px;
      .left {
        font-size: 24px;
        line-height: 32px;
        margin-right: 15px;
      }
      .right {
        color: #999;
      }
    }
    .status-content {
      margin-top: 30px;
      ul {
        list-style: none;
      }
      .first-card {
        border-radius: 8px 8px 0 0;
        width: 100%;
        ul {
          display: flex;
          align-items: center;
          justify-content: space-between;
          li {
            width: 20%;
            text-align: center;
            cursor: pointer;
          }
        }
        .depContainer,
        .arrContainer {
          min-width: 164px;
          background: #fff;
          z-index: 99;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 14px;
          line-height: 18px;
          position: absolute;
          margin-left: 30px;
          div {
            padding: 11px 0;
          }
          div:hover {
            background-color: #f2f8fe;
          }
        }
      }
      .other-card {
        margin-top: 30px;
        cursor: pointer;
        ul {
          display: flex;
          justify-content: space-between;
          align-items: center;
          li {
            width: 20%;
            text-align: center;
          }
          .item1 {
            display: flex;
            align-items: center;
            img {
              margin-right: 30px;
            }
          }
          .item2 {
            display: flex;
            align-items: center;
            flex-direction: column;
            .time {
              font-size: 30px;
              font-weight: 500;
            }
          }
        }
      }
      .other-card:hover {
        background-color: #f2f8fe;
      }
      .successStatus {
        color: #00b87a;
        font-size: 20px;
      }
      .failStatus {
        color: red;
        font-size: 20px;
      }
    }
  }
}
</style>
