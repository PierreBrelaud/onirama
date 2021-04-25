import { createApp } from 'troisjs'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

const app = createApp(App)

app
    .use(store)
    .use(router)
    .mount('#app')


app.config.globalProperties.$api = 'https://us-central1-gobelins-onirama.cloudfunctions.net/api'
    
    