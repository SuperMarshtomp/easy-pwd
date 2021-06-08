<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-04-02 16:01:02
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-06-08 17:39:40
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
    <div class="title flex-between">
      Find your password
      <el-button-group>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-download"
          @click="download"
          >导出</el-button
        >
        <el-button size="mini" type="primary" @click="readFile"
          >导入<i class="el-icon-upload2 el-icon--right"></i
        ></el-button>
      </el-button-group>
    </div>
    <history-list ref="list" />
  </div>
</template>

<script>
import HistoryList from './SearchPage/HistoryList.vue'
import { remote } from 'electron'
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
    } else {
      this.showPage = true
    }
  },
  methods: {
    download() {
      remote.dialog.showSaveDialog(
        {
          title: '请选择要保存的文件名',
          buttonLabel: '保存',
          filters: [
            {
              name: 'code',
              extensions: ['pwd']
            }
          ]
        },
        result => {
          if (result) {
            this.$db
              .find({ type: 'save-msg' })
              .sort({ created: 1 })
              .exec((err, docs) => {
                console.log('err: ', err)
                this.$ipcRenderer.send('async-write', {
                  url: result,
                  data: { user: this.$store.state.User, docs }
                })
              })
          }
        }
      )
    },
    async readFile() {
      try {
        const res = await this.$confirm(
          `假如导入文件中有相同的数据会以导入的文件为准并覆盖，是否继续？`,
          '提示',
          {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        console.log(res)
        if (res) {
          remote.dialog.showOpenDialog(
            {
              title: '请选择目标文件',
              buttonLabel: '确定',
              filters: [{ name: 'Custom File Type', extensions: ['pwd'] }]
            },
            result => {
              if (result && result.length) {
                this.$ipcRenderer.send('async-read', result[0])
              }
            }
          )
        }
      } catch (error) {}
    }
  }
}
</script>

<style>
.flex-between {
  display: flex;
  justify-content: space-between;
}
</style>
