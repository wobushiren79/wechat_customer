App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
});
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    ShanWebUrl: "https://m.e-funeral.cn/",
    ByUrl: "https://t-cemetery-api.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/",
    GmUrl: "https://t-cemetery-api.shianlife.cn/shianlife-advisor-cemetery-1.0-SNAPSHOT/",
    // GmUrl:"http://192.168.0.37:8088/app/",
    PHPGoodsUrl: "http://192.168.0.54/shian_goods/",
    PHPGoodsPicUrl: "http://192.168.0.54/shian_goods/Public/Uploads/",
    JavaGoodsUrl: "http://192.168.0.59:8080/goods/",
    JavaPlatformUrl: "http://192.168.0.59:8099/ki4so-web/"
    // JavaGoodsUrl:"https://goods.shianlife.cn/",
    // JavaPlatformUrl:"https://platform.shianlife.cn/"
  }

})