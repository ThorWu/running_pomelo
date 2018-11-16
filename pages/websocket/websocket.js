// pages/websocket/websocket.js
const webSocketQ = require('../../utils/ws/websocket-queue.js') //websocket的连接
const SOCKET_TASK_KEY = "SOCKET_TASK_TEST" //websocket的key

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onMessage: function (res) {
    console.log('chat onmessagelistener:' + JSON.stringify(res))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    webSocketQ.linkListener(SOCKET_TASK_KEY, this.onMessage)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})