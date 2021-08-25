import { createApp } from 'vue'
import 'normalize.css/normalize.css' // normalize.css
import App from './App.vue'
// import axios from './plugins/axios'
import store from './store'
import router from './router'
import '@/assets/css/index.scss'
import './permission'

import installIcon from './icons'

import installElementPlus from './plugins/element'
const app = createApp(App)
installElementPlus(app)
installIcon(app)
console.log(app)
app.use(router).use(store).mount('#app')