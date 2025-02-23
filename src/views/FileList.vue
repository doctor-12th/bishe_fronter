<template>
  <!-- 主容器 -->
  <div class="app-container">
    <!-- 导航栏 -->
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>企业文件管理系统</h1>
        </div>
      </el-header>
      <!-- 主内容区 -->
      <el-container>
        <!-- 侧边栏菜单 -->
        <el-aside width="200px">
          <el-menu
            router
            :default-active="$route.path"
            @select="handleMenuSelect"
          >
          <el-menu-item
            v-for="menu in menuItems"
              :key="menu.fullPath"
              :index="menu.fullPath">
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.title }}</span>
          </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 内容区域 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { Document, Share, Setting, DataAnalysis } from '@element-plus/icons-vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()

// 修正后的菜单配置
const menuItems = [
  {
    title: '我的文件',
    fullPath: '/fileslist/presentation',
    icon: Document
  },
  {
    title: '文件分享',
    fullPath: '/fileslist/share',
    icon: Share
  },
  {
    title: '权限管理',
    fullPath: '/fileslist/auth',
    icon: Setting
  },
  {
    title: '数据管理',
    fullPath: '/fileslist/data',
    icon: DataAnalysis
  }
]
// const computedrouter=()=>{
//   console.log(router.options.routes[1].children)
//   return router
// }
// 计算过滤后的菜单
// const filteredMenus = computed(() => {
//   return menuItems.filter(menu =>
//     menu.roles.includes(userInfo.value.role)
//   )
// })

// 文件上传功能
// const uploadVisible = ref(false)
// const uploadUrl = import.meta.env.VITE_API_BASE + '/file/upload'
// const uploadHeaders = ref({
//   Authorization: 'Bearer ' + localStorage.getItem('token')
// })

// const handleUploadSuccess = (response) => {
//   if (response.code === 200) {
//     ElMessage.success('上传成功')
//     uploadVisible.value = false
//   } else {
//     ElMessage.error(response.message)
//   }
// }

// 权限控制
// const checkPermission = (requiredRole) => {
//   return userInfo.value.role === requiredRole
// }

// 退出登录
// const logout = () => {
//   localStorage.removeItem('token')
//   router.push('/login')
// }

// 路由守卫
// router.beforeEach((to) => {
//   if (!localStorage.getItem('token') && to.path !== '/login') {
//     return '/login'
//   }
// })
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-demo {
  width: 100%;
}
</style>
