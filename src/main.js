import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import Particles from 'vue-particles'
import App from './App.vue'
import router from './router'
import axios from 'axios'
axios.defaults.baseURL = 'http://10.20.228.101:8080'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$axios = axios;
app.use(createPinia())
app.use(router)
app.mount('#app')
