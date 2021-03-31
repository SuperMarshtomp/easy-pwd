<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 14:44:38
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-31 18:06:39
-->
<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    size="mini"
    hide-required-asterisk
    status-icon
  >
    <el-form-item label="描述" prop="des">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        v-model="ruleForm.des"
        maxlength="64"
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" maxlength="32"></el-input>
    </el-form-item>
    <el-form-item label="规则" prop="pwdRules">
      <el-checkbox-group
        v-model="ruleForm.pwdRules"
        @change="$refs['ruleForm'].clearValidate()"
      >
        <el-checkbox-button
          v-for="item in pwdRules"
          :label="item.name"
          :key="item.name"
          >{{ item.label }}</el-checkbox-button
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="允许符号" prop="symbol">
      <el-input
        @change="val => (pwdRules[3].value = val)"
        :disabled="!allowSymbol"
        v-model="ruleForm.symbol"
      ></el-input>
    </el-form-item>
    <el-form-item label="位数" prop="num">
      <el-input-number
        v-model="ruleForm.num"
        controls-position="right"
        :min="6"
        :max="32"
      ></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button @click="make">Make</el-button>
    </el-form-item>
    <el-form-item label="结果: " prop="result" label-width="50">
      <span>{{ resPwd }}&nbsp;&nbsp;</span
      ><el-link
        :disabled="!resPwd"
        :underline="false"
        @click="copy"
        style="font-size: 12px;vertical-align: baseline;"
        >Copy</el-link
      >
    </el-form-item>
    <el-form-item>
      <el-button :disabled="!resPwd" @click="save">Save</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import getRandomPaasword from '../../utils/makePassword'
export default {
  data() {
    return {
      rules: {
        des: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }
        ],
        symbol: [
          {
            pattern: /^[!@#$%^&*?]*$/,
            message: '只能输入 !@#$%^&*? 中的字符'
          }
        ]
      },
      ruleForm: {
        des: '',
        num: 16,
        name: '',
        pwdRules: ['lower', 'upper', 'number', 'symbol'],
        symbol: '!@#$%^&*?'
      },
      resPwd: '',
      pwdRules: [
        {
          name: 'lower',
          value: '',
          label: '小写'
        },
        {
          name: 'upper',
          value: '',
          label: '大写'
        },
        {
          name: 'number',
          value: '',
          label: '数字'
        },
        {
          name: 'symbol',
          value: '!@#$%^&*?',
          label: '符号'
        }
      ]
    }
  },
  computed: {
    allowSymbol() {
      return this.ruleForm.pwdRules.findIndex(item => item === 'symbol') + 1
    }
  },
  methods: {
    make() {
      this.$refs['ruleForm'].clearValidate()
      if (this.allowSymbol) {
        this.$refs['ruleForm'].validateField('symbol', err => {
          if (!err) {
            this.create()
          }
        })
      } else this.create()
    },
    create() {
      const rules = this.ruleForm.pwdRules.map(item =>
        this.pwdRules.find(row => row.name === item)
      )
      this.resPwd = getRandomPaasword(this.ruleForm.num, rules)
    },
    copy() {
      const { clipboard } = require('electron')
      clipboard.writeText(this.resPwd)
      this.$message.success('Copy success')
    },
    save() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  margin: 10px 0;
  .left-side {
    flex-basis: 70%;
  }
  .right-side {
    flex-basis: 30%;
  }
}
::v-deep {
  .el-textarea .el-input__count {
    background: inherit;
    bottom: -28px;
  }
}
</style>
