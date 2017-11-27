var baseRequest = require('BaseRequest.js')
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
  baseRequest.sendPostHttpForContent(baseUrl+"api/opinions/complaint", data , callback)
}

module.exports.loginPlatform = loginPlatform;
module.exports.submitComplaints = submitComplaints;
