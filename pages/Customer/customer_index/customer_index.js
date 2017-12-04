var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var platformHttp = require('../../../utils/http/RequestForPlatform.js');
var toastUtil = require('../../../utils/ToastUtil.js')
var pageUtil = require('../../../utils/PageUtil.js')
var content;
var storeId;
var goodsClassId;
var consultantId;
Page({
  data: {
    tab_bd_title: 1,
    tab_hd: 1
  },

  bind_tab_hd: function (e) {
    console.log(e.target.dataset.tab_hd)
    this.setData({
      tab_hd: e.target.dataset.tab_hd
    })
    pageUtil.initData();
    if (e.target.dataset.tab_hd == 1) {
      content.getStoreGoodsClass(storeId);
    } else if (e.target.dataset.tab_hd == 2) {
      content.getEvaluationList(consultantId)
    }
  },

  bingd_tab_bd_title: function (e) {
    content.goodsClassId = e.target.dataset.tab_bd_title
    this.setData({
      tab_bd_title: content.goodsClassId
    })
    pageUtil.initData();
    content.getStoreGoods(storeId, content.goodsClassId);
  },

  onLoad: function (evet) {
    content = this;
    storeId = evet.storeId;
    consultantId = evet.consultantId;
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
    content.getStoreGoods(storeId, content.goodsClassId);
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
          content.getStoreGoods(storeId, content.goodsClassId);
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
  },

  /**
   * 获取评价列表
   */
  getEvaluationList: function (evaluationId) {
    var evaluationListRequest = pageUtil.getPageData();
    evaluationListRequest.params = { evaluationId: evaluationId };

    var evaluationListCallBack = pageUtil.getPageCallBack(
      function (data, res, isLast) {
          content.setData({
            evaluationList: data
          })
      },
      function (data, res) {

      })
    platformHttp.findEvaluationListByUserId(evaluationListRequest, evaluationListCallBack);
  }
})
