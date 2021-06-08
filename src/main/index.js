/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-31 18:26:27
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-06-08 16:32:32
 */
'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 950
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
var fs = require('fs')

ipcMain.on('async-write', (event, arg = { url: '', docs: {} }) => {
  fs.writeFile(arg.url, JSON.stringify(arg.data), 'utf8', err => {
    if (err) {
      event.sender.send('write-reply', err)
    } else {
      event.sender.send('write-reply', '导出成功')
    }
  })
})

ipcMain.on('async-read', function(event, url) {
  fs.readFile(url, 'utf8', (err, data) => {
    if (err) {
      event.sender.send('read-reply', '读取失败')
    } else {
      event.sender.send('read-reply', data)
    }
  })
})
