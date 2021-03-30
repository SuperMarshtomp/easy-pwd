<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:09:45
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-30 18:54:48
-->
<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <div class="left-side">
        <span class="title">
          History Password
        </span>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Make your password</div>
          <InputMagFrom @create-success="createSuccess" />
          <!-- <el-button @click="Save">Save</el-button> -->
          <el-button @click="loginOut">Sign out</el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import InputMagFrom from './InputMsg/InputMagFrom.vue'

export default {
  name: 'landing-page',
  components: { InputMagFrom },
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
    },
    loginOut() {
      this.$router.push({ name: 'landing-page' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
