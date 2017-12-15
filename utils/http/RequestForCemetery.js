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
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/queryMgtFeeByPositionId", data, callback, true)
}

module.exports.findPositionByCondition = findPositionByCondition;      
module.exports.queryMgtFeeByPositionId = queryMgtFeeByPositionId;  
module.exports.loginCemetery = loginCemetery;   