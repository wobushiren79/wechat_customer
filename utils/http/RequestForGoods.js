var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaGoodsUrl;

/**
 * 登陆单项
 */
function loginGoods(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_sys_api", data, callback, true)
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

/**
 * 添加到购物车
 */
function addGoodsShopping(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/shopping/save", data, callback, true)
}

/**
 * 获取购物车列表 
 */
function getGoodsShoppingList(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/shopping/list", data, callback, true)
}

/**
 * 修改购物车物品数量
 */
function upShopingCartNum(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/shopping/updateShopingNum", data, callback, true)
}

/**
 * 删除购物车物品
 */
function removeShoppingCartGoods(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/shopping/remove", data, callback, true)
}

/**
 * 创建订单
 */
function createGoodsOrder(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/order/save", data, callback, true)
}

/**
 * 根据orderID获取订单
 */
function findGoodsOrderByOrderId(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/order/findById", data, callback, true)
}

/**
 *提交订单
 */
function confirmGoodsOrder(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/order/submit", data, callback, true)
}

/**
 *提交订单
 */
function payOffLine(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/goods/order/offlinePayment", data, callback, true)
}

module.exports.loginGoods = loginGoods;
module.exports.getGoodsOrderList = getGoodsOrderList;
module.exports.getGoodsOrderDetails = getGoodsOrderDetails;
module.exports.addGoodsShopping = addGoodsShopping;
module.exports.getGoodsShoppingList = getGoodsShoppingList;
module.exports.upShopingCartNum = upShopingCartNum;
module.exports.removeShoppingCartGoods = removeShoppingCartGoods;
module.exports.createGoodsOrder = createGoodsOrder;
module.exports.findGoodsOrderByOrderId = findGoodsOrderByOrderId;
module.exports.confirmGoodsOrder = confirmGoodsOrder;
module.exports.payOffLine = payOffLine;
