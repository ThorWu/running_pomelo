//logs.js
const util = require('../../utils/util.js')

// 页面构造器
Page({
  data: { // 参与页面渲染的数据（和wxml一起渲染出最终的结构）
    logs: []
  },
  onLoad: function () { // 页面渲染后 执行
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
