import { createApp } from "vue"
import App from "./App.vue"
import "98.css"

let app = createApp(App)
app.mount("#app")

window.onload = () => {
    let app = document.getElementById("app")
    if (app) {
        app.style.display = "block";
    }
    let splash = document.getElementById("splash")
    if (splash) {
        splash.style.display = "none";
    }
}
