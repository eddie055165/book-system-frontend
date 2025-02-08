<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">註冊</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
        <el-form-item label="電話" prop="phone">
          <el-input v-model="registerForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用者名稱" prop="username">
          <el-input v-model="registerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="確認密碼" prop="confirmPassword">
          <el-input type="password" v-model="registerForm.confirmPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">註冊</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      registerForm: {
        phone: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        phone: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { pattern: /^[0-9]{10}$/, message: '請輸入有效的電話號碼', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '請輸入使用者名稱', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{3,16}$/, message: '使用者名稱應為3-16位字母、數字或下劃線', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '密碼至少8位，且包含字母和數字', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '請確認密碼', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              // @ts-ignore
              if (value !== this.registerForm.password) {
                callback(new Error('兩次輸入的密碼不一致'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    async handleRegister() {
      // @ts-ignore
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('http://localhost:8080/api/users/register', {
              phoneNumber: this.registerForm.phone,
              username: this.registerForm.username,
              password: this.registerForm.password
            });
            if (response.status == 200) {
              alert('註冊成功');
              this.$router.push({ name: 'login' });
            } else {
              // @ts-ignore
              this.$message.error(response.data.message || '註冊失敗');
            }
          } catch (error) {
            // @ts-ignore
            if (error.response.data == 'Invalid credentials') {
              // @ts-ignore
              this.$message.error('密碼錯誤');
            } else if (error.response.data == 'User not found') {
              // @ts-ignore
              this.$message.error('電話錯誤');
            } 
            else if (error.response.data == 'Phone number already registered') {
              // @ts-ignore
              this.$message.error('此電話號碼已經有人使用');
            }
            else {
                            // @ts-ignore

              this.$message.error('註冊失敗，請稍後再試');
            }
          }
        } else {
          console.log('表單驗證失敗');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.register-card {
  width: 400px;
  padding: 20px;
}

.register-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>