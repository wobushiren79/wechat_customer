var pageUtil = require('../../../utils/PageUtil.js')
var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var content;
Page({
  data: {
  },
  onReady: function () {

  },
  onShow: function () {
    pageUtil.initData();
    content = this
    content.getListData();
  },
  onLoad: function () {

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
    pageData.content.orderStatus = [2];
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
  onReachBottom: function () {
    content.getListData();
  },
  onShareAppMessage: function () {
    return {
      title: '微信小程序联盟',
      desc: '最具人气的小程序开发联盟!',
      path: '/page/user?id=123'
    }
  }

});
