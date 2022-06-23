<template>
  <div class="reserve-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机票预定</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索盒子 -->
    <div class="reserve-box">
      <el-card>
        <!-- 单选钮 -->
        <div>
          <el-radio-group v-model="radio">
            <el-radio :label="1">单程</el-radio>
            <el-radio :label="2">往返</el-radio>
            <el-radio :label="3">多程</el-radio>
          </el-radio-group>
        </div>
        <!-- 搜索信息 -->
        <el-form :model="reserveForm" :inline="true" ref="reserveFormRef" :rules="reserveFormRules" v-show="radio !==3">
          <div>
            <el-form-item label="出发地:" prop="departcureCity">
              <City @transfer="getDepartucreCity"></City>
            </el-form-item>
            <el-form-item label="目的地:" prop="arriveCity">
              <City @transfer="getArriveCity"></City>
            </el-form-item>
            <el-form-item label="出发日期:" label-position="left" prop="departcureDate">
              <el-date-picker style="width:180px;" v-model="reserveForm.departcureDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择出发日期" :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="返回日期:" label-position="left" prop="backDate" v-if="radio == 2">
              <el-date-picker style="width:180px;" v-model="reserveForm.backDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择返回日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <!-- 多程表单 -->
        <div class="reserveDiv" v-show="radio === 3">
          <el-form :model="moreReserveForm" ref="moreReserveFormRef" :rules="moreReserveFormRules" :inline="true" v-for="(item,index) in moreReserveForm.cityInfo" :key="index">
            <el-form-item label="出发地:" :rules="moreReserveFormRules.departcureCity" :prop="'cityInfo.'+index+'.departcureCity'">
              <City @transfer="getMoreDepartucreCity($event,index)"></City>
            </el-form-item>
            <el-form-item label="目的地:" :rules="moreReserveFormRules.arriveCity" :prop="'cityInfo.'+index+'.arriveCity'">
              <City @transfer="getMoreArriveCity($event,index)"></City>
            </el-form-item>
            <el-form-item label="出发日期:" label-position="left">
              <el-date-picker v-model="moreReserveForm.cityInfo[index].departcureDate" :rules="moreReserveFormRules.departcureDate" :prop="'cityInfo.'+index+'.departcureDate'" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择出发日期" :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
            <div class="iconDiv" @click="removeTrip(index)">
              <i class="el-icon-close" v-if="index > 1"></i>
            </div>
          </el-form>
        </div>
        <el-button icon="el-icon-search" type="warning" @click="search" class="searchBtn">搜索</el-button>
        <!-- 多程添加按钮 -->
        <el-button type="primary" icon="el-icon-plus" v-show="radio == 3" @click="addTrip" :disabled="addTripBtn">再加一程</el-button>
      </el-card>
    </div>
    <!-- 历史记录 -->
    <History class="history" :flightHistory="searchHistory"></History>
  </div>
</template>

