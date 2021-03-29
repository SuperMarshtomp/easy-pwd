/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-29 15:04:46
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-29 18:36:37
 */
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

export default (name) => new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath(name), '/data.db')
})
