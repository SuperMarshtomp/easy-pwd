/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 12:51:41
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-04-02 16:13:27
 */
import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage.vue').default
    },
    {
      path: '/main',
      name: 'main-page',
      component: require('@/components/MainPage.vue').default
    },
    {
      path: '/search',
      name: 'search-page',
      component: require('@/components/SearchPage.vue').default
    }
  ]
})
