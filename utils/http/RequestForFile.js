var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaPlatformUrl;

/**
 * 文件七牛上传
 */
function uploadFileByQiniu(filePath,fileName, callback) {
  baseRequest.sendFileHttpForContent(baseUrl + "fileqiniu/upload", filePath, fileName, callback, true)
}

/**
 * 文件阿里云上传
 */
function uploadFileByAliyun(filePath, fileName, callback) {
  baseRequest.sendFileHttpForContent(baseUrl + "file/upload", filePath, fileName, callback, true)
}

module.exports.uploadFile = uploadFile;
