var socketMap = new Map()

var mOnMessageListener

function generateSocketItem(taskKey, socketTask) {
  return {
    key: taskKey,
    lockReconnect: false,
    socketTask: socketTask,
    isAlive: true,
    heartCheck: generateHeartCheck(),
    socketOpen: false
  }
}

function generateHeartCheck() {
  return {
    timeout: 60000, //60秒一次心跳包
    timeoutObj: null,
    serverTimeoutObj: null,

    reset: function () {
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      return this
    },

    start: function (socketItem) {
      this.timeoutObj = setTimeout(() => {
        sendMsg(socketItem, 'ping')
      }, this.timeout)
    }
  }
}

function initEventHandle(socketItem) {
  socketItem.socketTask.onOpen(function (res) {
    socketItem.socketOpen = true
    console.log('socket onOpen')
    console.log('socket[' + socketItem.key + ']open' + JSON.stringify(res))
    socketItem.heartCheck.reset().start(socketItem)
  })

  socketItem.socketTask.onClose(function (res) {
    socketItem.socketOpen = false
    console.log('socket onClose')
    console.log('socket[' + socketItem.key + ']close' + JSON.stringify(res))
    socketItem.heartCheck.reset()
    reconnect(socketItem.key)
  })

  socketItem.socketTask.onError(function (e) {
    socketItem.socketOpen = false
    console.log('socket onError')
    console.log('socket[' + socketItem.key + ']error:' + JSON.stringify(e))
    socketItem.heartCheck.reset()
    reconnect(socketItem.key)
  })

  socketItem.socketTask.onMessage(function (res) {
    console.log('socket onMessage')
    console.log('socket[' + socketItem.key + ']message:' + JSON.stringify(res))
    //ping的话，我响应也是ping
    if (res.data) {
      if (res.data == 'ping') {
        console.log('heart check ping[' + socketItem.key + ']')
        socketItem.heartCheck.reset().start(socketItem)
      } else {
        //TODO
        var dataStr = res.data
        var dataObj = JSON.parse(dataStr)
        if (dataObj.err_no == 0 && mOnMessageListener) {
          mOnMessageListener(dataObj)
        } else {
          //error
        }
      }
    }
  })
}

function linkListener(taskKey, onMessageListener) {
  link(taskKey)
  mOnMessageListener = onMessageListener
}

function link(taskKey) {
  linkOrigin(taskKey, false)
}

function linkReconnect(taskKey) {
  linkOrigin(taskKey, true)
}

function linkOrigin(taskKey, isReconnect) {
  if (!taskKey) {
    console.error('taskKey can not be null')
    return
  }

  //TODO:url
  var task = wx.connectSocket({
    url: "",
    header: {
      uuid: getApp().globalData.uuid,
      src: getApp().globalData.src,
      reconnect: isReconnect ? 1 : 0
    },
    success: function (res) {
      console.log("ws[" + taskKey + "]suc:" + JSON.stringify(res))
    },
    fail: function (res) {
      console.log("ws[" + taskKey + "]fail:" + JSON.stringify(res))
    },
  })

  //TODO:需要优化 fail的时候task是null
  var socketItem = generateSocketItem(taskKey, task)
  initEventHandle(socketItem)
  socketMap.set(taskKey, socketItem)

  return socketItem
}

function send(taskKey, dataStr) {
  var socketItem = socketMap.get(taskKey)
  sendMsg(socketItem, dataStr)
}

function sendMsg(socketItem, dataStr) {
  if (socketItem) {
    if (socketItem.socketOpen) {
      socketItem.socketTask.send({
        data: dataStr,
        success: function () {
          console.log('send[' + socketItem.key + ']' + dataStr + 'suc')
        }
      })
    } else {
      console.log('Sorry!socketItem[' + socketItem.key + '] is closed')
    }
  }
}

//等lockReconnect为false的时候，再去close，如果true的时候去close,可能reconnect link了一个新的，旧的被close了，而新的继续run；原因： setTimeout是异步的，不应该在外部控制执行。
//do while 和 while谨慎 死循环

function close(taskKey) {
  var socketItem = socketMap.get(taskKey)
  if (socketItem) {
    socketItem.isAlive = false //防止reconnect

    socketItem.socketTask.close({
      success: function () {
        console.log('close socket[' + socketItem.key + ']suc')
        //delete 
        socketMap.delete(taskKey)
      }
    })
  }
}

/**
 * TODO 莫名其妙 reconnect,导致提示“用户正在面试中”不能再面试了，卡死了
 */
function reconnect(taskKey) {

  var socketItem = socketMap.get(taskKey)
  if (socketItem) {
    console.log('attent to reconnect socketItem.socketOpen:' + socketItem.socketOpen)
    if (!socketItem.socketOpen) {

      if (socketItem.lockReconnect) {
        return
      }

      socketItem.lockReconnect = true

      //要控制多次同时进行，比如网络断开，会重复OnError一直reconnect，设置5秒内同一个taskKey,只能reconnect一次
      setTimeout(function () {
        if (socketItem.isAlive) {
          console.log('setTimeout to reconnect socketItem.socketOpen:' + socketItem.socketOpen)
          if (!socketItem.socketOpen) {
            console.log('reconnect[' + socketItem.key + ']link')
            linkReconnect(taskKey)
          } else {
            console.log('socket is opened,do not need to settimeout reconnect')
          }
        }
        socketItem.lockReconnect = false
      }, 10000)

    } else {
      console.log('socket is opened,do not need to reconnect')
    }
  }
}



module.exports = {
  link: link,
  linkListener: linkListener,
  send: send,
  close: close
}