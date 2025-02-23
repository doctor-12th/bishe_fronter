import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/MainLogin.vue'),
    meta: { requiresAuth: false }
  },{
    path: '/fileslist',
    name: 'FilesList',
    redirect: () => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return 'fileslist/presentation'
    },
    component: () => import('@/views/FileList.vue'),
    children:[
      {
        path: 'share',
        name: 'FilesShare',
        component: () => import('@/views/ShareFile.vue'),
        // meta: { requiresAuth: true }
      },{
        path: 'auth',
        name: 'AuthMangement',
        component: () => import('@/views/AuthMangement.vue'),
        // meta: { requiresAuth: true }
      },{
        path: 'presentation',
        name: 'FilesPresentation',
        component: () => import('@/views/FilePresentation.vue'),
        // meta: { requiresAuth: true }
      },{
        path: 'data',
        name: 'DataMangement',
        component: () => import('@/views/DataMangement.vue'),
        // meta: { requiresAuth: true }
      }
    ]
    // meta: { requiresAuth: true }
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
