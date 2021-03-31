<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:32:21
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-31 18:38:58
-->
<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <div class="left-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <Login />
        </div>
      </div>

      <div class="right-side" style="padding-left: 30px">
        <span class="title">
          Welcome to easy-pwd!
        </span>
        <p>
          Make password easier
        </p>
        <system-information></system-information>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'
import Login from './LandingPage/Login'

export default {
  name: 'landing-page',
  components: { SystemInformation, Login },
  data() {
    return {
      res: {
        des: '',
        pwdRes: ''
      }
    }
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    createSuccess(res) {
      this.res = { ...res }
    }
  }
}
</script>

<style></style>
