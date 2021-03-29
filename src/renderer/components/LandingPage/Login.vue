<!--
 * @description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:07:54
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-29 18:42:14
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
    <el-button @click="login">{{ hasPwd ? 'Sign in' : 'Sign up' }}</el-button>
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
        pwd: [{ validator: validatePass, trigger: 'change' }]
      },
      ruleForm: {
        name: '',
        pwd: ''
      },
      hasPwd: false
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
      const _this = this
      this.$refs['ruleForm'].validateField('name', err => {
        if (!err) {
          Vue.prototype.$db = db(this.ruleForm.name)
          console.log(this.$db)
          this.$db.insert(
            {
              name: 'pwd',
              value: this.ruleForm.pwd
            },
            function(err, newDoc) {
              if (newDoc) {
                console.log('newDoc: ', newDoc);
                _this.$message.success('Please be sure to record your password')
              } else if (err) {
                console.log('err: ', err);
                _this.$message.error(err)
              }
            }
          )

          // this.$refs['ruleForm'].
        }
      })
      // this.$refs['ruleForm'].validate(valid => {
      //   if (valid) {
      //     if (!this.hasPwd) {
      //       this.$db.insert(
      //         {
      //           name: 'pwd',
      //           value: this.ruleForm.pwd
      //         },
      //         function(err, newDoc) {
      //           if (newDoc) {
      //             _this.$message.success(
      //               'Please be sure to record your password'
      //             )
      //           } else if (err) {
      //             _this.$message.error(err)
      //           }
      //         }
      //       )
      //     }
      //     this.$router.push({ name: 'main-page' })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    deletePwd() {
      this.$db.remove({ name: 'pwd' }, { multi: true }, function(err) {
        console.log('err: ', err)
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
</style>
