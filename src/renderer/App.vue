<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 12:51:41
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-06-10 14:58:29
-->
<template>
  <div id="app">
    <span class="menu">
      <el-menu
        :default-active="activeIndex"
        :collapse="isCollapse"
        :collapse-transition="false"
        @select="goTo"
      >
        <el-menu-item index="landing-page">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="main-page">
          <i class="el-icon-setting"></i>
          <span slot="title">生成密码</span>
        </el-menu-item>
        <el-menu-item index="search-page">
          <i class="el-icon-search"></i>
          <span slot="title">查找</span>
        </el-menu-item>
      </el-menu>
    </span>
    <span class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </span>
  </div>
</template>

<script>
import footer from '../../algorithm-submodule/footer/index'
import '../../algorithm-submodule/footer/footer.css'
export default {
  name: 'easy-pwd',
  data() {
    return {
      isCollapse: true,
      activeIndex: 'landing-page'
    }
  },
  watch: {
    '$route.name': function(val) {
      this.activeIndex = val
    }
  },
  created() {
    let div = document.createElement('div')
    div.innerHTML = footer
    document.body.appendChild(div)
    this.$nextTick(() => {
      const svg = document.getElementById('github-svg')
      svg.style = 'cursor:pointer'
      svg.addEventListener('click', function(event) {
        event.preventDefault()
        const { shell } = require('electron')
        shell.openExternal('https://github.com/SuperMarshtomp/easy-pwd')
      })
    })
  },
  mounted() {
    this.$ipcRenderer.on('write-reply', (event, arg) => {
      if (arg.code === 'ENOENT') this.$message.error('导出失败')
      else this.$message.success('导出成功')
    })
  },
  methods: {
    goTo(index) {
      this.$router.replace({ name: index })
    }
  }
}
</script>

<style lang="scss">
/* CSS */
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
@import url('./assets/scss/main.scss');
</style>
<style lang="scss" scoped>
.menu {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
}

::v-deep .el-menu {
  height: 100vh;
  transition: all 0.3s ease;
}
.content {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 64px;
  width: calc(100% - 64px);
}
</style>
