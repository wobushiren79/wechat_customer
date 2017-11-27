var baseRequest = require('BaseRequest.js')
var baseUrl = getApp().globalData.JavaGoodsUrl;

/**
 * 登陆平台
 */
function loginGoods(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_sys_api", data, callback)
}


module.exports.loginGoods = loginGoods;
module.exports.findDetailsByOrderId = findDetailsByOrderId;