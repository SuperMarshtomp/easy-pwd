<!--
 * @description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:07:54
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-30 18:50:36
-->
<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="user's name" prop="name">
      <el-input v-model.trim="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="user's initial password" prop="pwd">
      <el-input type="password" v-model.trim="ruleForm.pwd"></el-input>
      <div class="tips">Please be sure to record your password</div>
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
        name: '',
        pwd: ''
      },
      hasPwd: false,
      loading: {
        login: false
      }
    }
  },
  computed: {},
  created() {
    // const _this = this
    // this.$db.findOne({ name: 'pwd' }, function(err, docs) {
    //   if (err) _this.$message.error(err)
    //   _this.hasPwd = docs !== null
    // })
  },
  methods: {
    login() {
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
                        'The user name is a new user. Do you want to sign up the new user?',
                        'warning',
                        {
                          confirmButtonText: 'confirm',
                          cancelButtonText: 'cancel',
                          type: 'warning'
                        }
                      )
                      .then(() => {
                        Vue.prototype.$db = newdb
                        _this.$db.insert(
                          {
                            name: 'pwd',
                            value: _this.ruleForm.pwd
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
                        _this.$router.replace({ name: 'main-page' })
                      })
                      .catch(() => {})
                  }
                })
              } else if (!err && doc) {
                Vue.prototype.$db = newdb
                _this.$refs['ruleForm'].validateField('pwd', err => {
                  if (!err) {
                    _this.$router.replace({ name: 'main-page' })
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
  line-height: 13px;
}
.el-button {
  margin-top: 10px;
}
</style>
