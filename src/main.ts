import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home.vue'
import CreateDao from './pages/CreateDao.vue'
import DaoDash from './pages/DaoDash.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/create', component: CreateDao },
    { path: '/dash/:address', component: DaoDash }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
