<template>
  <div>
    <el-form :model="registerForm" ref="registerFormRef" :rules="registerFormRules">
      <el-form-item label="姓 名:" prop="name">
        <el-input class="ipt" v-model="registerForm.name"></el-input>
      </el-form-item>
      <el-form-item label="身份证:" prop="identityCard">
        <el-input class="ipt" v-model="registerForm.identityCard"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input class="ipt" v-model="registerForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密 码: " prop="password">
        <el-input class="ipt" type="password" v-model="registerForm.password"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <span slot="footer" class="dialog-footer">
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="register">确 定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import { registerUser } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
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
      registerForm: {
        name: '',
        identityCard: '',
        phone: '',
        password: ''
      },
      registerFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        identityCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: checkId }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
          { validator: checkPhone }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6到15位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['saveRegisterDialog']),
    reset () {
      this.$refs.registerFormRef.resetFields()
    },
    register () {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return this.$message.warning('请按照要求合法注册')
        const { data: res } = await registerUser(this.registerForm)
        if (res.resultCode === 200) {
          this.saveRegisterDialog(false)
          return this.$message.success('注册成功,可以登录了')
        }
        if (res.resultCode === 500) return this.$message.error('用户已存在')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btn{
  text-align: right;
}
.ipt{
  width: 80%;
}
</style>
