// pages/mqtt/mqtt.js
var {
  Client,
  Message
} = require('../../utils/mqtt/paho-mqtt.js')

Page({

  data: {

    requestResult: '',

    client: null

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

      icon: 'success',

      duration: 2000

    })

  },



  doSubscribe: function () {

    console.log('doSubscribe');

    this.subscribe('test/topic', {

      qos: 1

    })

  },



  doPublish: function () {

    console.log('doPublish');

    this.publish('test/topic', 'Hello World', 1, false)

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



    // var client = new Client('ws://192.168.4.3:9093/mqtt', that.randomString());
    // var client = new Client('192.168.4.3', 9093, '/mqtt', that.randomString(12));
    //测试百度云
    var client = new Client('wss://www.mengmeitong.com/mqtt', that.randomString());
    client.connect({

      //百度云
      hosts: ["miniprogram.mqtt.iot.bj.baidubce.com"],
      ports: [443],
      userName: "miniprogram/gekongfei",
      password: "sgx+vSWVMhLS5asUlvXZG03vDTGO8McG+9IMwbVpL40=",

      useSSL: false,

      cleanSession: true,

      keepAliveInterval: 5,

      onSuccess: function () {

        console.log('connect suc')

        wx.showToast({

          title: '连接成功'

        })

        that.data.client = client

        client.onMessageArrived = function (msg) {

          if (typeof that.data.onMessageArrived === 'function') {

            return that.data.onMessageArrived(msg)

          }

          wx.showModal({

            title: msg.destinationName,

            content: msg.payloadString

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