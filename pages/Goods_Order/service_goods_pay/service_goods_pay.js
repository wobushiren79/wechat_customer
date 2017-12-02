
var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var goodsPHPHttp=require('../../../utils/http/RequestForPHPGoods.js');
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
    wx.showLoading({
      title: '查询中...',
      icon: 'loading',
    });
    var that = this
    var JSESSIONID = that.data.JSESSIONID
    var javaApi = getApp().globalData.javaApi
    var content = {}
    content.id = that.data.orderId
    var setData = {}
    setData.content = content
    wx.request({
      url: javaApi + 'api/goods/order/findFinanceDetailById',
      method: "POST",
      data: setData,
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },
      success: function (da) {
        if (da.data.code == 1000) {
          var paymentStatus = da.data.content.paymentStatus
          if (paymentStatus == 0) {
            wx.showModal({
              title: '圆满人生提示您',
              content: '订单未支付',
              confirmText: '返回首页',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            wx.hideLoading()
          } else {
            wx.showModal({
              title: '圆满人生提示您',
              content: '订单已支付成功',
              confirmText: '返回首页',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            wx.hideLoading()
          }
        }
        wx.hideLoading()
        // console.log(da)
      },
    })
    // console.log('查询支付结果')
  },

  /**
   * 微信支付
   */
  wechats: function () {
    
    wx.login({
      success: function (e) {
        var wechatPayRequest = {
          orderId: orderId,
          total_fee: content.data.showTotalPrice,
          code: e.code
        }
        var wechatPayCallBack = {
          success: function (data,res) {
              var codeUrl = res.data.list
              var coedData = res.data.data
              that.setData({
                codeUrl: codeUrl,
                coedData: coedData,
                isShowImg: true
              })


              var orderId = that.data.orderId
              var out_trade_no = res.data.out_trade_no;
              var setData = {}
              var sett = {}
              sett.orderId = orderId
              sett.outTradeNo = out_trade_no
              setData.content = sett
              wx.request({
                url: javaApi + 'api/goods/order/updateOutTradeNo',
                method: "POST",
                data: setData,
                header: {
                  // "Content-Type": "application/x-www-form-urlencodeed",
                  'content-type': 'application/json',
                  "Cookie": JSESSIONID
                },
                success: function (da) {
                  if (da.data.code == 1000) {
                    var st = setTimeout(function () {
                      var size = that.setCanvasSize();
                      var codeUrl = that.data.codeUrl
                      //绘制二维码
                      that.createQrCode(codeUrl, "mycanvas", size.w, size.h);
                      that.setData({
                        maskHidden: true
                      });
                      clearTimeout(st);
                    }, 2000)
                    that.setData({
                      chaxun: true
                    })
                    wx.hideLoading()
                  } else {
                    wx.hideLoading()
                    wx.showToast({
                      title: res.data.message,
                      image: '../../images/icon_info.png',
                      duration: 3000
                    })
                  }
                }
              })
          },
          fail: function (data) { 
            toastUtil.showToast(data);
          }
        }
        goodsPHPHttp.wechatPay(wechatPayRequest, wechatPayCallBack);
      }
    })
  },

  /**
   * 获取订单详情
   */
  getGoodsOrder: function () {
    var findGoodsOrderRequest = {
      // orderId: orderId
      orderId: 21
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
          url: '../service_goods_pay_succeed/service_goods_pay_succeed'
        })
      },
      fail: function (data, res) {
        wx.navigateTo({
          url: '../service_goods_pay_error/service_goods_pay_error'
        })
      }
    }
    goodsHttp.payOffLine(payOffLineRequest, payOffLineCallBack);
  }
})
