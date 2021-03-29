/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 12:51:41
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-29 16:02:46
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage.vue').default
      // children: [

      // ]
    },
    {
      path: '/main',
      name: 'main-page',
      component: require('@/components/MainPage.vue').default
    }
    // {
    //   path: '*',
    //   redirect: '/'
    // },
  ]
})
