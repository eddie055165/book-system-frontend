<template>
  <div class="home-container">
    <el-card class="home-card">
      <el-select v-model="filterStatus" placeholder="篩選借閱狀態" class="filter-select">
        <el-option label="全部" value=""></el-option>
        <el-option label="可借閱" value="可借閱"></el-option>
        <el-option label="已借閱" value="已借閱"></el-option>
      </el-select>
      <el-table :data="filteredBooks" style="width: 100%">
        <el-table-column prop="title" label="書名" width="180"></el-table-column>
        <el-table-column prop="isbn" label="國際標準書號" width="180"></el-table-column>
        <el-table-column prop="author" label="作者" width="180"></el-table-column>
        <el-table-column prop="description" label="簡介"></el-table-column>
        <el-table-column prop="status" label="借閱狀態" width="100">
          <template v-slot="scope">
            <span :style="{ color: scope.row.status === '已借閱' ? 'red' : 'green' }">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scope">
            <el-button v-if="scope.row.status === '可借閱'" type="primary" @click="handleBorrow(scope.row)">借閱</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import Cookies from 'js-cookie';



export default defineComponent({
  data() {
    return {
      username: Cookies.get('username') || '未登入',
      filterStatus: '',
      books: [
        { title: '書名1', isbn: '1234567890', author: '作者1', description: '簡介1', status: '可借閱' },
        { title: '書名2', isbn: '0987654321', author: '作者2', description: '簡介2', status: '已借閱' },
      ]
    };
  },
  computed: {
    filteredBooks() {
      if (this.filterStatus) {
        return this.books.filter(book => book.status === this.filterStatus);
      }
      return this.books;
    }
  },
  methods: {
    handleBorrow(book) {
      ElMessageBox.confirm(`你確定要借閱《${book.title}》嗎？`, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        book.status = '已借閱';
        ElMessage({
          type: 'success',
          message: '借閱成功!'
        });
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消借閱'
        });
      });
    },
    handleLogout() {
      Cookies.remove('user');
      Cookies.remove('username');
      this.$router.push({ name: 'login' });
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