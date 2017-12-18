var toastUtil = require('../../../utils/ToastUtil.js');
var util = require('../../../utils/util.js');
Page({
  data: {


  },
  onLoad: function () {
    var that = this
    // 取出缓存选择信息
    wx.getStorage({
      key: 'key',
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].endDate != null) {
            var endDate = res.data[i].endDate;
            endDate = endDate.replace(/-/g, '/');
            res.data[i].endDate = util.formatDate(new Date(endDate))
          }
        }
        that.setData({
          listData: res.data
        })
      },
      fail: function (res) {
        toastUtil.showToastReWrite('服务器开小差啦', 'icon_info');
      }
    })
  }
});