<script>
import moment from 'moment'
import { flightQuery } from '@/api/query'
import City from '@/components/city/City.vue'
import History from '@/components/Reserve/History.vue'
import { mapMutations } from 'vuex'
import { removeDuplicates } from '@/utils/remove'
export default {
  name: 'Reserve',
  components: {
    City,
    History
  },
  data () {
    return {
      radio: 1,
      addTripBtn: false,
      // 单程表单
      reserveForm: {
        // 出发城市
        departcureCity: '',
        // 到达城市
        arriveCity: '',
        // 出发时间
        departcureDate: '',
        backDate: ''
      },
      moreReserveForm: {
        // 默认两个
        cityInfo: [
          {
            // 出发城市
            departcureCity: '',
            // 到达城市
            arriveCity: '',
            // 出发时间
            departcureDate: ''
          },
          {
            // 出发城市
            departcureCity: '',
            // 到达城市
            arriveCity: '',
            // 出发时间
            departcureDate: ''
          }
        ]
      },
      // 出发选择的时间范围
      pickerOptions1: {
        // 出行日期
        disabledDate: time => {
          const endTime = this.reserveForm.backDate
          if (endTime) {
            // 如果选择了结束日期 在结束日期之后的都被禁止选择
            return new Date(endTime).getTime() < time.getTime() || time.getTime() < Date.now() - 8.64e7
          }
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '一周后',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      // 返回时间范围
      pickerOptions2: {
        disabledDate: time => {
          const startTime = this.reserveForm.departcureDate
          if (startTime) {
            // 选择了出发日期 出发日期之前的都被禁止
            return time.getTime() < new Date(startTime).getTime() - 1 * 24 * 60 * 60 * 1000
          }
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 单程和往返表单
      reserveFormRules: {
        departcureCity: [{ required: true, message: '请选择出发地', trigger: ['blur', 'change'] }],
        arriveCity: [{ required: true, message: '请选择目的地', trigger: ['blur', 'change'] }],
        departcureDate: [{ required: true, message: '请选择出发时间', trigger: ['blur', 'change'] }],
        backDate: [{ required: true, message: '请选择返回时间', trigger: ['change', 'blur'] }]
      },
      // 多程
      moreReserveFormRules: {
        departcureCity: [{ required: true, message: '请选择出发地', trigger: ['change'] }],
        arriveCity: [{ required: true, message: '请选择目的地', trigger: ['blur', 'change'] }],
        departcureDate: [{ required: true, message: '请选择出发时间', trigger: ['blur', 'change'] }]
      },
      // 历史记录
      searchHistory: []
    }
  },
  mounted () {
    const now = moment().format('YYYY-MM-DD')
    this.reserveForm.departcureDate = now
    // 从本地取出搜索历史 赋值
    if (localStorage.getItem('searchHistory')) {
      this.searchHistory = JSON.parse(localStorage.getItem('searchHistory'))
    }
  },
  methods: {
    ...mapMutations(['saveReserveFlight', 'saveReserveForm']),
    getDepartucreCity (val) {
      this.reserveForm.departcureCity = val
    },
    getArriveCity (val) {
      this.reserveForm.arriveCity = val
    },
    getMoreDepartucreCity (val, index) {
      this.moreReserveForm.cityInfo[index].departcureCity = val
    },
    getMoreArriveCity (val, index) {
      this.moreReserveForm.cityInfo[index].arriveCity = val
    },
    // 搜索
    async search () {
      if (this.radio !== 3) {
        // 单程
        if (this.radio === 1) {
          this.$refs.reserveFormRef.validate(async valid => {
            if (!valid) return this.$message.error('请先填写完整对应的信息!')
            // 保留在sessionStorage中
            window.sessionStorage.setItem('reserveForm', JSON.stringify(this.reserveForm))
            // 查询成功
            this.saveReserveForm(this.reserveForm)
            // 调用历史记录
            this.saveHistory(this.reserveForm)
            this.$router.push(`/reserve/selectFlight?depart=${this.reserveForm.departcureCity}&arrive=${this.reserveForm.arriveCity}&date=${this.reserveForm.departcureDate}`)
          })
        }
        // 往返
        if (this.radio === 2) {
          this.$refs.reserveFormRef.validate(async valid => {
            if (!valid) return this.$message.error('请先填写完整对应的信息!')
            this.saveReserveForm(this.reserveForm)
            this.saveHistory(this.reserveForm)
            this.$router.push(`/reserve/goback?depart=${this.reserveForm.departcureCity}&arrive=${this.reserveForm.arriveCity}&date=${this.reserveForm.departcureDate}`)
          })
        }
      } else {
        let count = 0
        let flag = true
        try {
          this.$refs.moreReserveFormRef.forEach((i, index) => {
            i.validate(async valid => {
              if (!valid) {
                if (flag === true) {
                  flag = false
                  return this.$message.error('请先填写完整对应的信息!')
                }
              }
              // 表单通过验证数量加1
              count++
            })
          })
          // 当count和表单数量相等时发起请求
          if (count === this.$refs.moreReserveFormRef.length) {
            this.$refs.moreReserveFormRef.forEach(async (item, index) => {
              const { data: res } = await flightQuery(this.moreReserveForm.cityInfo[index].departcureCity, this.moreReserveForm.cityInfo[index].arriveCity, this.moreReserveForm.cityInfo[index].departcureDate)
              console.log(res)
              window.sessionStorage.setItem('moreReserveFlight', JSON.stringify(res))
              window.sessionStorage.setItem('moreReserveForm', JSON.stringify(this.moreReserveForm))
              // this.$router.push('/reserve/selectFlight')
            })
          }
        } catch (err) {
          throw new Error(err)
        }
      }
    },
    // 添加行程
    addTrip () {
      const info = {
        departcureCity: '',
        arriveCity: '',
        departcureDate: ''
      }
      this.moreReserveForm.cityInfo.push(info)
    },
    // 移出行程
    removeTrip (index) {
      if (index === 0 || index === 1) return
      this.moreReserveForm.cityInfo.splice(index, 1)
    },
    // 保存历史记录
    saveHistory (history) {
      this.searchHistory.unshift(history)
      // 去重
      this.searchHistory = removeDuplicates(this.searchHistory)
      // 设置数组长度
      if (this.searchHistory.length > 4) {
        this.searchHistory.splice(this.searchHistory.length - 1, 1)
      }
      // 搜索历史 存储到本地
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
    }
  },
  watch: {
    moreReserveForm: {
      handler (newVal) {
        if (newVal.cityInfo.length === 6) {
          this.addTripBtn = true
        } else {
          this.addTripBtn = false
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.reserve-container {
  width: 100%;
  height: 100%;
  .reserve-box {
    position: relative;
    width: 1180px;
    margin: 0 auto;
    margin-top: 30px;
    .el-card {
      overflow: unset;
    }
    .el-radio-group {
      width: 100%;
      text-align: center;
    }
    .el-form {
      margin-top: 50px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    .searchBtn {
      position: relative;
      left: 45%;
      margin-top: 50px;
      border-radius: 28px;
      box-shadow: 0 4px 16px 0 rgb(255 102 0 / 32%);
      width: 176px;
      height: 56px;
    }
    .reserveDiv {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .el-form {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        .iconDiv {
          cursor: pointer;
          position: relative;
          width: 45px;
          height: 45px;
        }
      }
    }
  }
  .history {
    position: relative;
    width: 1180px;
    margin: 0 auto;
    margin-top: 50px;
  }
}
</style>
