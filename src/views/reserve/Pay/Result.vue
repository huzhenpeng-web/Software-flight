<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="4" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="增值服务"></el-step>
      <el-step description="支付"></el-step>
      <el-step description="完成"></el-step>
    </el-steps>
    <el-result icon="success" v-if="resultcode === 200" title="支付成功" subTitle="请根据提示进行操作">
      <template slot="extra">
        <el-button type="success" size="medium" @click="goReserve">继续下单</el-button>
        <el-button type="primary" size="medium" @click="goHome">返回首页</el-button>
      </template>
    </el-result>
    <el-result icon="error"  v-if="resultcode === 500" title="支付失败" subTitle="请根据提示进行操作">
      <template slot="extra">
        <el-button type="info" size="medium" @click="goCheck">重新支付</el-button>
        <el-button type="primary" size="medium" @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
import { checkOrder } from '@/api/order'
export default {
  data () {
    return {
      resultcode: 0
    }
  },
  methods: {
    async getResult () {
      const { data: res } = await checkOrder(this.$route.query.orderid)
      this.resultcode = res.resultCode
    },
    // 回到首页
    goHome () {
      this.$router.replace('/home')
    },
    // 支付
    goCheck () {
      this.$router.go(-1)
    },
    // 继续下单
    goReserve () {
      this.$router.replace('/reserve')
    }
  },
  mounted () {
    this.getResult()
  }
}
</script>

<style>
</style>
