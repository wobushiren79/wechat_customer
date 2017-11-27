var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaPlatformUrl;

/**
 * 登陆平台
 */
function loginPlatform(data, callback){
  baseRequest.sendPostHttpForLogin(baseUrl + "applogin", data, callback, true)
}

/**
 * 提交投诉
 */
function submitComplaints(data,callback){
  baseRequest.sendPostHttpForContent(baseUrl+"api/opinions/complaint", data , callback,true)
}

/**
 * 提交评价
 */
function submitEvaluation(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/opinions/evaluation", data, callback, true)
}


/**
 * 根据评价对象ID查询评价list
 */
function findListByUserId(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/opinions/list_evaluation", data, callback)
}



module.exports.loginPlatform = loginPlatform;
module.exports.submitComplaints = submitComplaints;
