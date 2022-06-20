<template>
  <div class="flight-container">
    <!-- 背景图 -->
    <div class="bgImg-box"></div>
    <!-- 搜索区域 -->
    <el-card>
      <!-- 单选按钮区域 -->
      <div>
        <el-radio v-model="radio" label="1" @click.native="isShowCity = false">搜航班号</el-radio>
        <el-radio v-model="radio" label="2">搜起降地</el-radio>
      </div>
      <!-- 搜索表单区域 -->
      <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
        <el-row :gutter="35">
          <!-- 航班号 -->
          <el-col :span="15" v-show="radio === '1'">
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
      <!-- 搜索按钮 -->
      <el-row justify="center" type="flex" class="btn" @click.native="search">
        <el-button type="success" round icon="el-icon-search">搜索</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import { flightNoQuery } from '@/api/query'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 单选钮
      radio: '1',
      // 安装航班号的表单
      queryForm: {
        // 航班号
        flightNumber: '',
        time: ''
      },
      // 选择的时间范围
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 表单验证规则
      queryFormRules: {
        flightNumber: [
          { required: true, message: '请填写航班号', trigger: 'blur' },
          { min: 6, max: 6, message: '请填写正确的航班号', trigger: 'blur' }
        ],
        time: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      }
    }
  },
  created () {
    const now = moment().format('YYYY-MM-DD')
    this.queryForm.time = now
  },
  methods: {
    ...mapMutations(['saveFlightNoData']),
    async search () {
      if (this.radio === '1') {
        this.$refs.queryFormRef.validate(async valid => {
          if (!valid) return this.$message.error('请先填写航班号!')
          const { data: res } = await flightNoQuery(this.queryForm.flightNumber, this.queryForm.time)
          // 保存在vuex中
          this.saveFlightNoData(res)
          // 保存在sessionStorage中
          sessionStorage.setItem('flightNoData', JSON.stringify(res))
          console.log(res)
          this.$router.push('/query/flightNo')
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  width: 800px;
  position: relative;
  margin: 0 auto;
  margin-top: -50px;
  .el-form {
    margin-top: 40px;
  }
}
.bgImg-box {
  width: 100%;
  height: 250px;
  background: url('@/assets/images/new-banner.png');
  background-size: 100% 100%;
}
.btn {
  margin-top: 20px;
}
.changeAdress {
  position: absolute;
  top: 3px;
  left: 265px;
  cursor: pointer;
}
</style>
