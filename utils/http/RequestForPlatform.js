var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaPlatformUrl;

/**
 * 登陆平台
 */
function loginPlatform(data, callback){
  baseRequest.sendPostHttpForLogin(baseUrl + "applogin", data, callback, true)
}

/**
 * 手机号登陆
 */
function loginPlatformByPhone(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "appLoginMobileOther", data, callback, true)
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

/**
 * 通过类型查询标签列表
 */
function queryTagsListByType(data, callback) {
	baseRequest.sendPostHttpForContent(baseUrl + "api/tags/listByType", data, callback)
}

/**
 * 查询用户星级
 */
function findUserStarts(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/advisorservice/findByUserId", data, callback)
}

/**
 * 查询评价标签
 */
function findListByEvaluateTag(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/tags/listByEvaluateTag", data, callback)
}

/**
 * 通过系统枚举id查询公墓列表
 */
function queryCemeterySubsysListBySysEnumId(data, callback) {
	baseRequest.sendPostHttp(baseUrl + "api/syssystem/getSubsystemList", data, callback);
}

/**
 * 通过系统枚举id查询公墓列表不需要登录
 */
function queryCemeterySubsysListBySysEnumIdNoLogin(data, callback) {
  baseRequest.sendPostHttp(baseUrl + "api/syssystem/getSubsystemListNoLogin", data, callback);
}

function queryUserInfoById(data, callback){
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersInfo/queryById", data, callback)
}
/**
 * 查询用户级别
 */
function queryUserLevel(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/level/findbyuserids", data, callback)
}

module.exports.loginPlatform = loginPlatform;
module.exports.changeForPassWord = changeForPassWord;
module.exports.submitComplaints = submitComplaints;
module.exports.submitEvaluation = submitEvaluation;
module.exports.findEvaluationListByUserId = findEvaluationListByUserId;
module.exports.sendVerificationCode = sendVerificationCode;
module.exports.queryTagsListByType = queryTagsListByType;
module.exports.findUserStarts = findUserStarts;
module.exports.findListByEvaluateTag = findListByEvaluateTag;
module.exports.queryCemeterySubsysListBySysEnumId = queryCemeterySubsysListBySysEnumId;
module.exports.queryCemeterySubsysListBySysEnumIdNoLogin = queryCemeterySubsysListBySysEnumIdNoLogin;
module.exports.queryUserInfoById = queryUserInfoById;
module.exports.loginPlatformByPhone = loginPlatformByPhone;
module.exports.queryUserLevel = queryUserLevel;