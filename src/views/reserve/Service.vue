<template>
  <!-- 增值服务 -->
  <div class="service-container">
    <!-- 步骤条 -->
    <el-steps :active="2" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="锁定机票"></el-step>
      <el-step description="支付"></el-step>
      <el-step description="完成"></el-step>
    </el-steps>
    <div class="service_box">
      <!-- 左 -->
      <div class="left">
        <div>
          <el-alert show-icon :closable="false" :showClose="false" :title="countDown +'分钟内完成支付，即可预订成功。'" type="warning" effect="dark">
          </el-alert>
        </div>
        <!-- 乘客信息 -->
        <div class="passenger_info">
          <el-card v-for="(item,index) in passengers" :key="index">
            <div class="card_div">
              <div class="num">{{index + 1}}</div>
              <div class="title">
                <span v-if="item.type === 1">成人</span>
                <span v-if="item.type === 2">儿童</span>
                <span v-if="item.type === 3">婴儿</span>
              </div>
              <div class="passenger_name">{{item.name}}</div>
              <div class="id_card">
                <span>身份证</span>
                {{item.certificateNumber}}
              </div>
              <!-- 分割线 -->
              <div class="divider"></div>
              <!-- 联系人 -->
              <div class="contact">
                <!-- 左 -->
                <div class="contact_left">
                  <div>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-lianxiren"></use>
                    </svg>
                  </div>
                  <!-- 电话 -->
                  <div class="phone">(+86){{item.phoneNo}}</div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 预订须知 -->
        <div class="reserve_know">
          <div slot="reference">
            <h2>预订须知</h2>
            <el-checkbox style="margin-top:10px;" v-model="checked">我已阅读并同意 购票须知 、机票预订须知 、行李国内运输总条件</el-checkbox>
          </div>
        </div>
        <!-- 支付按钮 -->
        <el-button @click="goPay">去支付</el-button>
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="flight_info">
          <!-- 单程 -->
          <div>
            <div class="one">
              <div class="date">
                <span class="basic-tag">第一程</span>
                <span style="margin-right:15px;">{{flightJourneys.departDate | dateFormat}}</span>
                <span>{{flightJourneys.departureCityName}}</span>
                <i class="el-icon-right"></i>
                <span>{{flightJourneys.arriveCityName}}</span>
              </div>
              <div class="airline">
                <img :src="flightJourneys.airlineImg" alt="">
                <span style="margin-right:15px;">{{flightJourneys.airlineCompanyName}}</span>
                <span>{{flightJourneys.flightNo}}</span>
                <span class="seat" v-if="flightJourneys.seatType === 1">头等舱</span>
                <span class="seat" v-if="flightJourneys.seatType === 2">商务舱</span>
                <span class="seat" v-if="flightJourneys.seatType === 3">经济舱</span>
              </div>
              <div class="time">
                <div class="depart">
                  <div>{{flightJourneys.departTime | timeFormat}}</div>
                  <div>{{flightJourneys.departPortName}}</div>
                </div>
                <div class="timeLine">
                  <i class="el-icon-arrow-right"></i>
                  <div class="timeline"></div>
                </div>
                <div class="arrive">
                  <div>{{flightJourneys.arriveTime | timeFormat}}</div>
                  <div>{{flightJourneys.arrivePortName}}</div>
                </div>
              </div>
            </div>
            <div class="separation-line"></div>
          </div>
          <div class="description-price">
            <div v-if="person.adult.count !==0">
              <span>成人</span>
              <span>￥{{person.adult.price}} x {{person.adult.count}}</span>
            </div>
            <div v-if="person.child.count !==0">
              <span>儿童</span>
              <span>￥{{person.child.price}} x {{person.child.count}}</span>
            </div>
            <div v-if="person.baby.count !==0">
              <span>婴儿</span>
              <span>￥{{person.baby.price}} x {{person.baby.count}}</span>
            </div>
            <div>
              <span>行李</span>
              <span>￥{{priceVos.luggagePrice}} x {{passengers.length}}</span>
            </div>
            <div>
              <span>燃油税</span>
              <span>￥{{priceVos.taxFee}} x {{passengers.length}}</span>
            </div>
            <div>
              <span>每日优惠</span>
              <span>￥{{priceVos.dayDiscount}} x {{passengers.length}}</span>
            </div>
          </div>
          <div class="separation-line"></div>
          <!-- 价格 -->
          <div class="total-price">￥{{orderData.totalPrice}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrder } from '@/api/order.js'
