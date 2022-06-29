<template>
  <!-- 购买机票页面 -->
  <div class="book-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预定</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/reserve/selectFlight?depart=${path.depart}&arrive=${path.arrive}&date=${path.date}` }">选择航班</el-breadcrumb-item>
      <el-breadcrumb-item>填写信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="1" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="锁定机票"></el-step>
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
        <el-alert title="航班价格规则(最终价格请以结算为准)" type="success" description="每天特惠 + 基建税燃油税 + 舱位附加价格 + 行李费 + 票价类型打折(成人票不打折,儿童票8折，婴儿票3折)">
        </el-alert>
        <div class="cardDiv">
          <el-card>
            <div slot="header">
              <span>乘机人</span>
              <el-radio-group v-model="seatRadio" style="margin-left:40px;">
                <el-radio-button label="经济舱"></el-radio-button>
                <el-radio-button label="商务舱"></el-radio-button>
                <el-radio-button label="头等舱"></el-radio-button>
              </el-radio-group>
            </div>
            <!-- 动态组件 -->
            <component ref="passengerRef" v-for="(item,index) in PassengerArr" :is="item.name" :key="index">
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
          <div class="rightButton">
            <el-button type="primary" v-loading="btnLoading" element-loading-text="抢票中,请耐心等待" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @click="commitPassenger">下一步</el-button>
          </div>
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
              <span>{{seatRadio}}</span>
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
          <div class="ticket-price">
            <div>
              <span>人数:</span>
              <span>
                ￥{{resultData.price}} x {{PassengerArr.length}}
              </span>
            </div>
            <div>
              <span>行李:</span>
              <span>
                ￥{{ticketPrice.luggage}} x {{PassengerArr.length}}
              </span>
            </div>
            <div>
              <span>燃油税:</span>
              <span>
                ￥{{ticketPrice.tax}} x {{PassengerArr.length}}
              </span>
            </div>
            <div>
              <span>每天特惠:</span>
              <span>
                ￥{{ticketPrice.todayPrice}}
              </span>
            </div>
          </div>
          <!-- 下 -->
          <div class="bottom">
            <div>
              ￥{{
                resultData.price * PassengerArr.length +
                ticketPrice.tax * PassengerArr.length +
                ticketPrice.luggage * PassengerArr.length +
                ticketPrice.todayPrice +
                seatClass * PassengerArr.length
              }}
            </div>
          </div>
          <div style="text-align:right;color:red;font-size:5px;">最终价格,请到结算页面查看。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { flightIdQuery } from '@/api/query'
import { ticketPrice, orderTicket } from '@/api/ticket'
import Passenger from '@/components/Reserve/Passenger.vue'
import { mapState, mapMutations } from 'vuex'
import { getOrder } from '@/api/order'
export default {
  name: 'Book',
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
      linkDisabled: false,
      // 票价规则
      ticketPrice: {},
      path: {
        depart: '',
        arrive: '',
        date: ''
      },
      seatRadio: '经济舱',
      // 选择座位类型
      seatClass: 0,
      flightSeat: 3,
      btnLoading: false,
      person: {
        adult: 0,
        baby: 0,
        child: 0
      },
      commitFlag: false
    }
  },
  methods: {
    ...mapMutations(['savePassengereInfo', 'updatePassengerInfo', 'clearPassengereInfo']),
    // 查询航班信息
    async getFlightInfo () {
      const { data: res } = await flightIdQuery(this.pathInfo)
      if (res.resultCode !== 200) {
        return this.$message.error('查询结果失败!')
      }
      this.resultData = res.data
      this.description1 = '出行提醒: ' + `抵达${this.resultData.arriveCityName}提醒· ` + ` ${this.resultData.departureCityName}出港提醒`
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
    // 下一步 提交乘客信息
    async commitPassenger () {
      if (this.commitFlag === true) return
      const verify = this.$refs.passengerRef.every(item => {
        return item.flag === true
      })
      if (verify !== true) return this.$message.info('乘机人信息填写不完整!')
      // 获取动态组件里的值
      this.$refs.passengerRef.forEach(item => {
        this.savePassengereInfo(item.passengerForm)
      })
      // 更新舱位等级
      this.updatePassengerInfo(this.flightSeat)
      const passengerObj = {
        userId: '1',
        orderFlightDto: [
          {
            departDate: this.pathInfo.flightDate,
            flightId: this.pathInfo.flightId,
            // 飞机票基础价格
            ticketSalePrice: this.resultData.price,
            // 燃油税
            taxFee: this.ticketPrice.tax,
            dayDiscount: this.ticketPrice.todayPrice,
            seatPrice: this.seatClass,
            ticketTypePrice: 0,
            // 行李费
            luggagePrice: this.ticketPrice.luggage
          }
        ],
        passengerDto: this.passengerInfo,
        tripType: 0
      }
      const { data: res } = await orderTicket(passengerObj)
      this.clearPassengereInfo()
      this.btnLoading = true
      this.commitFlag = true
      // 延时发送订单请求
      setTimeout(async () => {
        try {
          const { data: result } = await getOrder()
          if (result.resultCode === 200) {
            this.$message.success('为您锁定机票成功')
            this.btnLoading = false
            return this.$router.replace('/reserve/service')
          } else if (result.resultCode !== 200) {
            this.$message.error('为你抢票失败,请重新选择航班。')
            return this.$router.push('/reserve')
          }
        } catch (e) {
          this.btnLoading = false
          this.commitFlag = false
          this.$message.error('抢票失败,请重新抢票试一试!')
        }
      }, 1000)
      // 失败 让顾客重新选择航班
      if (res.resultCode === 500) {
        this.$message.error('已没有剩余票数,请重新选择航班。')
        return this.$router.push('/reserve')
      }
    },
    // 获取票价规则
    async getTicket () {
      const { data: res } = await ticketPrice()
      this.ticketPrice = res.data
      this.seatClass = this.ticketPrice.economyClass
    }
  },
  created () {
    // 取出路由中携带的参数
    this.pathInfo = this.$route.query
    this.getFlightInfo()
    this.getTicket()
  },
  mounted () {
    // 获取路径参数
    this.path = JSON.parse(localStorage.getItem('path'))
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
    },
    seatRadio (newVal) {
      if (newVal === '头等舱') {
        this.flightSeat = 1
        this.seatClass = this.ticketPrice.firstClass
      } else if (newVal === '商务舱') {
        this.flightSeat = 2
        this.seatClass = this.ticketPrice.businessClass
      } else if (newVal === '经济舱') {
        this.flightSeat = 3
        this.seatClass = this.ticketPrice.economyClass
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
        .rightButton {
          margin-top: 30px;
          width: 100%;
          .el-button {
            width: 100%;
          }
        }
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
      width: 30%;
      height: 50%;
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
        .ticket-price {
          border-bottom: 1px dashed #b4c4d6;
          div {
            display: flex;
            align-items: center;
            height: 25px;
            justify-content: space-between;
            span {
              padding: 0 30px;
            }
          }
        }
      }
    }
  }
}
</style>
