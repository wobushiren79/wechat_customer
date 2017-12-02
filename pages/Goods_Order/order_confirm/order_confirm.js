var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var toastUtil = require('../../../utils/ToastUtil.js')
var content;
var orderId;
Page({
  data: {
    showTotalPrice: 0,
    totalPrice: 0,
  },
  onLoad: function (evet) {
    content = this
    orderId = evet.orderId
    content.getGoodsOrder();
  },

  /**
   * 获取订单详情
   */
  getGoodsOrder() {
    var findGoodsOrderRequest = {
      orderId: orderId
    }
    var findGoodsOrderCallBack = {
      success: function (data, res) {
        content.setData({
          showTotalPrice: data.showTotalPrice,
          totalPrice: data.totalPrice,
          orderNumber: data.orderNumber,
          orderId: orderId
        })
      },
      fail: function () {
        toastUtil.showToast("获取订单失败");
      }
    }
    goodsHttp.findGoodsOrderByOrderId(findGoodsOrderRequest, findGoodsOrderCallBack);
  },

  fukuang: function (e) {
    var confirmGoodsOrderRequest = {
      orderId: orderId
    }
    var confirmGoodsOrderCallBack = {
      success: function (data, res) {
        toastUtil.showToast("提交订单成功");
        wx.redirectTo({
          url: '../service_goods_pay/service_goods_pay?orderId=' + orderId
        })
      },
      fail: function (data, res) {
        toastUtil.showToast("提交订单失败");
      }
    }
    goodsHttp.confirmGoodsOrder(confirmGoodsOrderRequest, confirmGoodsOrderCallBack);
  }

})
