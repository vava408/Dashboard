import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import Home from '../views/Acueil.vue'
import Systheme from '../views/Systheme.vue'
import Pm2 from '../views/Pm2.vue'
import Docker from '../views/Docker.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/systeme',
      name: 'système',
      component: Systheme,
    },
        {
      path: '/pm2',
      name: 'PM2',
      component: Pm2,
    },
    {
      path: '/docker',
      name: 'Docker',
      component: Docker,
    },
  ],
})

export default router
