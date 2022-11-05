import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './app.css'
import './assets/tailwind.css'
import store from './store/index'

const app = createApp(App);
app.use(router);
app.use(store)

app.mount('#app')
store.dispatch('initEditor')
store.dispatch('init')