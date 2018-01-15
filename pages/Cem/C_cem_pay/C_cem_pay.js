var storageKey = require('../../../utils/storage/StorageKey.js');
var util = require('../../../utils/util.js');
var toastUtil = require('../../../utils/ToastUtil.js');
var cemeteryHttp = require('../../../utils/http/RequestForCemetery.js');
var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var orderId;
var payInfo;
Page({
  data: {
    userId: null,
    positionData: null,
    isShowInput:0,
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'PLATFORM_USER_ID',
      success: function (res) {
        that.setData({
          userId: res.data,
        })
      },
    });
    var positionDetail = wx.getStorageSync(storageKey.CEMETERY_POSITION_MGFEE_DETAIL);
    if (positionDetail) {
      positionDetail.currentPrice = 0;
      if (positionDetail.endDate == null) {
        var endDate = new Date();
        positionDetail.endDate = util.formatDate(endDate)
      }
      that.setData({
        positionData: positionDetail
      })
    }
  },
  bindAgeLimitBlur: function (e) {
    var that = this;
    var ageLimit = e.detail.value;
    var position = that.data.positionData;
    var startTime = Date.parse(new Date(position.endDate)) / 1000;
    var endTime = ageLimit * 31536000 + startTime;
    var endDate = util.formatDateTime(endTime, 'Y-M-D');
    endDate = endDate.replace(/-/g, '-');
    position.newEndDate = endDate;
    position.currentPrice = ageLimit * position.feeYear;
    that.setData({
      positionData: position
    })
  },
  formSubmit: function (e) {
    var that = this;
    var pageValues = that.data.positionData;
    var formValue = e.detail.value;
    if (formValue.ageLimit.length == 0) {
      toastUtil.showToastReWrite('请填写缴费年限', 'icon_info');
    } else {
      var orderNumber = util.generateOrderNumber('YSGM');//交管理费编号
      var requestData = {
        ageLimit: formValue.ageLimit,
        lastId: 0,
        // orderNumber: orderNumber,
        currentPrice: formValue.currentPrice,
        payAmount: formValue.payAmount,
        beginDateStr: formValue.beginDate + " 00:00:00",
        endDateStr: formValue.endDate+" 00:00:00",
        deadNames: pageValues.deadNames,
        cemeteryId: pageValues.cemeteryId,
        orderId: pageValues.orderId,
        tombPositionId: pageValues.tombPositionId
      }
      var detilasCallBack = {
        success: function (dataContent, res) {
          if (dataContent == null || dataContent.length == 0) {
            return;
          }
          orderId=dataContent.id;
          that.weChatPay(dataContent.payAmount);
        },
        fail: function () {
          wx.stopPullDownRefresh();
          toastUtil.showToastReWrite('缴费失败', 'icon_info');
        }
      }
      cemeteryHttp.payMgt(requestData, detilasCallBack);
    }
  },
  weChatPay: function (payAmount){
    var that = this;
    wx.login({
      success: function (e) {
        var wechatPayRequest = {
          orderId: orderId,
          total_fee: payAmount,
          code: e.code,
          // notify_url:
        };
        var wechatPayCallBack = {
          success: function (data, res) {
            console.log(data)
            console.log(res)
            payInfo = res.data.list;
            that.relationMgtAndWechatPay(orderId, res.data.out_trade_no);
          },
          fail: function (data, res) {
            toastUtil.showToast(data);
          }
        };
        goodsPHPHttp.wechatPay(wechatPayRequest, wechatPayCallBack);
      }
    })
  }
,
  /**
   * 关联支付与工单
   */
  relationMgtAndWechatPay: function (orderId, outTradeNo) {
    var updateOutTradeNoRequest = {
      id: orderId,
      orderNumber: outTradeNo
    }

    var updateOutTradeNoCallBack = {
      success: function (data, res) {
        wx.requestPayment({
          'timeStamp': '' + payInfo.timeStamp + '',
          'nonceStr': payInfo.nonceStr,
          'package': payInfo.package,
          'signType': payInfo.signType,
          'paySign': payInfo.paySign,
          'success': function (res) {
            if (res.errMsg == 'requestPayment:ok') {
              wx.redirectTo({
                url: '../../Goods_Order/service_goods_pay_succeed/service_goods_pay_succeed'
              })
            } else {
              toastUtil.showToast('系统繁忙');
            }
          },
          'fail': function (res) {
            if (res.errMsg == 'requestPayment:fail') {
              wx.navigateTo({
                url: '../../Goods_Order/service_goods_pay_error/service_goods_pay_error'
              })
            }
          }
        })
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    }

    cemeteryHttp.updateOutTradeNo(updateOutTradeNoRequest, updateOutTradeNoCallBack)
  },


});

