import '../assets/ep4ever.png'
import '../scss/style.scss'

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import Api from './api'
import FakeApi from './fakeapi'
import FakeConfig from './fakeconfig'
import App from '../view/App.vue'
import { messages as msg } from '../i18n/messages'

const client = new XMLHttpRequest()
client.open('GET', document.location, true);
client.send()

client.onreadystatechange = async () => {
  if (client.readyState === client.HEADERS_RECEIVED) {
    // this is needed to make API calls on the same IP of the API
    const serverAddr = client.getResponseHeader('server_addr')
    // xhr done do not trap other state
    client.abort()

    const userLang = window.navigator.language
    const app = createApp(App)

    const i18n = createI18n({
      locale: userLang.substring(0, 2),
      fallbackLocale: 'en',
      messages: msg,
    })

    let config = new FakeConfig()
    let api = new FakeApi()

    if (serverAddr === null) {
      console.warn("No server_addr headers found. Run this app with httpservice!")
    } else {
      const apiUrl = serverAddr.concat('/api')
      api = new Api(apiUrl)
      config = await api.getApiConfig()
    }
    app.config.globalProperties.settings = config
    app.config.globalProperties.api = api
    app.config.globalProperties.isOnStage = function(item) {
      return typeof item !== 'undefined' && item !== null
    }

    app.use(i18n)
    app.mount('#app')
  }
}
