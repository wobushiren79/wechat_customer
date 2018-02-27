// pages/others/web/web.js
var content;
var web_url;
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
    web_url=  options.webUrl;
    content.setData({
      url: web_url
    })
  },
 /**
   * 右上角分享
   */
   onShareAppMessage:function(opt){
	   var webUrl = this.data.url;
     return {
       title: "圆满人生",
       desc: '详情',
	  path: '/pages/others/web/web?webUrl=' + webUrl
     };
   }
})