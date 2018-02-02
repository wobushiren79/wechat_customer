var baseHttp = require('BaseHttpDeal.js')
var storageKey = require('../../storage/StorageKey.js');
var checkPermissions = require("../../CheckPermissions.js");
var safeJump = require("../../SafeJump.js")

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
      }
      var baseUrl = getBaseUrl(url);
      var sessionId = getSessionId(res, baseUrl);
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
    var ec = wx.getStorageSync(storageKey.KI4SO_SERVER_EC);
    baseHttp.createGetHttpRequest(url, contentData, inCallBack, header, isDialog, ec);
  }
}

/**
 * 发送post请求
 */
function sendPostHttp(url, data, callback, isDialog) {
  var baseUrl = getBaseUrl(url);
  var cookies = wx.getStorageSync(baseUrl);
  var header = {
    "Cookie": cookies,
    'content-type': 'application/json',
  };
  callback.loginAgain = function (tempData) {
    loginPlatForm(tempData);
  }
  baseHttp.createPostHttpRequest(url, data, callback, header, isDialog);
}
/**
 * 发送post请求form表单提交
 */
function sendPostHttpForForm(url, data, callback, isDialog) {
  var baseUrl = getBaseUrl(url);
  var cookies = wx.getStorageSync(baseUrl);
  var header = {
    "Cookie": cookies,
    "content-type": "application/x-www-form-urlencoded"
  };
  callback.loginAgain = function (tempData) {
    loginPlatForm(tempData);
  }
  baseHttp.createPostHttpRequestForFormData(url, data, callback, header, isDialog);
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
  callback.loginAgain = function (tempData) {
    loginPlatForm(tempData);
  }
  baseHttp.createPostHttpRequest(url, contentData, callback, header, isDialog);
}

/**
 * 发送get请求
 */
function sendGetHttp(url, data, callback, isDialog) {
  baseHttp.createGetHttpRequest(url, data, callback, null, isDialog);
}
/**
 * 发送文件
 */
