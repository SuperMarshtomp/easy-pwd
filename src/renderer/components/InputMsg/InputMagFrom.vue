<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 14:44:38
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-30 19:01:03
-->
<template>
  <main>
    <div class="left-side">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div>
          <div style="height: 150px">
            <el-form-item label="Description" prop="des">
              <el-input v-model="ruleForm.des"></el-input>
            </el-form-item>
            <el-button @click="create">Make</el-button>
          </div>
          <template v-if="resPwd">
            <div style="line-height: 20px">
              <el-form-item label="Result: " prop="result" label-width="50">
                <span>{{ resPwd }}&nbsp;&nbsp;</span
                ><el-link
                  :underline="false"
                  @click="copy"
                  style="font-size: 12px;vertical-align: baseline;"
                  >Copy</el-link
                >
              </el-form-item>
            </div>
            <div>
              <el-button style="float: bottom" @click="save">Save</el-button>
            </div>
          </template>
        </div>
      </el-form>
    </div>
    <div class="right-side" style="margin-left: 20px">
      <el-steps
        direction="vertical"
        :active="active"
        finish-status="success"
        style="height: 200px"
        class="left-side"
      >
        <el-step title="Make"></el-step>
        <el-step title="Copy"></el-step>
        <el-step title="Save"></el-step>
      </el-steps>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        des: [
          {
            required: true,
            message: 'Please enter description',
            trigger: 'blur'
          }
        ]
      },
      ruleForm: {
        des: ''
      },
      active: 0,
      resPwd: ''
    }
  },
  methods: {
    create() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.active = 1
          this.resPwd = this.ruleForm.des
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    copy() {
      const { clipboard } = require('electron')
      clipboard.writeText(this.resPwd)
      this.$message.success('Copy success')
      this.active = 2
    },
    save() {
      this.active = 3
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  height: 400px;
  margin: 10px 0;
  .left-side {
    flex-basis: 70%;
  }
  .right-side {
    flex-basis: 30%;
  }
}
</style>
