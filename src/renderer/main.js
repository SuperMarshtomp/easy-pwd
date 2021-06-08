/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 12:51:41
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-06-08 15:44:07
 */
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { ipcRenderer } from 'electron'

Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.prototype.$ipcRenderer = ipcRenderer

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
