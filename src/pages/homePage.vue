<template>
  <div class="home-container">
    <el-card class="home-card">
   
      <el-select v-model="filterStatus" placeholder="篩選借閱狀態" class="filter-select">
        <el-option label="全部" value=""></el-option>
        <el-option label="可借閱" value="AVAILABLE"></el-option>
        <el-option label="已借閱" value="BORROWED"></el-option>
      </el-select>
      <el-table :data="filteredBooks" style="width: 100%">
        <el-table-column prop="isbn" label="國際標準書號" ></el-table-column>
        <el-table-column prop="storeTime" label="入庫時間" >
          <template v-slot="scope">
            <span>{{ formatDate(scope.row.storeTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="借閱狀態" >
          <template v-slot="scope">
            <span :style="{ color: scope.row.status === 'BORROWED' ? 'red' : 'green' }">
              {{ scope.row.status === 'AVAILABLE' ? '可借閱' : '已借閱' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scope">
            <el-button v-if="scope.row.status === 'AVAILABLE'" type="primary" @click="handleBorrow(scope.row)">借閱</el-button>
            <el-button v-if="scope.row.status === 'BORROWED'" type="danger" @click="handleReturn(scope.row)">還書</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
// @ts-ignore
import Cookies from 'js-cookie';

export default defineComponent({
  data() {
    return {
      username: Cookies.get('username') || '未登入', // 從 cookie 中獲取用戶名
      filterStatus: '',
      books: []
    };
  },
  computed: {
    filteredBooks() {
      if (this.filterStatus) {
        // @ts-ignore
        return this.books.filter(book => book.status === this.filterStatus);
      }
      return this.books;
    }
  },
  created() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get('http://localhost:8080/api/inventories');
        this.books = response.data;
      } catch (error) {
        ElMessage.error('無法獲取書籍資訊，請稍後再試');
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      // @ts-ignore
      return new Date(dateString).toLocaleString('zh-TW', options).replace(/\//g, '-').replace(',', '');
    },
    async getUserId() {
      const phoneNumber = Cookies.get('username');
      if (!phoneNumber) {
        ElMessage.error('無法獲取電話號碼，請重新登入');
        throw new Error('無法獲取電話號碼');
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/users/getUserId?phoneNumber=${phoneNumber}`);
        return response.data;
      } catch (error) {
        ElMessage.error('無法獲取用戶ID，請稍後再試');
        throw error;
      }
    },
    async handleBorrow(book) {
      try {
        const userId = await this.getUserId();
        console.log('User ID:', userId); // 調試用
        await ElMessageBox.confirm(`你確定要借閱《${book.isbn}》嗎？`, '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const response = await axios.post(`http://localhost:8080/api/borrowings/borrow?userId=${userId}&inventoryId=${book.inventoryId}`);
        if (response.status == 200) {
          book.status = 'BORROWED';
          ElMessage({
            type: 'success',
            message: '借閱成功!'
          });
        } else {
          ElMessage.error('借閱失敗，請稍後再試');
        }
      } catch (error) {
        ElMessage.error('借閱失敗，請稍後再試');
      }
    },
    async handleReturn(book) {
      try {
        const userId = await this.getUserId();
        console.log('User ID:', userId); // 調試用
        await ElMessageBox.confirm(`你確定要還書《${book.isbn}》嗎？`, '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const response = await axios.post(`http://localhost:8080/api/borrowings/return?userId=${userId}&inventoryId=${book.inventoryId}`);
        if (response.data.success) {
          book.status = 'AVAILABLE';
          ElMessage({
            type: 'success',
            message: '還書成功!'
          });
        } else {
          ElMessage.error('還書失敗，請稍後再試');
        }
      } catch (error) {
        ElMessage.error('還書失敗，請稍後再試');
      }
    },
    handleLogout() {
      Cookies.remove('user'); // 移除 cookie 中的 user
      Cookies.remove('username'); // 移除 cookie 中的 username
      this.$router.push({ name: 'login' }); // 重定向到登入頁面
    }
  }
});
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.home-card {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.home-title {
  margin: 0;
}

.username {
  margin-left: 10px;
}

.filter-select {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .home-card {
    padding: 10px;
  }

  .home-title {
    font-size: 1.5em;
  }
}
</style>