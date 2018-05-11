// pages/bind/bind.js
Page({
  /**
     * 页面的初始数据
     */
  data: {
    isDisable: false,
    time: '获取验证码',
  },
  handleTapVerifyCode: function () {
    //接口取验证码
    
    //开启计时器
    var currentTime = 60;
    var that = this;
    that.setData({
      time: currentTime + '秒',
      isDisable: true,
    })
    var interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) + '秒',
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          isDisable: false
        })
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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