<template>
  <!-- 主容器 -->
  <div style="width: 100vw;height: 80px; line-height:80px; border-bottom: 1px solid #ccc; display: flex">
   <div style="width: 300px; padding-left:30px; font-weight: bold; color:dodgerblue;font-size: 30px">
     <!-- <img :src="imgUrl" class="icon" > -->
     企业文件管理系统
    </div>
   <!-- <div style="flex: 1"></div> -->
   <div style="position:fixed;right:10px;top:0px;font-size: 25px;">
     <!-- <el-dropdown>
      <span class="el-dropdown-link"> -->
         <!-- <el-icon class="el-icon--right"> -->
          <el-icon><User /></el-icon>
         {{ user.username }}
          <!-- </el-icon> -->
      <!-- </span> -->
      <el-button type="primary" @click="logout" style="font-size: 20px;">退出系统</el-button>
       <!-- <template #dropdown>
         <el-dropdown-menu>
           <el-dropdown-item @click="logout">退出系统</el-dropdown-item>
         </el-dropdown-menu>
       </template> -->
     <!-- </el-dropdown> -->
   </div>
 </div>
    <!-- 导航栏 -->


      <!-- 主内容区 -->
      <div style="display: flex;">
        <!-- 侧边栏菜单 -->
        <el-aside width="200px">
          <el-menu
          style="width: 200px; min-height: calc(100vh - 50px);"
            router
            :default-active="$route.path"
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
          <router-view style="flex: 1;"/>
      </div>
</template>

<script setup>
import { Document, Share, Setting, DataAnalysis } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { onMounted ,computed} from 'vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => {
  console.log(localStorage.getItem('user'))
  return JSON.parse(localStorage.getItem('user'))
})
// const authStore = useAuthStore()
// 修正后的菜单配置
const menuItems = computed(()=>{
    if(authStore.isAdmin){
        return menuAllItems
    }else if(authStore.isManager){
        return menuAllItems.slice(0,3)
    }else
        return menuAllItems.slice(0,2)
    })


const menuAllItems = [
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
onMounted(() => {
  console.log(router.options.routes[1].children)
  // console.log(fileStore.files.length)
  // console.log(user.value)

})
// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

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
.icon {
  width: 30px;
  height: 30px;
  padding-top: 5px;
  padding-right: 10px;
}
:deep(.el-menu-item){
  font-size:20px;
}
</style>
