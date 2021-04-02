<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-04-02 16:01:02
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-04-02 17:26:46
-->
<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:32:21
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-31 18:38:58
-->
<template>
  <div v-if="showPage" id="wrapper">
    <div class="title">Find your password</div>
    <history-list ref="list" />
  </div>
</template>

<script>
import HistoryList from './SearchPage/HistoryList.vue'
export default {
  name: 'search-page',
  components: { HistoryList },
  data() {
    return {
      showPage: false
    }
  },
  activated() {
    if (!this.$store.state.User.name || !this.$db) {
      this.$message.warning('请先登录')
      this.showPage = false
      this.$router.replace({ name: 'landing-page' })
    } else this.showPage = true
  },
  methods: {}
}
</script>

<style></style>
