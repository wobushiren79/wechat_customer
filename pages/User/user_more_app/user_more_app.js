// pages/demo1/demo1.js
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
     * 顶部导航-跳转网页
     */
  toWebShow: function(opt){
	  var webUrl = opt.currentTarget.dataset.url;
      var navUrl = "/pages/others/web/web?webUrl=" + webUrl;
	 var params={};
	 params.url = navUrl;
	 wx.navigateTo(params);
  },
	/**
     * 顶部导航-案例-跳转小程序
     */
  toSmallApp: function(opt){
	  var params = {};
	  params.appId ="wx75dc6feb054c4a79"; // 顾问
	  params.path = "pages/other/activity/activity_list/activity_list"; // 活动页
	  wx.navigateToMiniProgram(params);
  }
})