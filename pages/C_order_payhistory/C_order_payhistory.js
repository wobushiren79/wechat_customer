var cemeteryHttp = require("../../utils/http/RequestForCemetery.js")
var toastUtil = require("../../utils/ToastUtil.js");
var pageUtil = require("../../utils/PageUtil.js");
var util = require('../../utils/util.js');
var content;
Page({
  data: {
    valid: [0]
  },
  onShow: function () {
    pageUtil.initData();
    getManageFeeList()
  },
  //上拉添加记录条数
  onReachBottom() {
    getManageFeeList()
  },
  onLoad: function () {
    content = this;
  },

});

/**
 * 获取缴费记录列表
 */
function getManageFeeList() {
  var listRequest = pageUtil.getPageData();
  var listCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].end_date != null) {
          var endDate = data[i].end_date;
          endDate = endDate.replace(/-/g, '/');
          data[i].end_date = util.formatDate(new Date(endDate))
        }
        if (data[i].begin_date != null) {
          var beginDate = data[i].begin_date;
          beginDate = beginDate.replace(/-/g, '/');
          data[i].begin_date = util.formatDate(new Date(beginDate))
        }
      }
      content.setData({
        listdata: data,
        notNumber: isLast
      })
    },
    function (data, res) {

    }
  )
  cemeteryHttp.getManageFeeList(listRequest, listCallBack)
}
