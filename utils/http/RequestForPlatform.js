var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaPlatformUrl;

/**
 * 登陆平台
 */
function loginPlatform(data, callback){
  baseRequest.sendPostHttpForLogin(baseUrl + "applogin", data, callback, true)
}

/**
 * 修改密码发送短信验证
 */
function changeForPassWord(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersInfo/forgetKeys", data, callback, true)
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
function findEvaluationListByUserId(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/opinions/list_evaluation", data, callback)
}


/**
 * 根据手机号获取验证码(注册)
 */
function sendVerificationCode(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersInfo/registerAccount", data, callback)
}




module.exports.loginPlatform = loginPlatform;
module.exports.changeForPassWord = changeForPassWord;
module.exports.submitComplaints = submitComplaints;
module.exports.submitEvaluation = submitEvaluation;
module.exports.findEvaluationListByUserId = findEvaluationListByUserId;
module.exports.sendVerificationCode = sendVerificationCode;