<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:09:45
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-31 19:20:24
-->
<template>
  <div v-if="showPage" id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <div>
      <!-- <div class="left-side">
        <span class="title">
          History Password
        </span>
      </div>

      <div class="right-side"> -->
      <div class="doc">
        <div class="title">Make your password</div>
        <InputMagFrom @create-success="createSuccess" />
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import InputMagFrom from './InputMsg/InputMagFrom.vue'

export default {
  name: 'main-page',
  components: { InputMagFrom },
  data() {
    return {
      res: {
        des: '',
        pwdRes: ''
      },
      showPage: false
    }
  },
  activated() {
    if (!this.$store.state.User.name) {
      this.$message.warning('请先登录')
      this.showPage = false
      this.$router.replace({ name: 'landing-page' })
    } else this.showPage = true
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

<style lang="scss" scoped>
.doc {
  width: 50%;
  min-width: 300px;
}
</style>
