<template>
  <!-- 修改订单 -->
  <div class="edit_order_container">
    <el-page-header @back="goBack" content="修改舱位">
    </el-page-header>
    <!-- 主体区域 -->
    <div class="edit-content">
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
            订单类型:
            <span class="m_left" v-if="order.tripType === 0">单程</span>
            <span class="m_left" v-if="order.tripType === 1">往返</span>
          </div>
          <div>
            修改舱位:
            <el-select v-model="seatValue" placeholder="请选择">
              <el-option v-for="(item,index) in seatOptions" :disabled="item.disabled" :key="index" :value="item.id" :label="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="handleChangeSeat">提交</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { changeSeat } from '@/api/ticket'
export default {
  data () {
    return {
      order: {},
      seatValue: '',
      seatOptions: [
        { id: 1, value: '头等舱', disabled: false },
        { id: 2, value: '商务舱', disabled: false },
        { id: 3, value: '经济舱', disabled: false }
      ],
      user: {}
    }
  },
  computed: {
    ...mapState(['editOrderInfo'])
  },
  mounted () {
    this.order = this.editOrderInfo
    this.user = this.editOrderInfo.userVo
    this.decideSeat()
    console.log(this.order)
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    // 判断订单是什么座
    decideSeat () {
      const type = this.order.flightJourneys[0].seatType
      this.seatOptions.forEach(item => {
        if (item.id === type) {
          item.disabled = true
        }
      })
    },
    // 改变座位等级
    async handleChangeSeat () {
      console.log(this.seatValue)
      const { data: res } = await changeSeat(this.order.id, this.seatValue)
      if (res.resultCode === 200) {
        this.$message.success('修改座位成功')
        return this.$router.replace('/order/all')
      } else { // 失败
        this.$message.success('修改座位失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.edit_order_container {
  width: 100%;
  height: 100%;
  .edit-content {
    margin-top: 30px;
    line-height: 30px;
    display: flex;
    justify-content: center;
    .el-card {
      width: 50%;
      .order {
        letter-spacing: 1px;
        .m_left {
          margin-left: 5px;
        }
      }
      .btn {
        text-align: right;
      }
    }
  }
}
</style>
