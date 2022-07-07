<template>
  <div class="flight-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>查询航班</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 背景图 -->
    <div class="bgImg-box"></div>
    <!-- 搜索区域 -->
    <el-card>
      <!-- 单选按钮区域 -->
      <div>
        <el-radio v-model="radio" label="1" @click.native="isShowCity = false">搜航班号</el-radio>
        <el-radio v-model="radio" label="2">搜起降地</el-radio>
        <el-radio v-model="radio" label="3">价格区间</el-radio>
      </div>
      <!-- 搜索航班号表单区域 -->
      <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules" v-show="radio === '1'">
        <el-row :gutter="35">
          <!-- 航班号 -->
          <el-col :span="15">
            <el-form-item prop="flightNumber">
              <el-input v-model="queryForm.flightNumber" placeholder="请填写航班号,如MU1234" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 时间选择 -->
          <el-col :span="7">
            <el-form-item prop="time">
              <el-date-picker v-model="queryForm.time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 搜索起降地表单区域 -->
      <el-form ref="takeOffRef" :model="searchTakeOffForm" :rules="searchTakeOffFormRules" v-show="radio === '2'">
        <div class="takeOffDiv">
          <el-form-item prop="departcureCity" label="出发城市:">
            <City @transfer="getDepartucreCity"></City>
          </el-form-item>
          <el-form-item prop="arriveCity" label="到达城市:">
            <City @transfer="getArriveCity"></City>
          </el-form-item>
          <el-form-item prop="time" label="出行日期:">
            <el-date-picker v-model="searchTakeOffForm.time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <!-- 价格区间 -->
      <el-form ref="priceFormRef" :model="priceForm" :rules="priceFormRules" v-show="radio === '3'">
        <div class="price_city">
          <el-form-item class="left" prop="departCityName" label="出发城市:">
            <City @transfer="getDepartucreCityName"></City>
          </el-form-item>
          <el-form-item class="right" prop="departCityName" label="目的城市:">
            <City @transfer="getArriveCityName"></City>
          </el-form-item>
        </div>
        <div class="price_city">
          <el-form-item class="left" label="最低价格:" style="margin-left:10px;">
            <el-input type="number" style="width:200px;" v-model="priceForm.originMoney" clearable></el-input>
          </el-form-item>
          <el-form-item class="right" label="最高价格:" style="margin-left:10px;">
            <el-input type="number" style="width:200px;" v-model="priceForm.desMoney" clearable></el-input>
          </el-form-item>
        </div>
        <el-form-item label="出行日期:" prop="date">
          <el-date-picker style="width:200px;" v-model="priceForm.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 历史搜索记录 -->
      <div class="tagSearchHistory">
        <el-tag @click="tagSearch(item)" closable v-for="(item,index) in tags" :key="index" @close="handleTagClose(index)">
          {{item}}
        </el-tag>
      </div>
      <!-- 搜索按钮 -->
      <el-row justify="center" type="flex" class="btn">
        <el-button type="success" round icon="el-icon-search" @click.native="search">搜索</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import { flightNoQuery, flightQuery, flightPriceQuery } from '@/api/query'
