<template>
  <div class="passenger-container">
    <div class="passenger-card">
      <!-- 左侧乘机人数 -->
      <div class="left">
        <div class="passenger-num">
          <slot name="passengerNum-slot"></slot>
          <img :src="img" alt="" v-show="isOpenImg">
          <div style="font-size:15px;text-align:center;">{{person}}</div>
        </div>
      </div>
      <!-- 中间乘客信息 -->
      <div class="medium">
        <el-form :model="passengerForm" ref="passengerFormRef" :rules="passengerFormRules">
          <el-form-item prop="name">
            <el-input v-model="passengerForm.name" placeholder="请与登机证件姓名保持一致" clearable></el-input>
          </el-form-item>
          <el-form-item prop="certificateNumber">
            <el-input @blur="handleGetAge" clearable v-model="passengerForm.certificateNumber" placeholder="登记证件号码"></el-input>
          </el-form-item>
          <el-form-item prop="phoneNo">
            <el-input v-model="passengerForm.phoneNo" placeholder="乘机人手机号码" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 右侧操作 -->
      <div class="right">
        <div>
          <el-tooltip effect="dark" content="乘客姓名需与登机所持证件上的名字一致。" placement="top-start">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wenhao"></use>
            </svg>
          </el-tooltip>
        </div>
        <div>
          <slot name="close-slot"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getAge } from '@/utils/age'
export default {
  name: 'Passenger',
  data () {
    const checkId = (rule, value, cb) => {
      const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (idReg.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的身份证号'))
    }
    const checkPhone = (rule, value, cb) => {
      const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (phoneReg.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      passengerForm: {
        name: '',
        phoneNo: '',
        // 身份证
        certificateNumber: '',
        // 机票等级
        seatType: 3
      },
      // 表单校验规则
      passengerFormRules: {
        name: [{ required: true, message: '请输入乘客姓名', trigger: ['blur', 'change'] }],
        certificateNumber: [{ required: true, message: '请输入身份证号码', trigger: ['blur', 'change'] }, { validator: checkId }],
        phoneNo: [{ required: true, message: '请输入手机号码', trigger: ['blur', 'change'] }, { validator: checkPhone }]
      },
      imgUrl: [
        require('../../assets/images/passenger/adult.png'),
        require('../../assets/images/passenger/children.png'),
        require('../../assets/images/passenger/baby.png')],
      img: '',
      personArr: ['成人', '儿童', '婴儿'],
      person: '',
      isOpenImg: false,
      flag: false
    }
  },
  methods: {
    ...mapMutations(['savePassengereInfo']),
    // 获得年龄
    handleGetAge () {
      const age = getAge(this.passengerForm.certificateNumber)
      if (age >= 18) { // 成人
        this.isOpenImg = true
        this.img = this.imgUrl[0]
        this.person = this.personArr[0]
        // 成人
        this.passengerForm.ticketType = 1
      } else if (age > 3 && age < 18) {
        this.isOpenImg = true
        this.img = this.imgUrl[1]
        this.person = this.personArr[1]
        // 儿童
        this.passengerForm.ticketType = 2
      } else if (age > 0 && age <= 3) {
        this.isOpenImg = true
        this.img = this.imgUrl[2]
        this.person = this.personArr[2]
        // 婴儿
        this.passengerForm.ticketType = 3
      }
    }
  },
  watch: {
    passengerForm: {
      handler (newVal) {
        if (newVal.name === '' || newVal.certificateNumber === '' || newVal.phoneNo === '') return
        this.$refs.passengerFormRef.validate(val => {
          if (!val || (this.flag === true)) return
          // 通过验证传乘客信息
          this.savePassengereInfo(this.passengerForm)
          this.flag = true
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.passenger-container {
  margin-top:15px;
  .passenger-card {
    width: 95%;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #dddddd;
    display: flex;
    align-items: center;
    .left {
      width: 20%;
      margin: 16px 0 13px;
      border-right: 1px dashed #d6dde2;
      align-self: stretch;
      .passenger-num {
        line-height: 1;
        top: 16px;
        left: 16px;
        width: auto;
        height: auto;
        color: #ccd6e5;
        font-family: D-DIN-Bold, 'Helvetica Neue', Tahoma, Arial, PingFangSC-Regular, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
        font-size: 34px;
        font-weight: bold;
        margin-left: 10px;
        img{
          width: 100%;
          height: 100%;
          -webkit-user-drag: none;
        }
      }
    }
    .medium {
      width: 60%;
      margin-left: 30px;
      ::v-deep .el-input__inner {
        border: 0;
        border-bottom: 1px solid #b4c4d6;
        border-radius: 0;
      }
    }
    .right {
      width: 20%;
      align-self: stretch;
      display: flex;
      justify-content: space-between;
      i {
        color: #2577e3;
        font-size: 12px;
        font-weight: normal;
        cursor: pointer;
      }
    }
  }
}
</style>
