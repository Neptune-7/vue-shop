<template>
  <div class='login_container'>
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/avatar.jpeg">
      </div>
      <!-- 登录表单 -->
      <el-form label-width="100px" ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class=" login_form">
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input placeholder="请输入账户" v-model="loginForm.username" prefix-icon="iconfont icon-user" formControlName="mail"></el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" formControlName="password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这里是数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这里是表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入账户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    // 点击重置按钮 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      overflow: hidden;
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #aaa;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #eee;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 80px 0 0;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
