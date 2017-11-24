var baseHttp = require('BaseHttpDeal.js')


/**
 * 登陆专用post请求
 */
function sendPostHttpForLogin(url, data, callback) {
  var contentData = {};
  var header = { "client-Type": "wechatapp" };
  if (data)
    contentData = { content: data };

  var inCallBack = {
    success: function (data, res) {
      var cookis = res.header['Set-Cookie']
     var cookisarr= cookis.split(";");
      // console.log(cookis[1]);
      wx.setStorageSync("KI4SO_SERVER_EC");
      if (callback && callback.success) {
        callback.success(data, res);
      }
    },
    fail: function (data, res) {
      if (callback && callback.fail) {
        callback.fail(data, res);
      }
    }
  }
  baseHttp.createPostHttpRequest(url, contentData, inCallBack, header);
}

/**
 * 发送post请求并封装成content
 */
function sendPostHttpForContent(url, data, callback) {
  var contentData = {};
  if (data)
    contentData = { content: data };
  baseHttp.createPostHttpRequest(url, contentData, callback);
}

module.exports.sendPostHttpForLogin = sendPostHttpForLogin;
module.exports.sendPostHttpForContent = sendPostHttpForContent;