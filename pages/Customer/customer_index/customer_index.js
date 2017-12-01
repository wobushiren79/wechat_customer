var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var toastUtil = require('../../../utils/ToastUtil.js')
var pageUtil = require('../../../utils/PageUtil.js')
var content;
var storeId;
var goodsClassId;
Page({
  data: {
    tab_bd_title: 1
  },
  bingd_tab_bd_title: function (e) {
    content.goodsClassId = e.target.dataset.tab_bd_title
    this.setData({
      tab_bd_title: content.goodsClassId
    })
    pageUtil.initData();
    content.getStoreGoods(content.storeId, content.goodsClassId);
  },
  onLoad: function (evet) {
    content = this;
    content.storeId = evet.storeId;
    content.getStoreInfo(evet.storeId);
    content.getStoreGoodsClass(evet.storeId);
    content.setData({
      storeId: evet.storeId
    })
    console.log(evet.storeId)
  },
  //下拉刷新页面
  onPullDownRefresh: function () {
    content.onLoad()
  },
  //上拉添加记录条数
  onReachBottom() {
    content.getStoreGoods(content.storeId, content.goodsClassId);
  },
  /**
   * 获取门店信息
   */
  getStoreInfo: function (storeId) {
    var storeInfoRequest = {
      stores_id: storeId
    };
    var storeInfoCallBack = {
      success: function (data, res) {
        content.setData({
          shop_name: data.shop_name,
          consultant_name: data.consultant_name,
          consultant_tel: data.consultant_tel,
          shop_location: data.shop_location
        })
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    };
    goodsPHPHttp.findStoreInfoByStoreId(storeInfoRequest, storeInfoCallBack);
  },

  /**
   * 获取门店商品分类属性
   */
  getStoreGoodsClass: function (storeId) {
    var storeGoodsClassRequest = {
      id: storeId
    };
    var storeGoodsClassCallBack = {
      success: function (data, res) {
        content.setData({
          listGoodsClass: data
        })
        if (data[0]) {
          content.goodsClassId = data[0].id
          content.getStoreGoods(content.storeId, content.goodsClassId);
        }
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    };
    goodsPHPHttp.findStoreGoodsClass(storeGoodsClassRequest, storeGoodsClassCallBack);
  },

  /**
   * 获取门店商品列表
   */
  getStoreGoods: function (storeId, goodsClassId) {
    var storeGoodsRequest = pageUtil.getPageData();
    storeGoodsRequest.id = storeId;
    storeGoodsRequest.class_id = goodsClassId;

    var storeGoodsCallBack = pageUtil.getPageCallBack(
      function (data, res, isLast) {
        for (var i = 0; i < data.length; i++) {
          data[i].picUrl = getApp().globalData.PHPGoodsPicUrl + data[i].title_img;
        }
        content.setData({
          listGoods: data
        })
      },
      function (data, res) {
        toastUtil.showToast(data);
      }
    );
    goodsPHPHttp.findStoreGoods(storeGoodsRequest, storeGoodsCallBack);
  }
})
