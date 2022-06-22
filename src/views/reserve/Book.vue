<template>
  <!-- 购买机票页面 -->
  <div class="book-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预定</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reserve/selectFlight' }">选择航班</el-breadcrumb-item>
      <el-breadcrumb-item>填写信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="1" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="增值服务"></el-step>
      <el-step description="支付"></el-step>
      <el-step description="完成"></el-step>
    </el-steps>
    <!-- 展示信息 -->
    <div class="userInfo">
      <!-- 左 -->
      <div class="left">
        <el-alert :title="description1" type="warning" show-icon>
        </el-alert>
        <el-alert title="出行提醒 ·东航、上航推行免费预选座位服务" type="success" show-icon>
        </el-alert>
        <div class="cardDiv">
          <el-card>
            <div slot="header">
              <span>乘机人</span>
            </div>
            <component v-for="(item,index) in PassengerArr" :is="item.name" :key="index">
              <span slot="passengerNum-slot">{{index + 1}}</span>
              <i class="el-icon-close" slot="close-slot" @click="removePassenger(index)" v-show="index !== 0">删除</i>
            </component>
            <!-- 新增乘机人 -->
            <div class="addPassengerDiv">
              <el-link @click="addPassenger" type="primary" :underline="false" :disabled="linkDisabled">
                <i class="el-icon-circle-plus-outline">
                  <span>新增乘机人</span>
                </i>
              </el-link>
            </div>
          </el-card>
        </div>
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="right-box">
          <!-- 上 -->
          <div class="top">
            <div class="top-title">
              <div>{{resultData.departDate | dateFormat}}</div>
              <div>
                {{resultData.departureCityName}}
                <i class="el-icon-arrow-right"></i>
                {{resultData.arriveCityName}}
              </div>
            </div>
            <div class="top-flight">
              <span class="span1">
                <img :src="resultData.airlineImg" alt="">
                <span>{{resultData.airlineCompanyName}}</span>
              </span>
              <span>{{resultData.flightNo}}</span>
            </div>
            <div class="top-bottom">
              <div class="topDiv">
                <span class="time">{{resultData.departTime | timeFormat}}</span>
                <span>{{resultData.departPortName}}</span>
              </div>
              <div class="timeLine">
                <!-- 时间 -->
                <div>
                  <i class="el-icon-right"></i>
                </div>
                <div class="timeline"></div>
              </div>
              <div class="topDiv topSpan">
                <span class="time">{{resultData.arriveTime | timeFormat}}</span>
                <span>{{resultData.arrivePortName}}</span>
              </div>
            </div>
          </div>
          <!-- 下 -->
          <div class="bottom">
            <div>￥{{resultData.price * this.PassengerArr.length}}</div>
          </div>
        </div>
      </div>
      <div class="rightButton">
        <el-button type="primary" @click="logPassenger">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { flightIdQuery } from '@/api/query'
import Passenger from '@/components/Reserve/Passenger.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    Passenger
  },
  data () {
    return {
      // 路由中参数对象
      pathInfo: {},
      description1: '',
      // 航班id查询的结果
      resultData: [],
      // 乘客组件数量
      PassengerArr: [
        {
          name: 'Passenger'
        }
      ],
      // 添加乘客状态
      linkDisabled: false
    }
  },
  methods: {
    ...mapMutations(['savePassengereInfo']),
    // 查询航班信息
    async getFlightInfo () {
      const { data: res } = await flightIdQuery(this.pathInfo)
      if (res.resultCode !== 200) {
        return this.$message.error('查询结果失败!')
      }
      this.resultData = res.data
      this.description1 = '出行提醒: ' + `抵达${this.resultData.arriveCityName}提醒· ` + ` ${this.resultData.departureCityName}出港提醒`
      console.log(res)
    },
    // 添加乘客数量
    addPassenger () {
      if (this.linkDisabled === true) return
      this.PassengerArr.push({ name: 'Passenger' })
    },
    // 减少乘客
    removePassenger (index) {
      this.PassengerArr.splice(index, 1)
    },
    // 打印乘客信息
    logPassenger () {
      if (this.passengerInfo.length === 0) {
        return this.$message.info('请填写完整的乘客信息')
      }
      console.log(this.passengerInfo)
      this.savePassengereInfo([])
    }
  },
  created () {
    // 取出路由中携带的参数
    this.pathInfo = this.$route.query
    this.getFlightInfo()
  },
  computed: {
    ...mapState(['passengerInfo'])
  },
  watch: {
    PassengerArr (newVal) {
      if (newVal.length > 8) {
        this.linkDisabled = true
      } else {
        this.linkDisabled = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.book-container {
  width: 100%;
  height: 100%;
  .el-steps {
    margin-top: 30px;
  }
  .userInfo {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    margin-top: 30px;
    .left {
      width: 50%;
      height: 80%;
      .el-alert {
        margin-top: 10px;
      }
      .cardDiv {
        margin-top: 30px;
        .addPassengerDiv {
          margin-top: 15px;
          text-align: center;
          color: #0086f6;
          font-weight: 500;
          i {
            cursor: pointer;
          }
          span {
            margin-left: 10px;
          }
        }
      }
    }
    .right {
      width: 50%;
      height: 30%;
      position: fixed;
      right: 50px;
      .right-box {
        float: right;
        width: 398px;
        min-height: 180px;
        border: solid #d6dde2;
        border-width: 0 1px;
        background: #f5f8f9;
        display: flex;
        flex-direction: column;
        .top {
          border-bottom: 1px dashed #b4c4d6;
          .top-title {
            width: 80%;
            margin: 0 auto;
            display: flex;
            justify-content: space-around;
            font-size: 17px;
            font-weight: 700;
          }
          .top-flight {
            width: 60%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            height: 50px;
            color: #849bab;
            font-size: 12px;
            justify-content: space-around;
            .span1 {
              display: flex;
              align-items: center;
            }
            img {
              width: 30px;
              height: 30px;
            }
          }
          .top-bottom {
            width: 80%;
            margin: 0 auto;
            display: flex;
            justify-content: space-around;
            .topDiv {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .topSpan {
              margin-bottom: 15px;
            }
            .time {
              font-size: 24px;
              font-weight: 500;
              height: 27px;
            }
            .timeLine {
              display: flex;
              flex-direction: column;
              align-items: center;
              .timeline {
                width: 80px;
                height: 1px;
                background: #dbe2ea;
              }
            }
          }
        }
        .bottom {
          div {
            color: #ff7d13;
            font-size: 35px;
            font-weight: 700;
            float: right;
          }
        }
      }
    }
    .rightButton {
      position: fixed;
      right: 50px;
      top: 500px;
      width: 398px;
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