function sendFileHttpForContent(url, filePath, fileName, callback, isDialog) {
  callback.loginAgain = function (tempData) {
    loginPlatForm(tempData);
  }
  baseHttp.createFileHttpRequest(url, filePath, fileName, callback, null, isDialog);
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * 获取头文件的KI4SO_SERVER_EC
 */
function getKi4soEc(res) {
  var cookis = res.header['Set-Cookie']
  if (cookis == null)
    return;
  var cookisarr = cookis.split(";");
  if (cookisarr != -1)
    for (var i = 0; i < cookisarr.length; i++) {
      if (cookisarr[i].indexOf(storageKey.KI4SO_SERVER_EC) >= 0) {
        var temp = cookisarr[i].replace(" HttpOnly,", "");
        var tempRemember = temp.replace("rememberMe=deleteMe", "");
        var returnTemp = tempRemember.replace(",", "").replace(" ", "");
        wx.setStorageSync(storageKey.KI4SO_SERVER_EC, returnTemp);
        return returnTemp;
      }
    }
}

/**
 * 获取sessionId
 */
function getSessionId(res, baseUrl) {
  var cookis = res.header['Set-Cookie']
  if (cookis == null)
    return;
  var cookisarr = cookis.split(";");
  if (cookisarr != -1)
    for (var i = 0; i < cookisarr.length; i++) {
      if (cookisarr[i].indexOf("JSESSIONID") >= 0) {
        wx.setStorageSync(baseUrl, cookisarr[i]);
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


/**
 * 登陆平台
 */
function loginPlatForm(tempData) {
  if (wx.getStorageSync(storageKey.LOGIN_USER_NAME) == null || wx.getStorageSync(storageKey.LOGIN_USER_NAME).length == 0) {
    safeJump.startNavigate('/pages/User/user_auto_login_and_register/user_auto_login_and_register');
    return
  }
  var loginPlatData = {
    userName: wx.getStorageSync(storageKey.LOGIN_USER_NAME),
    userPwd: wx.getStorageSync(storageKey.LOGIN_USER_PASS)
  }
  var loginPlatCallBack = {
    success: function (data, res) {
      if (data) {
        //缓存用户名和密码
        wx.setStorageSync(storageKey.LOGIN_USER_NAME, loginPlatData.userName)
        wx.setStorageSync(storageKey.LOGIN_USER_PASS, loginPlatData.userPwd)
        //缓存平台登录用户ID
        if (data.userId)
          wx.setStorageSync(storageKey.PLATFORM_USER_ID, data.userId)
        //缓存用户信息
        if (data.userObj)
          wx.setStorageSync(storageKey.PLATFORM_USER_OBJ, data.userObj)
        //缓存用户权限
        if (data.resourceCodes)
          wx.setStorageSync(storageKey.PLATFORM_RESOURCE_CODES, data.resourceCodes)
        getUserLevel(tempData);
        httpAgain(tempData, getApp().globalData.JavaPlatformUrl)
      }
    },
    fail: function (data, res) {
      safeJump.startNavigate('/pages/User/user_auto_login_and_register/user_auto_login_and_register');
    }
  }
  sendPostHttpForLogin(getApp().globalData.JavaPlatformUrl + "applogin", loginPlatData, loginPlatCallBack, true)
}

/**
 * 登陆单项
 */
function loginGoods(tempData) {
  var loginGoodsCallBack = {
    success: function (data, res) {
      loginCemetery(tempData)
      httpAgain(tempData, getApp().globalData.JavaGoodsUrl)
    },
    fail: function (data, res) {
      loginCemetery(tempData)
    }
  }
  sendPostHttpForLogin
    (getApp().globalData.JavaGoodsUrl + "login_sys_api", null, loginGoodsCallBack, true)
}

/**
 * 登陆公墓
 */
function loginCemetery(tempData) {
  var loginCemeteryCallBack = {
    success: function (data, res) {
      // wx.reLaunch({
      //   url: '/pages/index/index',
      // })
      httpAgain(tempData, getApp().globalData.JavaCemeteryUrl)
    },
    fail: function (data, res) {
      // wx.reLaunch({
      //   url: '/pages/index/index',
      // })
      // httpAgain(tempData)
    }
  }
  sendPostHttpForLogin
    (getApp().globalData.JavaCemeteryUrl + "login_subsystem_api", null, loginCemeteryCallBack, true)
}


/**
 * 重新再登陆
 */
function httpAgain(tempData, loginUrl) {
  if (tempData == null || loginUrl == null)
    return;
  if (tempData.httpData.url.indexOf(loginUrl) >= 0) {
    var httpData = tempData.httpData;
    var callback = tempData.callback;
    var isDialog = tempData.isDialog;

    //重新设置cookies
    var baseUrl = getBaseUrl(httpData.url);
    var cookies = wx.getStorageSync(baseUrl);
    httpData.header.Cookie = cookies;

    //是否是文件上传
    if (tempData.isUpFile) {
      baseHttp.sendBaseFileHttp(httpData, callback, isDialog);
    } else {
      baseHttp.sendBaseHttp(httpData, callback, isDialog);
    }
  }
}

/**
 * 查询用户级别
 */
function getUserLevel(tempData) {
  var resourceCodes = wx.getStorageSync(storageKey.PLATFORM_RESOURCE_CODES)
  var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID)
  // var hasGoodsAdvisorAmateur = checkPermissions.hasGoodsAdvisorAmateur();
  // if (hasGoodsAdvisorAmateur) {
  var queryLevelRequest = {
    userIds: [userId]
  }
  var queryLevelCallBack = {
    success: function (data, res) {
      wx.setStorageSync(storageKey.AMATEUR_LEVEL, data.resultList)
      loginGoods(tempData);
    },
    fail: function (data, res) {
      loginGoods(tempData);
    }
  }
  sendPostHttpForContent
    (getApp().globalData.JavaPlatformUrl + "api/level/findbyuserids", queryLevelRequest, queryLevelCallBack, true)
  return;
  // }
  // loginGoods();
}
module.exports.sendPostHttpForLogin = sendPostHttpForLogin;
module.exports.sendPostHttp = sendPostHttp;
module.exports.sendPostHttpForForm = sendPostHttpForForm;
module.exports.sendPostHttpForContent = sendPostHttpForContent;
module.exports.sendFileHttpForContent = sendFileHttpForContent;
module.exports.sendGetHttp = sendGetHttp;