import { mapMutations } from 'vuex'
import City from '@/components/city/City.vue'
export default {
  name: 'Flight',
  components: {
    City
  },
  data () {
    return {
      // 单选钮
      radio: '1',
      // 搜索航班号的表单
      queryForm: {
        // 航班号
        flightNumber: '',
        time: ''
      },
      // 搜索起降地的表单
      searchTakeOffForm: {
        departcureCity: '',
        arriveCity: '',
        time: ''
      },
      // 价格区间的表单
      priceForm: {
        departCityName: '',
        arriveCityName: '',
        originMoney: '',
        desMoney: '',
        date: ''
      },
      // 搜索历史标签
      tags: [],
      // 匹配数字正则
      numReg: /[0-9]+/,
      // 选择的时间范围
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 搜索航班号表单验证规则
      queryFormRules: {
        flightNumber: [
          { required: true, message: '请填写航班号', trigger: 'blur' },
          { min: 6, max: 6, message: '请填写正确的航班号', trigger: 'blur' }
        ],
        time: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      searchTakeOffFormRules: {
        departcureCity: [{ required: true, message: '请填写出发城市', trigger: ['blur', 'change'] }],
        arriveCity: [{ required: true, message: '请填写到达城市', trigger: ['blur', 'change'] }],
        time: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      priceFormRules: {
        departCityName: [{ required: true, message: '请填写出发城市', trigger: ['blur', 'change'] }],
        arriveCityName: [{ required: true, message: '请填写到达城市', trigger: ['blur', 'change'] }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      }
    }
  },
  created () {
    const now = moment().format('YYYY-MM-DD')
    this.queryForm.time = now
    this.searchTakeOffForm.time = now
    if (window.localStorage.getItem('flightTags')) {
      this.tags = JSON.parse(window.localStorage.getItem('flightTags'))
    }
  },
  methods: {
    ...mapMutations(['saveFlightNoData']),
    async search () {
      // 航班号搜索
      if (this.radio === '1') {
        this.$refs.queryFormRef.validate(async valid => {
          if (!valid) return this.$message.error('请先填写航班号!')
          const { data: res } = await flightNoQuery(this.queryForm.flightNumber, this.queryForm.time)
          console.log(res)
          // 保存在vuex中
          this.saveFlightNoData(res)
          // 保存在sessionStorage中
          sessionStorage.setItem('flightNoData', JSON.stringify(res))
          sessionStorage.setItem('flightRadio', JSON.stringify(this.radio))
          // 将航班号保存
          this.saveTagHistory(this.queryForm.flightNumber)
          this.$router.push('/query/flightNo')
        })
      } else if (this.radio === '2') {
        // 起降地搜索
        this.$refs.takeOffRef.validate(async valid => {
          if (!valid) return this.$message.error('请先填完对应的信息!')
          const { data: res } = await flightQuery(this.searchTakeOffForm.departcureCity, this.searchTakeOffForm.arriveCity, this.searchTakeOffForm.time)
          sessionStorage.setItem('flightData', JSON.stringify(res))
          sessionStorage.setItem('flightRadio', JSON.stringify(this.radio))
          this.saveTagHistory(this.searchTakeOffForm.departcureCity + '-' + this.searchTakeOffForm.arriveCity)
          this.$router.push('/query/flightNo')
        })
      } else {
        this.$refs.priceFormRef.validate(async valid => {
          if (!valid) return this.$message.warning('请先填完对应的信息!')
          if (this.priceForm.originMoney !== '' && this.priceForm.desMoney !== '') {
            const { data: res } = await flightPriceQuery(this.priceForm)
            console.log(1)
            sessionStorage.setItem('flightData', JSON.stringify(res))
            sessionStorage.setItem('flightRadio', JSON.stringify(this.radio))
            this.$router.push('/query/flightNo')
          } else {
            const { data: res } = await flightQuery(this.priceForm.departCityName, this.priceForm.arriveCityName, this.priceForm.date)
            console.log(res)
            sessionStorage.setItem('flightData', JSON.stringify(res))
            sessionStorage.setItem('flightRadio', JSON.stringify(this.radio))
            this.$router.push('/query/flightNo')
          }
        })
      }
    },
    // 搜索航班号历史记录保存
    saveTagHistory (tag) {
      // 从开始位置插入
      this.tags.unshift(tag)
      // 去重
      this.tags = [...new Set(this.tags)]
      // 如果长度大于6开始移除最后一位
      if (this.tags.length > 6) {
        this.tags.splice(this.tags.length - 1, 1)
      }
      // 搜索过的航班号 存储到本地
      window.localStorage.setItem('flightTags', JSON.stringify(this.tags))
    },
    // 处理tag关闭事件
    handleTagClose (index) {
      this.tags.splice(index, 1)
      window.localStorage.setItem('flightTags', JSON.stringify(this.tags))
    },
    // tag搜索
    async tagSearch (item) {
      if (this.numReg.test(item)) {
        // 航班号
        if (!this.queryForm.time) {
          return this.$message.error('请先选择日期')
        }
        const { data: res } = await flightNoQuery(item, this.queryForm.time)
        // 保存在vuex中
        this.saveFlightNoData(res)
        // 保存在sessionStorage中
        sessionStorage.setItem('flightNoData', JSON.stringify(res))
        sessionStorage.setItem('flightRadio', JSON.stringify('1'))
      } else {
        // 拆分成数组
        const arr = item.split('-')
        // 起降地
        if (!this.searchTakeOffForm.time) {
          return this.$message.error('请先选择日期')
        }
        const { data: res } = await flightQuery(arr[0], arr[1], this.searchTakeOffForm.time)
        sessionStorage.setItem('flightData', JSON.stringify(res))
        sessionStorage.setItem('flightRadio', JSON.stringify('2'))
      }
      this.$router.push('/query/flightNo')
    },
    // 子组件赋值给父组件
    getDepartucreCity (val) {
      this.searchTakeOffForm.departcureCity = val
    },
    getArriveCity (val) {
      this.searchTakeOffForm.arriveCity = val
    },
    getDepartucreCityName (val) {
      this.priceForm.departCityName = val
    },
    getArriveCityName (val) {
      this.priceForm.arriveCityName = val
    }
  }
}
</script>

<style lang="less" scoped>
.flight-container {
  width: 100%;
  height: 100%;
  .bgImg-box {
    width: 100%;
    height: 250px;
    background: url('@/assets/images/new-banner.png');
    background-size: 100% 100%;
    margin-top: 15px;
  }
  .el-card {
    width: 800px;
    position: relative;
    margin: 0 auto;
    //去除hidden属性
    overflow: unset;
    margin-top: -50px;
    .el-form {
      margin-top: 40px;
    }
  }
  .btn {
    margin-top: 50px;
  }
  .changeAdress {
    position: absolute;
    top: 3px;
    left: 265px;
    cursor: pointer;
  }
  .tagSearchHistory {
    .el-tag {
      margin-left: 15px;
      cursor: pointer;
    }
  }
  .takeOffDiv {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .price_city {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      width: 50%;
    }
    .right {
      width: 50%;
    }
  }
}
</style>
