<template>
  <!-- 支付页面 -->
  <div class="pay_container">
    <!-- 步骤条 -->
    <el-steps :active="3" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="增值服务"></el-step>
      <el-step description="支付"></el-step>
      <el-step description="完成"></el-step>
    </el-steps>
    <el-card>
      <div class="pay_box">
        <div class="pay_text">
          <div>
            <span>订单金额</span>
            <span class="price">￥{{price}}</span>
          </div>
        </div>
        <!-- 二维码 -->
        <div class="qrcode" ref="qrCodeUrl"></div>
        <div class="button">
          <div class="success">
            <el-button type="warning" @click="goResult">查看支付结果</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getOrder } from '@/api/order.js'
export default {
  data () {
    return {
      url: '',
      price: 0,
      orderId: 0
    }
  },
  methods: {
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
    // 获取订单信息
    async getUserOrder () {
      const { data: res } = await getOrder()
      this.url = 'http://192.168.31.50:9527/order/pay/' + res.data.id
      this.price = res.data.totalPrice
      this.orderId = res.data.id
      this.creatQrCode()
      console.log(res)
    },
    goResult () {
      this.$router.push(`/reserve/result?orderid=${this.orderId}`)
    }
  },
  mounted () {
    this.getUserOrder()
  }
}
</script>

<style lang="less" scoped>
.pay_container {
  width: 100%;
  height: 80%;
  .el-card {
    margin-top: 40px;
    height: 100%;
    .pay_box {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .pay_text{
        .price{
          font-size:32px;
          color: #ff8c18;
          font-style: italic;
        }
      }
      .qrcode {
        margin-top: 30px;
        display: inline-block;
        img {
          width: 132px;
          height: 132px;
          background-color: #fff; //设置白色背景色
          padding: 6px; // 利用padding的特性，挤出白边
          box-sizing: border-box;
        }
      }
      .button{
        display: flex;
        margin-top: 30px;
      }
    }
  }
}
</style>
