import './plugins/axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index'
import { createI18n } from 'vue-i18n'
import en from './i18n/en'
import pt from './i18n/pt'

const app = createApp(App)
const pinia = createPinia()
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    pt,
  },
})

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
