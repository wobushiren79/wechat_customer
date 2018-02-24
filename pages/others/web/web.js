// pages/others/web/web.js
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    content=this;
    var web_url=  options.webUrl;
    content.setData({
      url: web_url
    })
  },


})