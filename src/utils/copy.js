/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-04-02 16:41:50
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-04-02 16:50:03
 */
import { Message } from 'element-ui'
export const copy = val => {
  if (!val) {
    Message.error('message error')
    return
  }
  const { clipboard } = require('electron')
  clipboard.writeText(val)
  Message.success('Copy success')
}
