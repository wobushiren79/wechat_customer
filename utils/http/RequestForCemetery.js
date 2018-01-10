var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaCemeteryUrl;

/**
 * 登陆公墓
 */
function loginCemetery(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_subsystem_api", data, callback, true)
}
/**
 * 查询墓位信息
 */
function findPositionByCondition(data, callback) {
    baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/findPositionByCemeteryIdAndCondition", data, callback, true)
}

/**
 * 查询墓位详情
 */
function queryMgtFeeByPositionId(data, callback) {
    baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/queryDetailByPositionId", data, callback, true)
}

/**
 * 查询墓位缴费记录
 */
function queryMgtFeePage(data, callback) {
    baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/queryMgtFeePage", data, callback, true)
}

/**
 * 缴管理费
 */
function payMgt(data, callback) {
    baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/payMgt", data, callback, true)
}

/**
 * 更新管理费商户订单号
 */
function updateOutTradeNo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/updateOutTradeNo", data, callback, true)
}

/**
 * 查询我的管理费缴费记录
 */
function getManageFeeList(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/queryPositionMgtFeeByUserId", data, callback, true)
}

module.exports.findPositionByCondition = findPositionByCondition;
module.exports.queryMgtFeeByPositionId = queryMgtFeeByPositionId;
module.exports.loginCemetery = loginCemetery;
module.exports.queryMgtFeePage = queryMgtFeePage;
module.exports.payMgt = payMgt;
module.exports.updateOutTradeNo = updateOutTradeNo;
module.exports.getManageFeeList = getManageFeeList;
