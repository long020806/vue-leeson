import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

/**
 * 1.构造假数据根据数据渲染位置
 * 2.配置组件的对应关系{preview: ,render:}
 */