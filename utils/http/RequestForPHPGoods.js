var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.PHPGoodsUrl;

/**
 * 查询顾问门店列表信息
 */
function findAdviserStoreList(data, callback) {
  baseRequest.sendPostHttp(baseUrl + "Api/Stores/StoresList", data, callback, true)
}

/**
 * 获取门店详情
 */
function findStoreInfoByStoreId(data,callback){
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Stores/storesInfo", data, callback, true)
}

/**
 * 获取商品分类详情
 */
function findStoreGoodsClass(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Stores/storesClass", data, callback, true)
}


/**
 * 获取商品分类详情
 */
function findStoreGoods(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Stores/storesGoods", data, callback, true)
}

/**
 * 获取商品详情
 */
function findGoodsDetails(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/getgoods/getattrgoods", data, callback, true)
}

module.exports.findAdviserStoreList = findAdviserStoreList;
module.exports.findStoreInfoByStoreId = findStoreInfoByStoreId;
module.exports.findStoreGoodsClass = findStoreGoodsClass;
module.exports.findStoreGoods = findStoreGoods;
module.exports.findGoodsDetails = findGoodsDetails;