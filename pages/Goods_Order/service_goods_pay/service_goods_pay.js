
var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var toastUtil = require('../../../utils/ToastUtil.js')
var content;
var orderId;
//获取应用实例
var QR = require("../../../utils/qrcode.js");
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    chaxun: false,
    num: 20170202020202,
    money: 0,
    codeUrl: '',
    maskHidden: true,
    imagePath: '',
    showTotalPrice: 0,
    placeholder: 'http://m.e-funeral.cn'//默认二维码生成文本
  },
  onReady: function () {
    var size = this.setCanvasSize();//动态设置画布大小
    var initUrl = this.data.placeholder;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },

  onLoad: function (evet) {
    content = this
    orderId = evet.orderId
    content.getGoodsOrder();
  },



  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 150 / 150;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log("********" + tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 线下支付
   */
  bind_moda: function () {
    wx.showModal({
      title: '确认线下支付',
      content: '点击确认后，使用线下支付方式，包括现金刷卡收取等',
      success: function (res) {
        if (res.confirm) {
          content.payOffLine();
        }
      }
    });
  },

  /**
   * 查询财务信息
   */
  orver: function () {
    var findFinanceDetailRequest = {
      id: orderId
    }
    var findFinanceDetailCallBack = {
      success: function (data, res) {
        var paymentStatus = data.paymentStatus
        if (paymentStatus == 0) {

        }
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    }

    goodsHttp.findFinanceDetailByOrderId(findFinanceDetailRequest, findFinanceDetailCallBack);
  },

  /**
   * 微信支付
   */
  wechats: function () {
    wx.login({
      success: function (e) {
        var wechatPayRequest = {
          orderId: orderId,
          total_fee: content.data.showTotalPrice*100,
          code: e.code
        }
        var wechatPayCallBack = {
          success: function (data, res) {
            content.relationGoodsAndWechatPay(orderId, data.out_trade_no);
          },
          fail: function (data, res) {
            toastUtil.showToast(data);
          }
        }
        goodsPHPHttp.wechatPay(wechatPayRequest, wechatPayCallBack);
      }
    })
  },


  /**
   * 关联支付与工单
   */
  relationGoodsAndWechatPay: function (orderId, outTradeNo) {
    var updateOutTradeNoRequest = {
      orderId: this.orderId,
      outTradeNo: this.outTradeNo
    }

    var updateOutTradeNoCallBack = {
      success: function (data, res) {
        wx.requestPayment({
          'timeStamp': '' + res.data.list.timeStamp + '',
          'nonceStr': res.data.list.nonceStr,
          'package': res.data.list.package,
          'signType': res.data.list.signType,
          'paySign': res.data.list.paySign,
          'success': function (res) {
            if (res.errMsg == 'requestPayment:ok') {
              wx.redirectTo({
                url: '../service_goods_pay_succeed/service_goods_pay_succeed'
              })
            } else {
              toastUtil.showToast('系统繁忙');
            }
          },
          'fail': function (res) {
            if (res.errMsg == 'requestPayment:fail') {
              wx.navigateTo({
                url: '../service_goods_pay_error/service_goods_pay_error'
              })
            }
          }
        })
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    }

    goodsHttp.updateOutTradeNo(updateOutTradeNoRequest, updateOutTradeNoCallBack)
  },


  /**
   * 获取订单详情
   */
  getGoodsOrder: function () {
    var findGoodsOrderRequest = {
      // orderId: orderId
      orderId: orderId
    }
    var findGoodsOrderCallBack = {
      success: function (data, res) {
        content.setData({
          showTotalPrice: data.showTotalPrice / 100,
          totalPrice: data.totalPrice / 100,
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

  /**
   * 线下支付
   */
  payOffLine: function () {
    var payOffLineRequest = {
      orderId: orderId,
      actualPayment: content.data.totalPrice
    };
    var payOffLineCallBack = {
      success: function (data, res) {

        wx.redirectTo({
          url: '../service_goods_pay_succeed/service_goods_pay_succeed',
        })
      },
      fail: function (data, res) {
        wx.redirectTo({
          url: '../service_goods_pay_error/service_goods_pay_error',
        })
      }
    }
    goodsHttp.payOffLine(payOffLineRequest, payOffLineCallBack);
  }
})
