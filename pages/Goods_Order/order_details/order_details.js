var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var content;
var orderId;
Page({

  data: {
    list_show: false,
    img_wrap: false,
    popup: false,
    package_a: false
  },
  bind_list: function () {
    var that = this;
    that.setData({
      list_show: (!that.data.list_show)
    })
  },
  bind_img: function () {
    var that = this;
    that.setData({
      img_wrap: (!that.data.img_wrap)
    })
  },
  call_phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  kehuphone: function () {
    wx.makePhoneCall({
      phoneNumber: '966188',
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  // popup: function () {
  //   var that = this
  //   that.setData({
  //     popup: true
  //   })
  // },
  popup_close: function () {
    this.setData({
      popup: false
    })
  },
  package_b: function () {
    this.setData({
      get_goodsItemPerforms: [],
      package_a: false
    })
  },
  onShow: function () {
    var detailsRequest = {
      id: orderId
    }
    var detilasCallBack = {
      success: function (data) {

        content.setData({
          listData: data
        })
      },
      fail: function () {
        wx.stopPullDownRefresh()
      }
    }
    goodsHttp.getGoodsOrderDetails(detailsRequest, detilasCallBack);
  },
  onLoad: function (evet) {
    content = this;
    orderId = evet.orderId
  },

  packages: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
    })
    var get_goodsItemPerforms = []
    var id = e.currentTarget.dataset.id
    var goodsItemPerforms = that.data.listData
    for (var i in goodsItemPerforms.goodsPackages) {
      if (goodsItemPerforms.goodsPackages[i].id == id) {
        get_goodsItemPerforms = goodsItemPerforms.goodsPackages[i].goodsItemPerforms
      }
    }
    that.setData({
      get_goodsItemPerforms: get_goodsItemPerforms,
      package_a: true
    })
    wx.hideLoading()
  },

  /**
   * 执行信息
   */
  zhixing: function (e) {
    var id = e.currentTarget.dataset.id
    var performInfoRequest = {
      performId: id
    }

    var performInfoCallBack = {
      success: function (data, res) {
        that.setData({
          zhixing: listData,
          popup: true
        })
      },
      fail: function (data, res) {

      }
    }
    goodsHttp.findPerformInfoByPerformId(performInfoRequest, performInfoCallBack);
  },

  kehuphone: function (e) {
    wx.makePhoneCall({
      phoneNumber: "966188"
    })
  },
  online: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../service_goods_pay/service_goods_pay?orderId=' + orderId
    })
  }
});
