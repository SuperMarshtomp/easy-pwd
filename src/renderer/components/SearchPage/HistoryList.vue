<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-04-02 16:03:03
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-06-10 11:37:38
-->
<template>
  <div>
    <el-input
      style="margin: 10px 0"
      placeholder="请输入备注或用户名关键字查询"
      suffix-icon="el-icon-search"
      v-model="search.keyword"
      clearable
      @clear="getList"
      @change="searchList"
      size="small"
      @keyup.enter.native="searchList"
    >
    </el-input>
    <el-row :gutter="30">
      <el-col
        :xs="24"
        :sm="12"
        :xl="8"
        v-for="item in list"
        :key="item._id"
        style="margin: 10px 0"
      >
        <el-popover
          placement="right"
          width="450"
          @after-leave="cancelEdit(item)"
        >
          <el-form label-width="80px" size="mini" label-position="right">
            <el-form-item label="用户名:">
              <span v-if="!item.editing">{{ item.name }}</span>
              <el-input
                v-model="item.name"
                style="width: 200px"
                maxlength="32"
                v-else
              ></el-input>
              <el-button
                :disabled="!item.name"
                type="text"
                @click="copy(item.name)"
                ><i class="el-icon-copy-document"/></el-button
            ></el-form-item>
            <el-form-item label="密码:">
              <span v-if="!item.editing">{{ item.pwd }}</span>
              <el-input
                v-model.trim="item.pwd"
                style="width: 200px"
                v-else
              ></el-input>
              <el-button
                :disabled="!item.pwd"
                type="text"
                @click="copy(item.pwd)"
                ><i class="el-icon-copy-document"/></el-button
            ></el-form-item>
            <el-form-item label="标签:"
              ><el-tag
                :key="tag"
                v-for="tag in item.tags"
                :closable="item.editing"
                :disable-transitions="false"
                @close="handleTagClose(item, tag)"
              >
                {{ tag }}
              </el-tag>
              <template v-if="item.editing">
                <el-input
                  class="input-new-tag"
                  v-if="item.inputVisible"
                  v-model="item.inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(item)"
                  @blur="handleInputConfirm(item)"
                  maxlength="16"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(item)"
                  :disabled="item.tags && item.tags.length > 2"
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
              </template>
            </el-form-item>
            <el-form-item label="创建日期:">{{ item.created }}</el-form-item>
            <el-form-item label="修改日期:">{{ item.motify }}</el-form-item>
            <el-form-item>
              <el-button
                style="float: right"
                v-if="!item.editing"
                @click="$set(item, 'editing', true)"
                icon="el-icon-edit"
                type="primary"
                >编辑</el-button
              >
              <span style="float: right" v-else>
                <el-button type="primary" @click="saveEdit(item)"
                  >保存</el-button
                >
                <el-button @click="cancelEdit(item)">取消</el-button>
              </span>
            </el-form-item>
          </el-form>
          <el-link
            :underline="false"
            style="line-height: 18px;font-size: 16px"
            slot="reference"
            >{{ item.des }}</el-link
          >
        </el-popover>
        <span style="float: right;line-height: 18px; display: inline-block">
          <el-button
            @click="deletePwd(item)"
            type="text"
            style="padding: 0;color: red"
            ><i class="el-icon-delete"
          /></el-button>
          <el-button @click="copy(item.pwd)" type="text" style="padding: 0;"
            ><i class="el-icon-copy-document"/></el-button
        ></span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { copy } from '../../../utils/copy'
export default {
  data() {
    return {
      list: [],
      copy,
      search: {
        keyword: ''
      }
    }
  },
  mounted() {
    this.getList()
    this.$ipcRenderer.on('read-reply', this.handleRead)
  },
  activated() {
    this.getList()
  },
  destroyed() {
    this.$ipcRenderer.removeListener('read-reply', this.handleRead)
  },
  methods: {
    handleRead(event, arg) {
      if (arg.code === 'ENOENT') this.$message.error('导入失败')
      else this.writeDb(arg)
    },
    getList() {
      try {
        this.$db
          .find({ type: 'save-msg' })
          .sort({ created: 1 })
          .exec((err, docs) => {
            console.log('err: ', err)
            this.list = docs.map(item => {
              if (!item.tags) this.$set(item, 'tags', [])
              return item
            })
          })
      } catch (error) {
        console.log('error: ', error)
      }
    },
    searchList() {
      try {
        const _this = this
        const regex = new RegExp(`${this.search.keyword}`, 'i')
        this.$db
          .find({
            $and: [
              { type: 'save-msg' },
              {
                $or: [{ des: { $regex: regex } }, { name: { $regex: regex } }]
              }
            ]
          })
          .sort({ created: 1 })
          .exec(function(err, docs) {
            console.log('err: ', err)
            _this.list = docs
          })
      } catch (error) {
        console.log('error: ', error)
      }
    },
    deletePwd(item) {
      const _this = this
      this.$confirm(
        `是否确定删除 ${item.des} ？删除后无法恢复，请谨慎操作`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          _this.$db.remove({ _id: item._id }, {}, function(err, numRemoved) {
            console.log('numRemoved: ', numRemoved)
            console.log('err: ', err)
            if (numRemoved) _this.searchList()
          })
        })
        .catch(() => {})
    },
    writeDb(arg) {
      const data = JSON.parse(arg)
      if (data.docs && data.docs.length > 0) {
        for (let index = 0; index < data.docs.length; index++) {
          const element = data.docs[index]
          this.$db.update(
            { _id: element._id },
            element,
            { upsert: true },
            (err, numReplaced) => {
              console.log('numReplaced: ', numReplaced)
              console.log('err: ', err)
            }
          )
        }
      }
      this.$message.success('导入成功')
      this.getList()
    },
    saveEdit(item) {
      delete item.editing
      delete item.inputVisible
      delete item.inputValue
      const now = new Date().toString()
      this.$db.update(
        { _id: item._id },
        { ...item, motify: now },
        { upsert: false },
        (err, numReplaced) => {
          if (numReplaced > 0) {
            this.$message.success('保存成功')
            item.motify = now
          }
          console.log('err: ', err)
        }
      )
      this.$set(item, 'editing', false)
    },
    cancelEdit(item) {
      if (!item.editing) return
      this.$db.findOne(
        {
          $and: [{ type: 'save-msg' }, { _id: item._id }]
        },
        (err, doc) => {
          console.log('err: ', err)
          if (doc) {
            Object.keys(item).forEach(key => {
              item[key] = doc[key]
            })
            if (!item.tags) this.$set(item, 'tags', [])
          }
        }
      )
      item.editing = false
    },
    handleTagClose(item, tag) {
      item.tags.splice(item.tags.indexOf(tag), 1)
    },

    showInput(item) {
      this.$set(item, 'inputVisible', true)
      this.$set(item, 'inputValue', '')
    },

    handleInputConfirm(item) {
      let inputValue = item.inputValue
      if (inputValue) {
        item.tags.push(inputValue)
      }
      item.inputVisible = false
      item.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item--mini.el-form-item {
    margin: 0 0 6px 0;
    font-size: 14px;
  }
  .el-form-item__label {
    font-weight: 600;
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
  color: #fff;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: top;
}
</style>
