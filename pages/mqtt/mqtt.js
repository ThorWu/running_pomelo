// pages/mqtt/mqtt.js
var {
  Client,
  Message
} = require('../../utils/mqtt/paho-mqtt.js')

Page({

  data: {

    client: null,

    msg: ''
  },

  randomString: function (len) {

    len = len || 32;

    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

    var maxPos = $chars.length;

    var pwd = '';

    for (let i = 0; i < len; i++) {

      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));

    }
    console.log('randomString:' + pwd)
    return pwd;

  },

  subscribe: function (filter, subscribeOptions) {

    // 订阅

    var client = this.data.client;

    if (client && client.isConnected()) {

      wx.showToast({

        title: '订阅成功'

      })

      return client.subscribe(filter, subscribeOptions);

    }

    wx.showToast({

      title: '订阅失败',

      icon: 'success',

      duration: 2000

    })

  },

  publish: function (topic, message, qos = 0, retained = false) {

    // 发布

    var client = this.data.client;

    if (client && client.isConnected()) {

      var message = new Message(message);

      message.destinationName = topic;

      message.qos = qos;

      message.retained = retained;

      wx.showToast({

        title: '发布成功'

      })

      return client.send(message);

    }

    wx.showToast({

      title: '发送失败',

      duration: 2000

    })

  },

  onTabPublish: function () {
    this.doPublish()
  },


  onTabSubcribe: function () {
    this.doSubscribe()
  },


  doSubscribe: function () {

    console.log('doSubscribe');

    this.subscribe('sxaxEe8w', {

      qos: 2

    })

  },



  doPublish: function () {

    console.log('doPublish');

    var msgStr = JSON.stringify({
      "from": "sxaxEe8w", // 消息发送者UUID
      "to": "HrM4RTID", // 消息接收者UUID
      "content": "测试publish", // 消息内容
      "timestamp": "1544692167125", // 客户端发出的时间
      "role": "1", // 角色 0 初始角色，1 学生，2 职场人士， 3 咨询师
      "type": "0", // 消息类型 0普通消息1名片２评价100已读
      "question_id":"11"
    })

    console.log('msgStr:' + msgStr)

    this.publish('HrM4RTID', msgStr, 2, false)

  },

  doConnect: function () {

    console.log('doConnect');

    var that = this;

    if (that.data.client && that.data.client.isConnected()) {

      wx.showToast({

        title: '不要重复连接'

      })

      return

    }


    //TODO: clientId 和 userName
    // var client = new Client('ws://192.168.4.3:9093/mqtt', that.randomString());
    var client = new Client('ws://dev.dashixiong.com/mqtt', that.randomString());

    client.connect({

      useSSL: false,

      cleanSession: true,

      keepAliveInterval: 60,

      userName: "sxaxEe8w", //TODO:以这个字段为用户唯一标识，传token

      onSuccess: function () {

        console.log('connect suc')

        wx.showToast({

          title: '连接成功'

        })

        that.setData({
          client: client
        })

        client.onMessageArrived = function (msg) {

          if (typeof that.data.onMessageArrived === 'function') {

            return that.data.onMessageArrived(msg)

          }

          wx.showModal({

            title: msg.destinationName,

            content: msg.payloadString

          })

          that.setData({
            msg: JSON.stringify(msg)
          })
        }

        client.onConnectionLost = function (responseObject) {

          if (typeof that.data.onConnectionLost === 'function') {

            return that.data.onConnectionLost(responseObject)

          }

          if (responseObject.errorCode !== 0) {

            console.log("onConnectionLost:" + responseObject.errorMessage);

          }

        }

      }

    });

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.doConnect()
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