<!--
 * @description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:07:54
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-06-07 17:54:41
-->
<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="用户名" prop="name">
      <el-input v-model.trim="ruleForm.name" maxlength="32"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pwd">
      <el-input
        type="password"
        v-model.trim="ruleForm.pwd"
        maxlength="64"
      ></el-input>
      <div class="tips">请牢记您的密码 (建议简单密码)</div>
    </el-form-item>
    <el-form-item prop="savePwd">
      <el-checkbox v-model="ruleForm.savePwd">记住密码</el-checkbox>
    </el-form-item>
    <el-button :loading="loading.login" @click="login"
      >Sign in / Sign up</el-button
    >
    <el-button @click="deletePwd">删除密码</el-button>
  </el-form>
</template>

<script>
import Vue from 'vue'
import db from '../../datastore'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'))
      } else {
        if (!this.$db) callback()
        else {
          this.$db.findOne({ name: 'pwd' }, function(err, docs) {
            if (err) {
              callback(new Error(err))
            }
            if (docs) {
              if (value !== docs.value) {
                callback(
                  new Error(
                    'The password you entered is incorrect .Please try again'
                  )
                )
              } else callback()
            } else {
              callback()
            }
          })
        }
      }
    }
    return {
      rules: {
        name: [
          {
            required: true,
            message: "Please enter user's name",
            trigger: 'blur'
          }
        ],
        pwd: [{ validator: validatePass, trigger: 'blur' }]
      },
      ruleForm: {
        ...this.$store.state.User,
        pwd: this.$store.state.User.savePwd ? this.$store.state.User.pwd : '',
        savePwd: this.$store.state.User.savePwd || false
      },
      loading: {
        login: false
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    async login() {
      await this.$store.dispatch('createUserData', {
        name: '',
        pwd: '',
        savePwd: false
      })
      this.loading.login = true
      try {
        const _this = this
        this.$refs['ruleForm'].validateField('name', err => {
          if (!err) {
            const newdb = db(this.ruleForm.name)
            newdb.findOne({ name: 'pwd' }, function(err, doc) {
              if (!err && !doc) {
                _this.$refs['ruleForm'].validateField('pwd', err => {
                  if (!err) {
                    _this
                      .$confirm(
                        `用户名 ${_this.ruleForm.name} 为新用户，是否创建该用户？`,
                        '提示',
                        {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }
                      )
                      .then(() => {
                        Vue.prototype.$db = newdb
                        _this.$db.insert(
                          {
                            type: 'login',
                            name: 'pwd',
                            value: _this.ruleForm.pwd,
                            savePwd: _this.ruleForm.savePwd
                          },
                          function(err, newDoc) {
                            if (newDoc) {
                              _this.$message.success(
                                'Please be sure to record your password'
                              )
                            } else if (err) {
                              _this.$message.error(err)
                            }
                          }
                        )
                        _this.$store.dispatch('createUserData', _this.ruleForm)
                        setTimeout(() => {
                          _this.$router.replace({ name: 'main-page' })
                        }, 100)
                      })
                      .catch(() => {})
                  }
                })
              } else if (!err && doc) {
                Vue.prototype.$db = newdb
                _this.$refs['ruleForm'].validateField('pwd', err => {
                  if (!err) {
                    _this.$store.dispatch('createUserData', _this.ruleForm)
                    setTimeout(() => {
                      _this.$router.replace({ name: 'main-page' })
                    }, 100)
                  }
                })
              }
            })
          }
        })
      } catch (error) {
      } finally {
        this.loading.login = false
      }
    },
    deletePwd() {
      this.$db.remove({ name: 'pwd' }, { multi: true }, function(err) {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>
.tips {
  color: #909399;
  font-size: 12px;
  line-height: 14px;
  margin-top: 4px;
}
.el-button {
  margin-top: 10px;
}
</style>
