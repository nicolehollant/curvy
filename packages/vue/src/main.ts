import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/base.css'
import FontAwesomeIcon from './font-awesome'

const app = createApp(App)

app.use(router)

app.component('FAIcon', FontAwesomeIcon)

app.mount('#app')
