// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref ,computed} from 'vue'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(localStorage.getItem('user'))
  const token = ref(localStorage.getItem('token'))
  const test_login = async (credentials) =>{
    if (credentials.username == 'tom'){
      ElMessage({
        message: '登录成功',
        type: 'success',
      })
      router.push('/fileslist')
    }
  }
  const login = async (credentials) => {
      axios.post('auth/login', credentials,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        token.value = response.data.token
        user.value = response.data.user
        // console.log(token.value,user.value)
        ElMessage({
          message: '登录成功',
          type: 'success',
          plain: true,
        })
        localStorage.setItem('user', JSON.stringify(user.value))
        localStorage.setItem('token', token.value)
        console.log(user.value)
        router.push('/fileslist')
      }).catch(error => {
        // console.log(error.response.data)
        ElMessage({
          message: error.response.data || '登录失败',
          type: 'error',
          plain: true,
        })
      })
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    router.push('/')
  }
  const isAdmin = computed(()=>{
      if(typeof user.value=='object'){
          return user.value.role == 'admin'
      }else{
        return JSON.parse(user.value).role == 'admin'
      }

  })
  const isManager = computed(()=>{

    if(typeof user.value=='object'){
      return user.value.role == 'manager'
    }else{
      return JSON.parse(user.value).role == 'manager'
    }
  })
  return { user, token, login, logout,test_login,isAdmin,isManager}
})
