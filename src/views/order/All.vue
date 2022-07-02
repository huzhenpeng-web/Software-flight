<template>
  <div class="order_all_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的订单</el-breadcrumb-item>
      <el-breadcrumb-item>全部订单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert center style="margin-top:15px;" type="warning" title="航班起飞之前，退票收取票面价（不含税）20%的手续费。航班起飞之后，退票收取票面价（不含税）30%的手续费。"></el-alert>
    <div class="order">
      <el-card>
        <el-table v-loading="loading" style="width:100%;" :data="orderData" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border stripe max-height="520" :highlight-current-row="true">
          <el-table-column label="订单号" prop="id">
          </el-table-column>
          <el-table-column label="预订日期">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.bookingTime | dateSplice}}</span>
            </template>
          </el-table-column>
          <el-table-column label="出发地">
            <template slot-scope="scope">
              <span>{{scope.row.flightJourneys[0].departureCityName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="降落地">
            <template slot-scope="scope">
              <span>{{scope.row.flightJourneys[0].arriveCityName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.orderStatus === 0" type="warning">待支付</el-tag>
              <el-tag v-if="scope.row.orderStatus === 1" type="success">支付成功</el-tag>
              <el-tag v-if="scope.row.orderStatus === 2" type="error">已取消</el-tag>
              <el-tag v-if="scope.row.orderStatus === 3" type="info">已退单</el-tag>
              <el-tag v-if="scope.row.orderStatus === 4" type="primary">已改单</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="handle">
                <el-button icon="el-icon-mobile-phone" @click="checkout(scope.row)" type="warning" size="small" v-if="scope.row.orderStatus === 0">去支付</el-button>
                <el-button icon="el-icon-close" type="danger" @click="returnOrderTicket(scope.row.id)" size="small" v-if="scope.row.orderStatus === 1">退款</el-button>
                <el-button icon="el-icon-close" type="danger" @click="returnOrderTicket(scope.row.id)" size="small" v-if="scope.row.orderStatus === 4">退款</el-button>
                <el-tooltip class="item" effect="dark" content="查看订单机票" placement="top">
                  <svg class="icon" aria-hidden="true" @click="showTicket(scope.row)">
                    <use xlink:href="#icon-feijipiao"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 4" class="item" effect="dark" content="修改订单" placement="top">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="editSeat(scope.row)">修改舱位</el-dropdown-item>
                      <el-dropdown-item @click.native="editDate(scope.row)">修改日期</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="查看详情" width="100%" type="expand">
            <template slot-scope="scope">
              <el-descriptions :column="2" style="margin-left:50px;">
                <template slot="title">
                  <span v-if="scope.row.tripType === 0">单程</span>
                  <span v-if="scope.row.tripType === 1">往返</span>
                  <span style="margin-left:15px;">(乘客信息按顺序对应)</span>
                </template>
                <el-descriptions-item label="乘客">
                  <span v-for="(item,index) in scope.row.passengers" :key="index">{{item.name}};</span>
                </el-descriptions-item>
                <el-descriptions-item label="联系方式">
                  <span v-for="(item,index) in scope.row.passengers" :key="index">{{item.phoneNo}};</span>
                </el-descriptions-item>
                <el-descriptions-item label="身份证" span="2">
                  <span v-for="(item,index) in scope.row.passengers" :key="index">{{item.certificateNumber}};</span>
                </el-descriptions-item>
                <el-descriptions-item label="第一程" span="1">
                  <template>
                    <el-timeline>
                      <el-timeline-item>
                        <div>
                          {{scope.row.flightJourneys[0].departureCityName}}
                          {{scope.row.flightJourneys[0].departTime | timeFormat}}
                          <el-tag>{{scope.row.flightJourneys[0].airlineCompanyName}}</el-tag>
                          <el-tag>{{scope.row.flightJourneys[0].flightNo}}</el-tag>
                        </div>
                        <div>{{scope.row.flightJourneys[0].departPortName}}</div>
                      </el-timeline-item>
                      <el-timeline-item>
                        <div>{{scope.row.flightJourneys[0].arriveCityName}} {{scope.row.flightJourneys[0].arriveTime | timeFormat}}</div>
                        <div>{{scope.row.flightJourneys[0].arrivePortName}}</div>
                      </el-timeline-item>
                    </el-timeline>
                  </template>
                </el-descriptions-item>
                <el-descriptions-item label="第二程" span="1" v-if="scope.row.tripType === 1">
                  <template>
                    <el-timeline>
                      <el-timeline-item>
                        <div>
                          {{scope.row.flightJourneys[1].departureCityName}}
                          {{scope.row.flightJourneys[1].departTime | timeFormat}}
                          <el-tag>{{scope.row.flightJourneys[1].airlineCompanyName}}</el-tag>
                          <el-tag>{{scope.row.flightJourneys[1].flightNo}}</el-tag>
                        </div>
                        <div>{{scope.row.flightJourneys[1].departPortName}}</div>
                      </el-timeline-item>
                      <el-timeline-item>
                        <div>{{scope.row.flightJourneys[1].arriveCityName}} {{scope.row.flightJourneys[0].arriveTime | timeFormat}}</div>
                        <div>{{scope.row.flightJourneys[1].arrivePortName}}</div>
                      </el-timeline-item>
                    </el-timeline>
                  </template>
                </el-descriptions-item>
                <el-descriptions-item label="座位号(婴儿无座位)" v-if="scope.row.tripType === 0">
                  <template>
                    <span v-for="(item,index) in scope.row.flightJourneys" :key="index">
                      {{item.seat}}
                    </span>
                  </template>
                </el-descriptions-item>
                <el-descriptions-item label="座位号(对应往返;婴儿无座位)" v-if="scope.row.tripType === 1">
                  <template>
                    <span v-for="(item,index) in scope.row.flightJourneys" :key="index">
                      {{item.seat}}
                    </span>
                  </template>
                </el-descriptions-item>
                <el-descriptions-item label="总价格">
                  <span style="color:orange;">￥{{scope.row.totalPrice}}</span>
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 结账对话框 -->
    <el-dialog ref="checkOutDialogRef" center title="付款" :visible.sync="checkoutVisible" width="30%" @close="closeCheckOutDialog">
      <div class="checkoutDialog">
        <div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
        <div class="description">
          <div class="price">￥{{checkoutInfo.totalPrice}}</div>
          <el-button type="primary" @click="checkPay">支付已完成</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog center title="电子机票展示" :visible.sync="flightTicketVisible" width="70%">
      <el-scrollbar style="height:450px;">
        <div class="container" v-for="(item,index) in tickets" :key="index">
          <el-card>
            <!-- 上 -->
            <div class="top">
              <!-- 左 -->
              <div class="left">{{item.departPortName}}欢迎您</div>
              <!-- 右 -->
              <div class="right">登机牌</div>
            </div>
            <!-- 下 -->
            <div class="bottom">
              <!-- 左 -->
              <div class="left">
                <div class="left_t">
                  <!-- 第一列 -->
                  <ul class="left_one">
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>航班</span>
                          <span>Flight</span>
                        </div>
                        <div class="flight_num">{{item.flightNo}}</div>
                      </div>
                    </li>
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>日期</span>
                          <span>Date</span>
                        </div>
                        <div class="flight_num">{{item.departDate}}</div>
                      </div>
                    </li>
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>姓名</span>
                          <span>Name</span>
                        </div>
                        <div class="flight_num">{{item.passengerVo.name}}</div>
                      </div>
                    </li>
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>身份证</span>
                          <span>ID</span>
                        </div>
                        <div class="flight_num">{{item.passengerVo.certificateNumber}}</div>
                      </div>
                    </li>
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>目的站</span>
                          <span>Destination</span>
                        </div>
                        <div class="flight_num">{{item.arriveCityName}}</div>
                      </div>
                    </li>
                  </ul>
                  <!-- 第二列 -->
                  <ul class="left_one">
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>座位</span>
                          <span>Seat</span>
                        </div>
                        <div class="flight_num">{{item.seat}}</div>
                      </div>
                    </li>
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>登机时间</span>
                          <span>Borading time</span>
                        </div>
                        <div class="flight_num">{{item.departTime | timeFormat}}</div>
                      </div>
                    </li>
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>始发站</span>
                          <span>Origin</span>
                        </div>
                        <div class="flight_num">{{item.departureCityName}}</div>
                      </div>
                    </li>
                    <li>
                      <div class="one">
                        <div class="flight_no">
                          <span>价格</span>
                          <span>Price</span>
                        </div>
                        <div class="flight_num">￥{{item.price}}</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="left_b">
                  <div class="notice">
                    <span>重要提示</span>
                    <span>NOTICE</span>
                  </div>
                  <div class="text">航班起飞前15分钟停止登机，请留意登机口临时变更信息</div>
                </div>
              </div>
              <!-- 右 -->
              <div class="right">
                <ul>
                  <li>
                    <div class="one">
                      <div class="flight_no">
                        <span>航班</span>
                        <span>Flight</span>
                      </div>
                      <div class="flight_num">{{item.flightNo}}</div>
                    </div>
                  </li>
                  <li>
                    <div class="one">
                      <div class="flight_no">
                        <span>日期</span>
                        <span>Date</span>
                      </div>
                      <div class="flight_num">{{item.departDate}}</div>
                    </div>
                  </li>
                  <li>
                    <div class="one">
                      <div class="flight_no">
                        <span>座位</span>
                        <span>Seat</span>
                      </div>
                      <div class="flight_num" v-if="item.seat !== null">{{item.seat}}</div>
                      <div class="flight_num" v-if="item.seat === null">婴儿(无座)</div>
                    </div>
                  </li>
                  <li>
                    <div class="one">
                      <div class="flight_no">
                        <span>登机口</span>
                        <span>Borading No</span>
                      </div>
                      <div class="flight_num">{{item.departTerminal}}</div>
                    </div>
                  </li>
                  <li>
                    <div class="one">
                      <div class="flight_no">
                        <span>舱位</span>
                        <span>Class</span>
                      </div>
                      <div class="flight_num" v-if="item.seatType === 1">头等舱</div>
                      <div class="flight_num" v-if="item.seatType === 2">商务舱</div>
                      <div class="flight_num" v-if="item.seatType === 3">经济舱</div>
                      <div class="flight_num" v-if="item.seatType === null">经济舱</div>
                    </div>
                  </li>
                </ul>
                <div class="tip">登记闸口于起飞前15分钟关闭</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { allOrder, checkOrder } from '@/api/order'
import { returnTicket } from '@/api/ticket'
import QRCode from 'qrcodejs2'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      orderData: [],
      // 付款对话框
      checkoutVisible: false,
      // 机票展示状态
      flightTicketVisible: false,
      tickets: [],
      // 订单结账对象
      checkoutInfo: {},
      url: '',
      qrcode: {},
      loading: true
    }
  },
  methods: {
    ...mapMutations(['saveEditOrderInfo']),
    // 获取所有订单信息
    async getAllOrder () {
      const { data: res } = await allOrder()
      this.orderData = res.data
      this.loading = false
    },
    // 展示机票
    showTicket (tickets) {
      this.tickets = tickets.flightJourneys
      this.flightTicketVisible = true
    },
    // 结账
    checkout (info) {
      this.checkoutInfo = info
      this.url = 'http://192.168.31.50:80/order/pay/' + info.id
      this.creatQrCode()
      this.checkoutVisible = true
    },
    // 生成二维码
    creatQrCode () {
      setTimeout(() => {
        const qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text: this.url, // 需要转换为二维码的内容
          width: 100,
          height: 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
        this.qrcode = qrcode
      }, 0)
    },
    // 关闭结账对话框
    async closeCheckOutDialog () {
      const { data: res } = await checkOrder(this.checkoutInfo.id)
      if (res.resultCode === 200) {
        this.$message.success('支付成功')
      } else if (res.resultCode === 500) {
        this.$message.info('未支付')
      }
      this.getAllOrder()
      this.checkoutVisible = false
      document.getElementById('qrcode').innerHTML = ''
    },
    // 检查是否支付成功
    checkPay () {
      this.checkoutVisible = false
    },
    // 退票
    returnOrderTicket (id) {
      this.$confirm('确认是否要退款', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await returnTicket(id)
          console.log(res)
          // 退款成功
          if (res.resultCode === 200) {
            // 退款成功 重新获取订单
            this.$message.success('退款成功')
            this.getAllOrder()
          } else if (res.resultCode === 500) {
            this.$message.error('当前状态无法退款')
          }
        })
        .catch((e) => {
          if (e === 'cancel') {
            this.$message.info('取消退款')
          } else {
            this.$message.error('网络请求失败')
          }
        })
    },
    // 修改座位
    editSeat (orderInfo) {
      this.saveEditOrderInfo(orderInfo)
      this.$router.push('/order/editseat')
    },
    // 修改日期
    editDate (orderInfo) {
      this.saveEditOrderInfo(orderInfo)
      this.$router.push('/order/editdate')
    }
  },
  created () {
    this.getAllOrder()
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.order_all_container {
  width: 100%;
  height: 100%;
  .order {
    margin-top: 30px;
    .el-card {
      margin-top: 30px;
      .handle {
        display: flex;
        align-items: center;
        justify-content: left;
        .icon {
          width: 30px;
          height: 30px;
          margin-left: 15px;
          cursor: pointer;
        }
      }
    }
    .bottom {
      margin-top: 20px;
      text-align: right;
    }
  }
  ::v-deep .el-dialog {
    height: 500px;
  }
  .container {
    margin-top: 20px;
    .el-card {
      display: flex;
      flex-direction: column;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgb(255, 153, 0);
        height: 50px;
        color: #fff;
        font-weight: 700;
        font-size: 25px;
        letter-spacing: 4px;
        .left {
          text-align: center;
          width: 75%;
          border-right: 1px dashed #fff;
        }
        .right {
          text-align: center;
          width: 25%;
        }
      }
      .bottom {
        display: flex;
        .left {
          width: 75%;
          display: flex;
          flex-direction: column;
          .left_t {
            width: 100%;
            display: flex;
            justify-content: space-between;
            border-right: 1px dashed black;
            .left_one {
              width: 50%;
              list-style: none;
              .one {
                margin-top: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                .flight_no {
                  width: 35%;
                  display: flex;
                  text-align: right;
                  flex-direction: column;
                }
                .flight_num {
                  width: 65%;
                  margin-left: 15px;
                }
              }
            }
          }
          .left_b {
            border-right: 1px dashed black;
            display: flex;
            margin-top: 15px;
            .notice {
              width: 15%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background: red;
              color: #fff;
            }
            .text {
              display: flex;
              align-items: center;
              color: red;
              margin-left: 15px;
            }
          }
        }
        .right {
          text-align: center;
          width: 25%;
          ul {
            list-style: none;
            li {
              .one {
                margin-top: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                .flight_no {
                  width: 50%;
                  display: flex;
                  text-align: right;
                  flex-direction: column;
                  margin-right: 15px;
                }
                .flight_num {
                  width: 50%;
                }
              }
            }
          }
          .tip {
            margin-top: 15px;
            color: red;
          }
        }
      }
    }
  }
  .checkoutDialog {
    text-align: center;
    .qrcode {
      display: inline-block;
      img {
        width: 132px;
        height: 132px;
        background-color: #fff; //设置白色背景色
        padding: 6px; // 利用padding的特性，挤出白边
        box-sizing: border-box;
      }
    }
    .description {
      margin-top: 30px;
      .price {
        font-size: 30px;
        font-weight: 700;
      }
      .el-button {
        margin-top: 30px;
      }
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-dropdown-link {
  margin-left: 15px;
  cursor: pointer;
}
</style>
