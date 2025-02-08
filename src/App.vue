<template>
  <div id="app">
    <div class="header">
      <div class="title">玉山借書系統</div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar icon="el-icon-user"></el-avatar>
          <span class="username">{{ username }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'App',
  data() {
    return {
      username: ''
    };
  },
  created() {
    this.username = Cookies.get('username') || '未登入';
  },
  watch: {
    '$route'() {
      this.username = Cookies.get('username') || '未登入';
    }
  },
  methods: {
    handleLogout() {
      Cookies.remove('user');
      Cookies.remove('username');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #3a3f44;
  color: #ffffff;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
}

.content {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.title {
  font-size: 1.5em;
  font-weight: bold;
}

.username {
  margin-left: 10px;
  white-space: nowrap;
}
</style>