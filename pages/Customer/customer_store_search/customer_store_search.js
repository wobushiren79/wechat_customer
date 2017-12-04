// pages/mystroe/search/search.js
var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var toastUtil = require('../../../utils/ToastUtil.js');
var pageUtil = require('../../../utils/PageUtil.js');
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
    content = this;
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

  //下拉刷新页面
  onPullDownRefresh: function () {
    pageUtil.initData();
    content.startSearch(null);
  },

  //上拉添加记录条数
  onReachBottom: function () {
    content.startSearch(null);
  },
  /**
   * 开始搜索
   */
  startSearch: function (searchData) {
    var storesSearchRequest = pageUtil.getPageData();
    if (searchData) {
      storesSearchRequest.search = searchData;
    }
    var storesSearchCallBack = pageUtil.getPageCallBack(
      function (data, res, isLast) {

      },
      function (data, res) {

      }
    );
    goodsPHPHttp.storesSearch(storesSearchRequest, storesSearchCallBack)
  }

})