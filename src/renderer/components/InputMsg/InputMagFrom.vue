<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 14:44:38
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-06-10 10:16:16
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
    <el-form-item label="标签" prop="tag">
      <el-tag
        :key="tag"
        v-for="tag in ruleForm.tags"
        closable
        :disable-transitions="false"
        @close="handleTagClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
        maxlength="16"
      >
      </el-input>
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showInput"
        :disabled="ruleForm.tags.length > 2"
        >+ New Tag
        <el-tooltip
          class="item"
          effect="dark"
          content="最多允许输入三个标签"
          placement="top"
        >
          <i class="el-icon-warning" />
        </el-tooltip>
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="make">Make</el-button>
    </el-form-item>
    <el-form-item label="密码" prop="result" label-width="50">
      <el-input v-model.trim="ruleForm.pwd" style="width: 200px"></el-input>
      &nbsp;&nbsp;<el-link
        :disabled="!ruleForm.pwd"
        :underline="false"
        @click="copy(ruleForm.pwd)"
        style="font-size: 12px;vertical-align: baseline;"
        ><i class="el-icon-copy-document"
      /></el-link>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="!ruleForm.pwd" @click="save">Save</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import getRandomPaasword from '../../../../algorithm-submodule/generatedPassword'
import { copy } from '../../../utils/copy'

export default {
  data() {
    return {
      copy,
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
        ],
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      ruleForm: {
        des: '',
        num: 16,
        name: '',
        pwdRules: ['lower', 'upper', 'number', 'symbol'],
        symbol: '!@#$%^&*?',
        tags: [],
        pwd: ''
      },
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
      ],
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    allowSymbol() {
      return this.ruleForm.pwdRules.findIndex(item => item === 'symbol') + 1
    }
  },
  methods: {
    async make() {
      this.$refs['ruleForm'].clearValidate()
      if (this.allowSymbol) {
        try {
          await this.check('symbol')
          this.create()
        } catch (error) {
          console.log('error: ', error)
        }
      } else this.create()
    },
    create() {
      const rules = this.ruleForm.pwdRules.map(item =>
        this.pwdRules.find(row => row.name === item)
      )
      this.ruleForm.pwd = getRandomPaasword(this.ruleForm.num, rules)
    },
    async save() {
      try {
        await this.check('des')
        if (this.allowSymbol) await this.check('symbol')
        const now = new Date().toString()
        this.$db.insert({
          type: 'save-msg',
          ...this.ruleForm,
          created: now,
          motify: now
        })
        this.$message.success('Save success')
      } catch (error) {
        console.log('error: ', error)
      }
    },
    async check(type) {
      return new Promise((resolve, reject) => {
        try {
          this.$refs['ruleForm'].validateField(type, err => {
            if (!err) {
              resolve('success')
            } else {
              reject(new Error(err))
            }
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    handleTagClose(tag) {
      this.ruleForm.tags.splice(this.ruleForm.tags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.ruleForm.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
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
  .el-link.el-link--default {
    color: #409eff;
  }
}
.el-tag {
  margin-right: 10px;
}
.el-tag {
  margin-bottom: 8px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding: 0 12px;
  border-radius: 0.5em;
  background: #409eff;
  border: 1px solid #409eff;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: top;
}
</style>
