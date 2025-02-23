<!-- src/views/Login.vue -->
<script setup>
import { ref ,reactive} from 'vue'
// import { useRouter } from 'vue-router'
// import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
// const router = useRouter()

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

// 记住密码状态
const rememberMe = ref(false)

// 加载状态
const loading = ref(false)
// 表单验证规则
const loginRules = reactive({
  // username: [
  //   { required: true, message: '用户名不能为空', trigger: 'blur' },
  //   { min: 3, max: 16, message: '长度在4到16个字符', trigger: 'blur' }
  // ],
  // password: [
  //   { required: true, message: '密码不能为空', trigger: 'blur' },
  //   { pattern: /^(?=.*[A-Za-z])(?=.*\d)[^]{8,20}$/,
  //     message: '需包含字母和数字，长度8-20位' }
  // ]
})

const handleLogin = async () => {
    await auth.login(loginForm)
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 登录标题 -->
      <div class="title-container">
        <h1 class="title">企业文件管理系统</h1>
        <div class="sub-title">Secure Document Management Platform</div>
      </div>
      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
      >
        <!-- 用户名输入 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
          >
            <template #prepend>
              <el-icon><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          >
            <template #prepend>
              <el-icon><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 辅助功能 -->
        <div class="flex-bar">
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码?</el-link>
        </div>

        <!-- 登录按钮 -->
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleLogin"
          class="login-btn"
        >
          {{ loading ? '登录中...' : '立即登录' }}
        </el-button>

        <!-- 第三方登录 -->
        <div class="oauth-login">
          <div class="divider">
            <span class="line"></span>
            <span class="text">其他登录方式</span>
            <span class="line"></span>
          </div>
          <div class="oauth-icons">
            <el-icon><avatar /></el-icon>
            <el-icon><message /></el-icon>
            <el-icon><iphone /></el-icon>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width:100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;


  .login-box {
    width: 450px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    z-index: 1;
    animation: slideUp 0.6s ease;

    .title-container {
      text-align: center;
      margin-bottom: 40px;

      .title {
        font-size: 28px;
        color: #303133;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .sub-title {
        font-size: 14px;
        color: #909399;
        letter-spacing: 2px;
      }
    }

    :deep(.el-input__wrapper) {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 5px 15px;
    }

    .flex-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
    }

    .login-btn {
      width: 100%;
      border-radius: 8px;
      height: 48px;
      font-size: 16px;
      letter-spacing: 2px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      transition: all 0.3s;

      &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
    }

    .oauth-login {
      margin-top: 30px;

      .divider {
        display: flex;
        align-items: center;
        color: #909399;
        margin-bottom: 20px;

        .line {
          flex: 1;
          height: 1px;
          background: #dcdfe6;
        }

        .text {
          padding: 0 15px;
          font-size: 12px;
        }
      }

      .oauth-icons {
        display: flex;
        justify-content: center;
        gap: 25px;

        .el-icon {
          font-size: 24px;
          color: #606266;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            color: #409eff;
            transform: scale(1.2);
          }
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
