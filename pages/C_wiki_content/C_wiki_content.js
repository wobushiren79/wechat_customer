// pages/find/find_.js
var WxParse = require('../../wxParse/wxParse.js'); 
Page({
  data: {
    // title: "文章标题文章标题",
    // time: "2017-12-12",
    // author: "圆满人生原创",
    // keyword: ['关键词1', '关键词2'],
    // num: 0,
    // content_bd_text: "文章正文文章正文文章正文文章正文文章正文文章正文"
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中!请稍后',
    })
    var that = this
    var ShanWebUrl = getApp().globalData.ShanWebUrl
    var that = this
    wx.request({
      url: ShanWebUrl + 'Encylopedia/weiinfo?id='+options.id,
      method: "GET",
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed"
      },
      success: function (res) {
        // console.log(res.data)
        if (res.data.code == 1000) {
          setTimeout(function () {
            wx.hideLoading()
          }, 0)
          WxParse.wxParse('article','html', res.data.content.content, that, );
          that.setData({
            title:res.data.content.title,
            // content: res.data.content.content,
            time: res.data.content.time,
            keywords: res.data.content.keywords,
            id: res.data.content.id,
            author: res.data.content.author,
            options:options.id
          })
        }
         else {
          wx.showToast({
            title: res.data.message,
            duration: 3000
          })
        }
      }
    })
  },
  //转发
  onShareAppMessage: function () {
    return {
      title: '圆满人生e殡葬',
      path: 'pages/C_wiki/C_wiki',
      success: function (res) {
        // 转发成功最近更新
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'success',
          duration: 1500
        })
      }
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})