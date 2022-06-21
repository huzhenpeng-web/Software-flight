l<template>
  <div class="select-cotainer">
    <el-card class="condition-select">
      <ul ref="ulRef">
        <li>
          <el-select clearable @clear="handleClearCompany" @change="handleChangeCompany" v-model="value1" placeholder="航空公司" style="width:60%;">
            <el-option v-for="(item,index) in flightCompany" :key="index" :label="item.name" :value="item.name">
              <span style="float: left">{{item.name}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">￥{{item.price}}</span>
            </el-option>
          </el-select>
        </li>
        <li>
          <el-select clearable @clear="handleClearCompany" @change="handleChangePort" v-model="value2" placeholder="机场">
            <el-option-group v-for="group in options" :key="group.label" :label="group.label">
              <el-option v-for="(item,index) in group.options" :key="index" :label="item.name" :value="item.name">
              </el-option>
            </el-option-group>
          </el-select>
        </li>
        <li v-for="(item,index) in liArr" :key="index" @click="flightSort(index)" :class="{'active':isActive === index}">{{item}}</li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { removeDuplicates } from '@/utils/remove'
export default {
  data () {
    return {
      // 行程数据
      flight: {},
      // 航班公司
      flightCompany: [],
      // 航空公司选择的值
      value1: '',
      value2: '',
      options: [
        {
          label: '出发机场',
          options: []
        },
        {
          label: '到达机场',
          options: []
        }
      ],
      liArr: ['低价优先', '起飞时间早-晚', '起飞时间晚-早', '价格高-低'],
      isActive: ''
    }
  },
  methods: {
    ...mapMutations(['saveReserveFlight']),
    // 排序
    flightSort (index) {
      this.flight.data.forEach(item => {
        item.time = new Date(item.departDate + ' ' + item.departTime).getTime()
      })
      // 给点击的标签添加样式
      this.isActive = index
      if (index === 0) {
        const up = (a, b) => {
          return a.price - b.price
        }
        this.flight.data.sort(up)
        return this.saveReserveFlight(this.flight)
      } else if (index === 1) {
        const up = (a, b) => {
          return a.time - b.time
        }
        this.flight.data.sort(up)
        return this.saveReserveFlight(this.flight)
      } else if (index === 2) {
        const up = (a, b) => {
          return b.time - a.time
        }
        this.flight.data.sort(up)
        return this.saveReserveFlight(this.flight)
      } else if (index === 3) {
        const up = (a, b) => {
          return b.price - a.price
        }
        this.flight.data.sort(up)
        return this.saveReserveFlight(this.flight)
      }
    },
    // 获取航空公司名称并去重
    getflightCompany () {
      this.flightCompany = this.flight.data.map(item => {
        return {
          name: item.airlineCompanyName,
          price: item.price
        }
      })
      // 去重
      this.flightCompany = removeDuplicates(this.flightCompany)
    },
    // 获取机场并去重
    getFlightPort () {
      // 出发机场
      this.options[0].options = this.flight.data.map(item => {
        return {
          name: item.departPortName
        }
      })
      // 到达机场
      this.options[1].options = this.flight.data.map(item => {
        return {
          name: item.arrivePortName
        }
      })
      // 去重
      this.options[0].options = removeDuplicates(this.options[0].options)
      this.options[1].options = removeDuplicates(this.options[1].options)
    },
    // 航空公司发生变化
    handleChangeCompany (val) {
      this.value2 = ''
      this.flight = JSON.parse(window.sessionStorage.getItem('reserveFlight'))
      this.flight.data = this.flight.data.filter(i => {
        return val === i.airlineCompanyName
      })
      return this.saveReserveFlight(this.flight)
    },
    // 机场发生变化
    handleChangePort (val) {
      this.value1 = ''
      this.flight = JSON.parse(window.sessionStorage.getItem('reserveFlight'))
      this.flight.data = this.flight.data.filter(i => {
        return val === i.departPortName || val === i.arrivePortName
      })
      return this.saveReserveFlight(this.flight)
    },
    // 清除航空公司所选项
    handleClearCompany () {
      this.flight = JSON.parse(window.sessionStorage.getItem('reserveFlight'))
      return this.saveReserveFlight(this.flight)
    }
  },
  computed: {
    ...mapState(['reserveFlight'])
  },
  created () {
    this.flight = this.reserveFlight
    this.getflightCompany()
    this.getFlightPort()
  }
}
</script>

<style lang="less" scoped>
.select-cotainer {
  .condition-select {
    margin-top: 20px;
    border-radius: 8px 8px 0 0;
    ul {
      width: 100%;
      list-style: none;
      display: flex;
      align-items: center;
      li {
        text-align: center;
        cursor: pointer;
        width: 17%;
      }
      li:hover {
        color: #398efe;
      }
    }
  }
  //被激活样式
  .active {
    color: #398efe;
  }
}
</style>
