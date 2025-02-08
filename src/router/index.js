import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import HomePage from '../pages/homePage.vue'
import LoginPage from '../pages/loginPage.vue'
import RegisterPage from '../pages/registerPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!Cookies.get('user');
  if (to.name !== 'login' && to.name !== 'register' && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router