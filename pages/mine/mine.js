// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasBindPhone: false,
    avatarUrl: "/images/mine_head_default.png",
    userName: '',
    hasVerified: false,
    userPhone: '',
    userPoints: ''
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

  },

  /**
   * 点击绑定手机
   */
  handleTapBindPhone: function () {
    wx.navigateTo({
      url: '../bind/bind?fromMine=true',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  handleTapRecommend:function(){
    wx.navigateTo({
      url: '../recommend/recommend',
    })
  }

})