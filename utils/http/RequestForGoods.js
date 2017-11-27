var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaGoodsUrl;

/**
 * 登陆单项
 */
function loginGoods(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_sys_api", data, callback,true)
}


module.exports.loginGoods = loginGoods;