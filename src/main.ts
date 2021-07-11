import { createApp } from "vue"
import App from "./App.vue"
import { createRouter, createWebHashHistory } from "vue-router"
import Home from "./pages/Home.vue"
import "98.css"

const routes = [{ path: "/", component: Home }]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

let app = createApp(App)
app.config.globalProperties.production = false
app.config.globalProperties.network = app.config.globalProperties.production ? 137 : 31337
app.use(router).mount("#app")
