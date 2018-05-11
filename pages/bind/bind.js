// pages/bind/bind.js
Page({
  /**
     * 页面的初始数据
     */
  data: {
    isMine: false,
    isDisable: false,
    time: '获取验证码',
    canIUse: wx.canIUse('input.adjust-position'),
    phone: '',
    verifyCode: ''
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

  handleInputPhone: function (event) {
    console.assert(this.data.canIUse, "微信版本低于1.9.90")
    this.setData({
      phone: event.detail.value
    })
    console.log(this.data.phone)
  },

  handleInputVerifyCode: function (event) {
    this.setData({
      verifyCode: event.detail.value
    })
    console.log(this.data.verifyCode)
  },

  handleTapIDM: function () {
    //点击IDM帐号绑定
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fromMine) {
      if (options.fromMine === 'true') {
        this.setData({
          isMine: true
        })
      } else {
        this.setData({
          isMine: false
        })
      }
    }

    console.log("isMine:" + typeof (this.data.isMine) + ":" + this.data.isMine)
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