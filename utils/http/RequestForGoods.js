var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaGoodsUrl;

/**
 * 登陆单项
 */
function loginGoods(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_sys_api", data, callback,true)
}

/**
 * 获取单项订单列表信息 
 */
function getGoodsOrderList(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/order/list", data, callback, true)
}

/**
 * 获取单项订单列表信息 
 */
function getGoodsOrderDetails(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/order/findOrderDetailById", data, callback, true)
}

module.exports.loginGoods = loginGoods;
module.exports.getGoodsOrderList = getGoodsOrderList;
module.exports.getGoodsOrderDetails = getGoodsOrderDetails;
