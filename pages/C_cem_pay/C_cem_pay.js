var storageKey = require('../../utils/storage/StorageKey.js');
var util = require('../../utils/util.js');
var toastUtil = require('../../utils/ToastUtil.js');
var cemeteryHttp = require('../../utils/http/RequestForCemetery.js');
Page({
  data: {
    userId: null,
    positionData: null,

    array: [{
      "personNum": '人数',
      "cem": "公墓",
      "time": "2017-05-02",
      "traffic": "交通方式",
      "person": "公墓接待",
      "timeCem": "2017-02-02",
      "timeMoney": "2017-01-01",
      "cemName": "公墓名称",

      "consultId": '咨询ID',
      "consultStatus": '咨询状态',//1：未接单，2：已接单，3：已下单，4：洽谈失败，5：洽谈成功
      "customerAddress": "客户联系地址",
      "customerMobile": "客户联系电话",
      "customerName": "客户姓名",
      "description": "备注",
      "consultAssignId": '咨询指派ID',
      "orderId": '订单ID',//当未下过订单时, 该值为null
      "orderNum": "订单编号",
      "orderStatus": '订单状态',//1：未处理，2：待服务，3：已接受，4：服务派单中，5：结束派单，6：已确认，7：服务完成
      "agentmanName": "经办人姓名",
      "agentmanMobile": "经办人电话",
      "usageCurAddress": "使用者当前所在地",
      "performerName": "执行顾问",
      "performerMobile": "执行顾问电话",
      "hasPrepay": false,//定金是否已支付
      "showEditOrder": false,//是否显示[编辑订单]
      "showOrderDetail": false,//是否显示[订单详情]
      "promiseTime": 1461252140309,
      // "showAcceptOrReject":false,//是否显示[接单
      "showFinishTalk": false,//是否显示[结束洽谈]
      "showSwitch2waitService": false //是否显示[及時服务]
    }],
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
    if (position.endDate == null) {
      var endDate = new Date();
      position.endDate = util.formatDate(endDate)
    }
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
    console.log(e);
    var formValue = e.detail.value;
    if (formValue.ageLimit == null) {
      toastUtil.showToastReWrite('请填写缴费年限', 'icon_info');
    } else {
      var requestData = {
        ageLimit: formValue.ageLimit,
        lastId: 0,
        orderNumber: util.generateOrderNumber('YSGM'),
        currentPrice: formValue.currentPrice,
        payAmount: formValue.payAmount,
        beginDate: formValue.beginDate,
        endDate: formValue.endDate
      }
      var detilasCallBack = {
        success: function (dataContent, res) {
          if (dataContent == null || dataContent.length == 0) {
            return;
          }

        },
        fail: function () {
          wx.stopPullDownRefresh()
        }
      }
      cemeteryHttp.payMgt(requestData, detilasCallBack);
    }
  }

});