import moment from 'moment'
export default {
  data () {
    return {
      // 单选框
      checked: false,
      orderData: {},
      // 倒计时
      countDown: 0,
      // 没转换过的倒计时
      time: 0,
      timer: null,
      // 乘客信息
      passengers: [],
      // 航程信息
      flightJourneys: [],
      person: {
        adult: {
          count: 0,
          price: 0
        },
        child: {
          count: 0,
          price: 0
        },
        baby: {
          count: 0,
          price: 0
        }
      },
      priceVos: [],
      // 订单id
      orderId: 0
    }
  },
  methods: {
    // 支付
    goPay () {
      if (this.checked === false) return this.$message.warning('请先阅读并勾选协议')
      this.$router.push(`/reserve/pay?orderid=${this.orderId}`)
    },
    // 获取用户订单
    async getUserOrder () {
      const { data: res } = await getOrder()
      // 订单已被销毁
      if (res.data.length === 0) return
      this.orderData = res.data
      this.orderId = res.data.id
      this.handlePerson()
      this.priceVos = this.orderData.priceVos[0]
      this.handlePrice(this.orderData.priceVos)
      // 转换倒计时
      this.passengers = this.orderData.passengers
      this.flightJourneys = this.orderData.flightJourneys[0]
      this.time = this.orderData.remainTime * 1000
      this.countDown = moment.utc(this.orderData.remainTime * 1000).format('mm:ss')
      console.log(res)
    },
    // 定时器
    setTimer () {
      if (this.timer === null) {
        this.timer = setInterval(() => {
          // 空对象返回
          if (JSON.stringify(this.orderData) === '{}') return
          this.time = this.time - 1000
          this.countDown = moment.utc(this.time - 1000).format('mm:ss')
        }, 1000)
      }
    },
    // 处理价格
    handlePrice (arr) {
      arr.forEach(item => {
        if (item.ticketType === 1) {
          this.person.adult.price = item.ticketSalePrice + item.seatPrice + item.ticketTypePrice
        } else if (item.ticketType === 2) {
          this.person.child.price = item.ticketSalePrice + item.seatPrice + item.ticketTypePrice
        } else if (item.ticketType === 3) {
          this.person.baby.price = item.ticketSalePrice + item.seatPrice + item.ticketTypePrice
        }
      })
    },
    // 处理人数
    handlePerson () {
      this.orderData.passengers.forEach(item => {
        if (item.type === 1) {
          this.person.adult.count++
        } else if (item.type === 2) {
          this.person.child.count++
        } else if (item.type === 3) {
          this.person.baby.count++
        }
      })
    },
    // 提示
    alert () {
      this.$alert('15分钟之内未完成支付', '您的订单已被取消,请重新下单!', {
        confirmButtonText: '确定',
        center: true,
        type: 'warning',
        callback: action => {
          this.$router.replace('/reserve')
        }
      })
    }
  },
  mounted () {
    this.getUserOrder()
    // 触发定时器
    this.setTimer()
  },
  destroyed () {
    // 销毁定时器
    clearInterval(this.timer)
    this.timer = null
  },
  watch: {
    time (newVal) {
      if (newVal === 0) {
        this.alert()
        // 销毁定时器
        this.time = 0
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.service-container {
  width: 100%;
  height: 100%;
  .service_box {
    width: 90%;
    height: 80%;
    margin: 0 auto;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .left {
      width: 65%;
      height: 100%;
      .passenger_info {
        width: 100%;
        margin-top: 30px;
        .el-card {
          width: 100%;
          .card_div {
            display: flex;
            align-items: center;
            .num {
              color: #849bab;
              width: 19px;
              height: 19px;
              line-height: 19px;
              text-align: center;
              font-weight: 600;
              background: #eaf0f3;
              font-size: 13px;
            }
            .title {
              margin-left: 15px;
              min-width: 45px;
              color: #849bab;
            }
            .passenger_name {
              min-width: 100px;
              font-weight: 600;
            }
            .id_card {
              min-width: 200px;
              span {
                color: #849bab;
              }
            }
            .divider {
              margin-left: 50px;
              height: 50px;
              width: 0;
              border-right: 1px dashed #c4cad5;
            }
            .contact {
              margin-left: 30px;
              .contact_left {
                display: flex;
                align-items: center;
                .icon {
                  width: 60px;
                  height: 50px;
                }
                .phone {
                  margin-left: 30px;
                  font-size: 13px;
                }
              }
            }
          }
        }
        .el-card:hover {
          background-color: #f2f8fe;
          cursor: pointer;
        }
      }
      .reserve_know {
        margin-top: 50px;
      }
      .el-button {
        margin-top: 50px;
        width: 100%;
        background: #ff7d13;
        border-color: #ff7d13;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
      }
    }
    .right {
      width: 30%;
      .flight_info {
        width: 100%;
        background-color: #f5f8f9;
        .one {
          .date {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }
          .airline {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #849bab;
            font-size: 12px;
            img {
              width: 30px;
              height: 30px;
              margin-right: 15px;
            }
            .seat {
              margin-left: 15px;
            }
          }
          .basic-tag {
            margin-right: 4px;
            padding: 0 4px 0 5px;
            font-family: 'PingFang SC', 'Hiragino Sans GB', 'Lantinghei SC', 'Simsun';
            vertical-align: middle;
            font-weight: 300;
            color: #fff;
            background: #223344;
            display: inline-block;
            font-size: 13px;
            height: 16px;
            line-height: 16px;
            margin-right: 15px;
          }
          .time {
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            .depart,
            .arrive {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin: 10px;
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
        .separation-line {
          margin: 20px 30px;
          border-bottom: 1px dashed #b4c4d6;
        }
        .total-price {
          color: #ff7d13;
          font-size: 35px;
          font-weight: 700;
          text-align: right;
        }
        .description-price {
          display: flex;
          align-items: center;
          flex-direction: column;
          color: #999;
          div {
            width: 80%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
