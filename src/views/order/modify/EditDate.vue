<template>
  <div class="edit_date_container">
    <el-page-header @back="goBack" content="修改日期">
    </el-page-header>
    <div class="alert">
      <el-alert type="warning" :title="rule.changeNote" :closable="false" show-icon></el-alert>
    </div>
    <div class="edit_date_content">
      <el-card>
        <div class="order">
          <div>
            订单ID:
            <span class="m_left">{{order.id}}</span>
          </div>
          <div>
            下单人:
            <span class="m_left">{{user.name}}</span>
          </div>
          <div>
            下单时间:
            <span class="m_left">{{order.bookingTime | dateSplice}}</span>
          </div>
          <div>
            航班出发日期:
            <span class="m_left" v-if="order.flightJourneys">{{order.flightJourneys[0].departDate}}</span>
          </div>
          <div>
            订单类型:
            <span class="m_left" v-if="order.tripType === 0">单程</span>
            <span class="m_left" v-if="order.tripType === 1">往返</span>
          </div>
          <div v-if="order.tripType === 0">
            航班日期:
            <el-date-picker value-format="yyyy-MM-dd" v-model="departDate" type="date" placeholder="选择日期" :picker-options="departPickerOptions">
            </el-date-picker>
          </div>
          <div v-if="order.tripType === 1">
            航班日期:
            <el-date-picker style="width:400px;" value-format="yyyy-MM-dd" v-model="arriveDate" type="daterange" :picker-options="departPickerOptions" range-separator="至" start-placeholder="出发日期" end-placeholder="返程日期">
            </el-date-picker>
          </div>
        </div>
        <div class="submitBtn">
          <el-button type="primary" @click="submitEditDate(order.tripType)">提交</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { changeDate } from '@/api/ticket'
import { queryTicketRule } from '@/api/order'
export default {
  data () {
    return {
      order: {},
      user: {},
      // 出发日期选择范围
      departDate: '',
      arriveDate: [],
      // 出发日期选择范围
      departPickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rule: {}
    }
  },
  methods: {
    saveOrder () {
      this.order = this.editOrderInfo
      console.log(this.order)
      this.user = this.editOrderInfo.userVo
    },
    goBack () {
      this.$router.go(-1)
    },
    // 修改日期
    async submitEditDate (type) {
      // 单程
      if (type === 0) {
        if (this.departDate === '') return this.$message.warning('请填写要修改的日期')
        const data = {
          orderId: this.order.id,
          departureDate: this.departDate,
          arriveDate: null
        }
        const { data: res } = await changeDate(data)
        if (res.resultCode === 200) {
          this.$message.success('修改日期成功,请到订单里查看最新机票')
          this.goBack()
        } else if (res.resultCode === 500) {
          this.$message.warning('抱歉,无法修改日期')
        }
      } else {
        // 往返
        if (this.arriveDate.length !== 2) return this.$message.warning('请将修改日期填写完整')
        const data = {
          orderId: this.order.id,
          departureDate: this.arriveDate[0],
          arriveDate: this.arriveDate[1]
        }
        const { data: res } = await changeDate(data)
        if (res.resultCode === 200) {
          this.$message.success('修改日期成功,请到订单里查看最新机票')
          this.goBack()
        } else if (res.resultCode === 500) {
          this.$message.warning('抱歉,无法修改日期')
        }
      }
    },
    // 获取票价规则
    async getRule () {
      // 查询规则
      const { data: res } = await queryTicketRule(this.order.tripType)
      this.rule = res.data
      console.log(this.rule)
    }
  },
  computed: {
    ...mapState(['editOrderInfo'])
  },
  mounted () {
    this.saveOrder()
    this.getRule()
  }
}
</script>

<style lang="less" scoped>
.edit_date_container {
  width: 100%;
  height: 100%;
  .alert {
    display: flex;
    justify-content: center;
    .el-alert {
      width: 50%;
      margin-top: 30px;
    }
  }
  .edit_date_content {
    margin-top: 30px;
    line-height: 30px;
    display: flex;
    justify-content: center;
    .el-card {
      width: 50%;
      .submitBtn {
        text-align: right;
      }
    }
  }
}
</style>
