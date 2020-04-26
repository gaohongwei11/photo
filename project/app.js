//app.js
App({
  onLaunch: function () {
    this.getToken()
    console.log(this)
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getToken(){
    let _this = this
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', //仅为示例，并非真实的接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: '9jqxdwnN6FmiyCPqK485Wjwt',
        client_secret: 'p46xSYZUmUYtYeH5ToxLXux7bfO92v94'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        _this.globalData.access_token = res.data.access_token
      }
    })
  },
  globalData: {
    userInfo: null,
    access_token: null
  }
})