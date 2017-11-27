var baseHttp = require('BaseHttpDeal.js')

//-------------------------------------------------------------------------------------------------------------------
/**
 * 登陆专用post请求
 */
function sendPostHttpForLogin(url, data, callback, isDialog) {
  var contentData = {};
  var header = {
    "client-Type": "wechatapp",
    'content-type': 'application/json'
  };
  if (data)
    contentData = { content: data };

  var inCallBack = {
    success: function (data, res) {
      if (url.indexOf(getApp().globalData.JavaPlatformUrl) >= 0) {
        var ec = getKi4soEc(res);
        wx.setStorageSync("KI4SO_SERVER_EC", ec);
      }
      var baseUrl = getBaseUrl(url);
      wx.setStorageSync(baseUrl, getSessionId(res));
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
  if (url.indexOf(getApp().globalData.JavaPlatformUrl) >= 0) {
    baseHttp.createPostHttpRequest(url, contentData, inCallBack, header, isDialog);
  } else {
    url += ("?" + wx.getStorageSync("KI4SO_SERVER_EC"));
    baseHttp.createGetHttpRequest(url, contentData, inCallBack, header, isDialog);
  }
}

/**
 * 发送post请求并封装成content
 */
function sendPostHttpForContent(url, data, callback, isDialog) {
  var contentData = {};
  var baseUrl = getBaseUrl(url);
  var cookies = wx.getStorageSync(baseUrl);
  var header = {
    "Cookie": cookies,
    'content-type': 'application/json',
  };
  if (data)
    contentData = { content: data };
  baseHttp.createPostHttpRequest(url, contentData, callback, header, isDialog);
}

/**
 * 发送post请求并封装成content
 */
function sendFileHttpForContent(url, filePath,fileName, callback, isDialog) {
  baseHttp.createFileHttpRequest(url, filePath, fileName, callback, null, isDialog);
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * 获取头文件的KI4SO_SERVER_EC
 */
function getKi4soEc(res) {
  var cookis = res.header['Set-Cookie']
  var cookisarr = cookis.split(";");
  if (cookisarr != -1)
    for (var i = 0; i < cookisarr.length; i++) {
      if (cookisarr[i].indexOf("KI4SO_SERVER_EC") >= 0) {
        var temp = cookisarr[i].replace(" HttpOnly,", "");
        var returnTemp = temp.replace(",rememberMe=deleteMe", "");
        return returnTemp;
      }
    }
}

/**
 * 获取sessionId
 */
function getSessionId(res) {
  var cookis = res.header['Set-Cookie']
  var cookisarr = cookis.split(";");
  if (cookisarr != -1)
    for (var i = 0; i < cookisarr.length; i++) {
      if (cookisarr[i].indexOf("JSESSIONID") >= 0) {
        return cookisarr[i];
      }
    }
}
/**
 * 获取基础url
 */
function getBaseUrl(url) {
  var hostLocation = url.indexOf("/", 8);
  return url.substring(0, hostLocation);
}

//-------------------------------------------------------------------------------------------------------------------
module.exports.sendPostHttpForLogin = sendPostHttpForLogin;
module.exports.sendPostHttpForContent = sendPostHttpForContent;
module.exports.sendFileHttpForContent = sendFileHttpForContent;