var pageUtil = require('../../../utils/PageUtil.js')
var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var content;
Page({
  data: {
      pagesPositionUrl: null
  },
  onReady: function () {

  },
  onShow: function () {
    pageUtil.initData();
    content = this
    content.getListData();
  },
  onLoad: function () {
	  var pagesPositionUrlObj = getApp().pagesPositionUrl;
	  this.setData({
		  pagesPositionUrl: pagesPositionUrlObj
	  });
  },
  tel: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel, //仅为示例，并非真实的电话号码
      complete: function (res) {
        console.log(res)
      },
    })
  },

  /**
   * 获取列表数据
   */
  getListData: function () {
    var pageData = pageUtil.getPageData();
    pageData.content = {};
    pageData.content.orderStatus = [3,4];
    pageData.content.sourceChannels = 1;
    var pageCallBack = pageUtil.getPageCallBack(
      function getDataSuccess(data, res, isLast) {
        content.setData({
          listdata: data,
          notNumber: isLast,
        })
        wx.stopPullDownRefresh()
      },
      function getDataFail(data, res) {
        wx.stopPullDownRefresh()
      });
    goodsHttp.getGoodsOrderList(pageData, pageCallBack);
  },

  //下拉刷新页面
  onPullDownRefresh: function () {
    content.onShow()
  },
  //上拉添加记录条数
  onReachBottom() {
    content.getListData();
  },
  /**
   * 付款
   */
  evaluation: function (e) {
	  var storeUserIdVal = e.target.dataset.storeuserid;
	  var orderIdVal = e.target.dataset.orderid;
	  var storeNameVal = e.target.dataset.storename;
	  var url = content.data.pagesPositionUrl["evaluation_customer"];
	  var params = "?storeUserId=".concat(storeUserIdVal);
	  params += "&orderId=".concat(orderIdVal);
	  params += "&storeName=".concat(storeNameVal);
	  url = url.concat(params);
     wx.navigateTo({
		url: url,
     });
  }
});
