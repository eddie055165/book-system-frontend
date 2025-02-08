<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">登入</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="電話" prop="phone">
          <el-input v-model="loginForm.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登入</el-button>
        </el-form-item>
        <el-form-item>
          <span>尚未有帳號？</span>
          <el-button type="text" @click="goToRegister">註冊</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      loginForm: {
        phoneNumber: '',
        password: ''
      },
      rules: {
        phoneNumber: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { pattern: /^[0-9]{10}$/, message: '請輸入有效的電話號碼', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '密碼至少8位，且包含字母和數字', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    async handleLogin() {
      // @ts-ignore
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
              phoneNumber: this.loginForm.phoneNumber,
              password: this.loginForm.password
            });
            console.log(response.status == 200);
            if (response.status == 200) {
              alert('登入成功')
              Cookies.set('user', this.loginForm.phoneNumber, { expires: 1 });
              // @ts-ignore
              Cookies.set('username', this.loginForm.phoneNumber, { expires: 1 });
              this.$router.push({ name: 'home' });
            } else {
              // @ts-ignore
              this.$message.error('電話或密碼錯誤');
            }
          } catch (error) {
            if (error.response.data == 'Invalid credentials') {
              // @ts-ignore
              this.$message.error('密碼錯誤');
            } else if (error.response.data == 'User not found') {
              // @ts-ignore
              this.$message.error('電話錯誤');
            } else {
                            // @ts-ignore

              this.$message.error('登入失敗，請稍後再試');
            }
          }
        } else {
          console.log('表單驗證失敗');
          return false;
        }
      });
    },
    goToRegister() {
      this.$router.push({ name: 'register' });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>ㄋ