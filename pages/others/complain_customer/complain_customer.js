// pages/others/complain_customer.js
var ModalUtil = require('../../../utils/ModalUtil.js');
var content;
Page({
  /**
   * 页面的初始数据
   */
  data: {
	complaintType: 0,
	complaintType_SelectedIndex:0,
	complaintType_Set:[
		{ id: 0, text: '--未选择--'},
		{ id: 1, text: '公墓' },
		{ id: 2, text: '殡仪'},
		{ id: 3, text: '人员'}
	]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  content=this;
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
   * 类型选择
   */
  complaintTypeChange: function(e){
	  var selectIndex = parseInt(e.detail.value);
	  var selectItem = this.data.complaintType_Set[selectIndex];
	  this.setData({
		  complaintType_SelectedIndex: selectIndex,
		  complaintType: selectItem.id
	  });
  },
  cancelComplain:function(e){
	  ModalUtil.showModal('提示','需要取消？', function(){
		  var C_aboutme = getApp().pagesPositionUrl['C_aboutme'];
		  wx.redirectTo({
			  url: C_aboutme
		  });
	  }, function(){		  
	  });
 }
})