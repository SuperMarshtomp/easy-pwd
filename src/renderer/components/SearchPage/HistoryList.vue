<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-04-02 16:03:03
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-04-02 18:10:34
-->
<!--
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 14:44:38
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-04-02 15:52:58
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
        <el-popover placement="right" width="400">
          <el-form label-width="40" size="mini">
            <el-form-item label="用户名:"
              >{{ item.name }}
              <el-button
                :disabled="!item.name"
                type="text"
                @click="copy(item.name)"
                >Copy</el-button
              ></el-form-item
            >
            <el-form-item label="密码:"
              >{{ item.pwd }}
              <el-button
                :disabled="!item.pwd"
                type="text"
                @click="copy(item.pwd)"
                >Copy</el-button
              ></el-form-item
            >
            <el-form-item label="创建日期:">{{ item.created }}</el-form-item>
            <el-form-item label="修改日期:">{{ item.motify }}</el-form-item>
          </el-form>
          <el-link
            :underline="false"
            style="line-height: 18px;font-size: 16px"
            slot="reference"
            >{{ item.des }}</el-link
          >
        </el-popover>
        <span style="float: right;line-height: 18px; display: inline-block">
          <el-button @click="deletePwd(item)" type="text" style="padding: 0;color: red"
            >Delete</el-button
          >
          <el-button @click="copy(item.pwd)" type="text" style="padding: 0;"
            >Copy paasword</el-button
          ></span
        >
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
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {
      try {
        const _this = this
        this.$db
          .find({ type: 'save-msg' })
          .sort({ created: 1 })
          .exec(function(err, docs) {
            console.log('err: ', err)
            _this.list = docs
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item--mini.el-form-item {
    margin: 0;
  }
  .el-form-item__label {
    font-weight: 600;
  }
}
</style>
