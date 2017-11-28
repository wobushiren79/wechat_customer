var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.PHPGoodsUrl;

/**
 * 查询顾问门店列表信息
 */
function findAdviserStoreList(data, callback) {
  baseRequest.sendPostHttp(baseUrl + "Api/Stores/StoresList", data, callback, true)
}


module.exports.findAdviserStoreList = findAdviserStoreList;