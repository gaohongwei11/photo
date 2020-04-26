// pages/photo/photo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pic: '',
    hidden: true,
    w: 0,
    h: 0,
    saveHidden: true,
    color: 'transparent',
    items: [
      { name: '透明', value: 'transparent', checked: true},
      { name: '蓝底', value: '#00bff3', checked: false },
      { name: '白底', value: '#ffffff', checked: false },
      { name: '红底', value: '#ff0000', checked: false },
    ]
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      color: e.detail.value
    })
  },
  imgLoad(e){
    console.log(e)
    this.setData({
      w: e.detail.width,
      h: e.detail.height
    })
    
  },
  addbg() {
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.rect(10, 10, 100, 30)
    ctx.setFillStyle('yellow')
    ctx.fill()
  },
  save() {
    this.drawImage('data:image/png;base64,' + this.data.pic)
  },
  drawImage(imgSrc) {
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle(this.data.color)
    ctx.fillRect(0, 0, this.data.w, this.data.h);
    ctx.drawImage(imgSrc, 0, 0, this.data.w, this.data.h)
    ctx.draw(true, ()=> {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          console.log('draw+++', res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
              wx.showToast({
                title: '保存成功',
              })
            },
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    });
  },
  removebg(){
    let _this = this
    console.log(this)
    let image = this.data.pic
    this.setData({
      hidden: false,
      saveHidden: true
    })
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/body_seg?access_token=' + app.globalData.access_token, 
      method: 'POST',
      data: {
        image: image,
        type: 'foreground'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        _this.setData({
          pic: res.data.foreground,
          hidden: true,
          saveHidden: false
        })
      }
    })
  },
  addImg() {
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const photo = res.tempFilePaths[0]
        
        wx.getFileSystemManager().readFile({
          filePath: photo,
          encoding: "base64",
          success: function (data) {
            console.log(data)//返回base64编码结果，但是图片的话没有data:image/png
            _this.setData({
              pic: data.data
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})