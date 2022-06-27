<template>
  <!-- 往返 -->
  <div class="gb_book_container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reserve' }">机票预定</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/reserve/goback?depart=${path.depart}&arrive=${path.arrive}&date=${path.date}` }">选择航班</el-breadcrumb-item>
      <el-breadcrumb-item>填写信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="1" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="锁定机票"></el-step>
      <el-step description="支付"></el-step>
      <el-step description="完成"></el-step>
    </el-steps>
    <!-- 信息展示 -->
    <div class="gb_book_info">
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
        </div>
        <div class="right-button">
          <el-button type="primary" v-loading="btnLoading" element-loading-text="抢票中,请耐心等待" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @click="submitPassenger">下一步</el-button>
        </div>
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="right-box">
          <!-- 去程 -->
          <div class="go_box">
            <div class="city">
              <span class="basic-tag">去</span>
              <span class="time font">{{goFlight.departDate | dateFormat}}</span>
              <span class="cityFont font">{{goFlight.departureCityName}}</span>
              <i class="el-icon-arrow-right font"></i>
              <span class="font">{{goFlight.arriveCityName}}</span>
            </div>
            <div class="flight">
              <img :src="goFlight.airlineImg" alt="">
              <span style="margin-right:10px;">{{goFlight.airlineCompanyName}}</span>
              <span>{{goFlight.flightNo}}</span>
              <span style="padding-left:10px;">{{seatRadio}}</span>
            </div>
            <div class="go_time">
              <!-- 出发 -->
              <div class="depart">
                <span class="depart_time">{{goFlight.departTime | timeFormat}}</span>
                <span>{{goFlight.departPortName}}</span>
              </div>
              <!-- 时间线 -->
              <div class="timeLine">
                <!-- 时间 -->
                <div>
                  <i class="el-icon-right"></i>
                </div>
                <div class="timeline"></div>
              </div>
              <!-- 到达 -->
              <div class="depart">
                <span class="depart_time">{{goFlight.arriveTime | timeFormat}}</span>
                <span>{{goFlight.arrivePortName}}</span>
              </div>
            </div>
          </div>
          <!-- 返程 -->
          <div class="go_box">
            <div class="city">
              <span class="basic-tag">返</span>
              <span class="time font">{{backFlight.departDate | dateFormat}}</span>
              <span class="font">{{backFlight.departureCityName}}</span>
              <i class="el-icon-arrow-right font"></i>
              <span class="cityFont font">{{backFlight.arriveCityName}}</span>
            </div>
            <div class="flight">
              <img :src="backFlight.airlineImg" alt="">
              <span style="margin-right:10px;">{{backFlight.airlineCompanyName}}</span>
              <span>{{backFlight.flightNo}}</span>
              <span style="padding-left:10px;">{{seatRadio}}</span>
            </div>
            <div class="go_time">
              <!-- 出发 -->
              <div class="depart">
                <span class="depart_time">{{backFlight.departTime | timeFormat}}</span>
                <span>{{backFlight.departPortName}}</span>
              </div>
              <!-- 时间线 -->
              <div class="timeLine">
                <!-- 时间 -->
                <div>
                  <i class="el-icon-right"></i>
                </div>
                <div class="timeline"></div>
              </div>
              <!-- 到达 -->
              <div class="depart">
                <span class="depart_time">{{backFlight.arriveTime | timeFormat}}</span>
                <span>{{backFlight.arrivePortName}}</span>
              </div>
            </div>
          </div>
          <!-- 价格详细 -->
          <div class="price_description">
            <!-- go -->
            <div class="go">
              <span>去程</span>
              <div class="go_price">
                <p>
                  人数:
                  <span>￥{{goFlight.price}}x{{PassengerArr.length}}</span>
                </p>
                <p>
                  行李:
                  <span>
                    ￥{{ticket.luggage}}x{{PassengerArr.length}}
                  </span>
                </p>
                <p>
                  燃油税:
                  <span>
                    ￥{{ticket.tax}}x{{PassengerArr.length}}
                  </span>
                </p>
              </div>
            </div>
            <!-- back -->
            <div class="back">
              <span>返程</span>
              <div class="go_price">
                <p>
                  人数:￥{{backFlight.price}}x{{PassengerArr.length}}
                </p>
                <p>行李:￥{{ticket.luggage}}x{{PassengerArr.length}}</p>
                <p>燃油税:￥{{ticket.tax}}x{{PassengerArr.length}}</p>
              </div>
            </div>
          </div>
          <div class="price">￥{{(goFlight.price + seatClass +backFlight.price + ticket.luggage + ticket.tax) * PassengerArr.length}}</div>
          <div style="text-align:right;color:red;font-size:5px;">最终价格,请到结算页面查看。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Passenger from '@/components/Reserve/Passenger.vue'
import { flightIdQuery } from '@/api/query'
import { ticketPrice, orderTicket } from '@/api/ticket'
import { mapState, mapMutations } from 'vuex'
import { getOrder } from '@/api/order'
export default {
  components: {
    Passenger
  },
  data () {
    return {
      goData: {
        flightId: '',
        flightDate: ''
      },
      backData: {
        flightId: '',
        flightDate: ''
      },
      // 去程航班数据
      goFlight: [],
      // 返程航班数据
      backFlight: [],
      description1: '',
      // 乘客组件数量
      PassengerArr: [
        {
          name: 'Passenger'
        }
      ],
      // 添加乘客状态
      linkDisabled: false,
      path: {
        depart: '',
        arrive: '',
        date: ''
      },
      ticket: [],
      seatRadio: '经济舱',
      seatClass: 0,
      flightSeat: 3,
      btnLoading: false,
      commitFlag: false
    }
  },
  methods: {
    ...mapMutations(['updatePassengerInfo', 'savePassengereInfo', 'clearPassengereInfo']),
    // 查询航班数据
    async queryFlightData () {
      // 获取路径参数
      this.goData.flightId = this.$route.query.goflightid
      this.goData.flightDate = this.$route.query.goflightdate
      this.backData.flightId = this.$route.query.backflightid
      this.backData.flightDate = this.$route.query.backflightDate
      // 发起请求
      const { data: res } = await flightIdQuery(this.goData)
      const { data: result } = await flightIdQuery(this.backData)
      if (res.resultCode !== 200 || result.resultCode !== 200) {
        return this.$message.error('获取数据失败,请刷新!')
      }
      console.log(res)
      this.goFlight = res.data
      this.backFlight = result.data
      console.log(result)
      this.description1 = '出行提醒: ' + `抵达${this.goFlight.arriveCityName}提醒· ` + ` ${this.goFlight.departureCityName}出港提醒`
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
    // 提交乘客信息
    async submitPassenger () {
      if (this.commitFlag === true) return
      const verify = this.$refs.passengerRef.every(item => {
        return item.flag === true
      })
      if (verify !== true) return this.$message.info('乘机人信息填写不完整!')
      // 获取动态组件里的值
      this.$refs.passengerRef.forEach(item => {
        this.savePassengereInfo(item.passengerForm)
      })
      this.updatePassengerInfo(this.flightSeat)
      const passengerObj = {
        userId: '1',
        orderFlightDto: [
          {
            departDate: this.goData.flightDate,
            flightId: this.goData.flightId,
            // 飞机票基础价格
            ticketSalePrice: this.goFlight.price,
            // 燃油税
            taxFee: this.ticket.tax,
            dayDiscount: this.ticket.todayPrice,
            seatPrice: this.seatClass,
            ticketTypePrice: 0,
            // 行李费
            luggagePrice: this.ticket.luggage
          },
          {
            departDate: this.backData.flightDate,
            flightId: this.backData.flightId,
            // 飞机票基础价格
            ticketSalePrice: this.backFlight.price,
            // 燃油税
            taxFee: this.ticket.tax,
            dayDiscount: this.ticket.todayPrice,
            seatPrice: this.seatClass,
            ticketTypePrice: 0,
            // 行李费
            luggagePrice: this.ticket.luggage
          }
        ],
        passengerDto: this.passengerInfo,
        tripType: 1
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
            return this.$router.replace('/reserve/gbservice')
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
      if (res.resultCode === 500) {
        this.$message.error('已没有剩余票数,请重新选择航班。')
        return this.$router.push('/reserve')
      }
    },
    // 获取票价规则
    async getTicket () {
      const { data: res } = await ticketPrice()
      this.ticket = res.data
      this.seatClass = this.ticket.economyClass
    }
  },
  created () {
    this.queryFlightData()
    this.path = JSON.parse(localStorage.getItem('goBackPath'))
  },
  mounted () {
    this.getTicket()
  },
  computed: {
    ...mapState(['passengerInfo'])
  },
  watch: {
    seatRadio (newVal) {
      if (newVal === '头等舱') {
        this.flightSeat = 1
        this.seatClass = this.ticket.firstClass
      } else if (newVal === '商务舱') {
        this.flightSeat = 2
        this.seatClass = this.ticket.businessClass
      } else if (newVal === '经济舱') {
        this.flightSeat = 3
        this.seatClass = this.ticket.economyClass
      }
    }
  }
}
</script>

<style lang="less" scoped>
.gb_book_container {
  width: 100%;
  height: 100%;
  .el-steps {
    margin-top: 30px;
  }
  .gb_book_info {
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
      .right-button {
        width: 100%;
        .el-button {
          width: 100%;
          margin-top: 50px;
        }
      }
    }
    .right {
      width: 30%;
      height: 60%;
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
        .go_box {
          border-bottom: 1px dashed #e0e5e7;
          .city {
            text-align: center;
            .basic-tag {
              display: inline-block;
              font-size: 12px;
              height: 16px;
              line-height: 16px;
              color: #fff;
              background: #223344;
              border-radius: 2px;
              padding: 0 4px 0 5px;
              vertical-align: middle;
              font-weight: 300;
              margin-right: 8px;
            }
            .font {
              font-weight: 700;
              font-size: 16px;
              vertical-align: middle;
            }
            .time {
              padding-right: 8px;
            }
          }
          .flight {
            margin-top: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #849bab;
            font-size: 10px;
            img {
              width: 20px;
              height: 20px;
              margin-right: 10px;
            }
          }
          .go_time {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            .depart {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 10px;
              .depart_time {
                font-size: 24px;
                font-weight: 500;
              }
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
        .price {
          text-align: right;
          color: #ff7d13;
          font-size: 35px;
          font-weight: 700;
        }
        .price_description {
          .go {
            border-bottom: 1px dashed #d6dde2;
            vertical-align: middle;
            .go_price {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            p {
              margin-left: 10px;
              color: #999;
            }
          }
          .back {
            border-bottom: 1px dashed #d6dde2;
            vertical-align: middle;
            .go_price {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            p {
              margin-left: 10px;
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>
