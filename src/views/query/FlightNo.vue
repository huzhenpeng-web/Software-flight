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
    <div class="flight-status">
      <!-- 头部航班信息 -->
      <div class="status-top">
        <span class="left">{{flight.flightNo}}</span>
        <span class="right">{{flight.departDate}}</span>
        <span class="right">为您搜索到{{length}}条结果</span>
      </div>
      <!-- 航班内容 -->
      <div class="status-content">
        <el-card class="first-card">
          <ul>
            <li>航班信息</li>
            <li>计划起飞</li>
            <li></li>
            <li>计划抵达</li>
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
      length: 0
    }
  },
  methods: {
    // 判断是否有此航班号
    decideFlight () {
      if (this.flightNoInfo.resultCode === 500) {
        this.isShowEmpty = true
      }
    }
  },
  computed: {
    ...mapState(['flightNoData'])
  },
  mounted () {
    if (sessionStorage.getItem('flightNoData')) {
      this.flightNoInfo = JSON.parse(sessionStorage.getItem('flightNoData'))
      this.length = this.flightNoInfo.data.length
      this.flight = this.flightNoInfo.data[0]
      this.flightData = this.flightNoInfo.data
    }
    this.decideFlight()
    console.log(this.flightNoInfo)
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
