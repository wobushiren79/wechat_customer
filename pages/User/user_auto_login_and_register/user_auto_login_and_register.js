var platformHttp = require('../../../utils/http/RequestForPlatform.js');
var goodsHttp = require('../../../utils/http/RequestForGoods.js')
var cemeteryHttp=require('../../../utils/http/RequestForCemetery.js');
var storageKey = require('../../../utils/storage/StorageKey.js');
var toastUtil = require('../../../utils/ToastUtil.js');
var modalUtil = require('../../../utils/ModalUtil.js');
var content;
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    selected: false,
    selected1: true,
    logo_src: "../../../images/logo.png",
    systemType: 2,
    value3: '',
    value4: '',
    str: '',
    isSendMsg: true,
    subSystems: [
      "funeral.advisor",
    ],
    is_loction: 0,
    hasDealSubSystem: 0
  },

  systemType: function (e) {
    this.setData({ systemType: e.detail.value })
  },
  onLoad: function () {
    wx.clearStorageSync();
    content = this
  },
  /**
 * 发送验证码
 */
  phoneData: function (e) {
    if (!checkMobile(e.detail.value.mobile)) {
      toastUtil.showToast("手机号不正确");
      return;
    }
    var sendSmsCodeData = {
      mobile: e.detail.value.mobile
    }
    var sendSmsCodeCallBack = {
      success: function (data, res) {
        content.setData({
          selected: true,
          selected1: false,
          isSendMsg: true,
          second: 60,
        })
        countdown(content)
      },
      fail: function (data, res) {
        toastUtil.showToast("获取失败");
      }
    }
    platformHttp.loginPlatformByPhone(sendSmsCodeData, sendSmsCodeCallBack);
  },


  formSubmit: function (e) {
    var formValues = e.detail.value
    if (!checkMobile(formValues.mobile)) {
      toastUtil.showToast("手机号不正确");
      return;
    }
    if (formValues.msgCode == "") {
      toastUtil.showToast("验证码为空");
      return;
    }
    loginByMoBile(formValues.mobile, formValues.msgCode);
  },



  /**
   * 登陆单项
   */
  loginGoods: function () {
    var loginGoodsCallBack = {
      success: function (data, res) {
        content.loginCemetery();
      },
      fail: function () {
        content.loginCemetery();
      }
    }
    goodsHttp.loginGoods(null, loginGoodsCallBack);
  },
  /**
 * 登陆公墓
 */
  loginCemetery: function () {
    var loginCemeteryCallBack = {
      success: function (data, res) {
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (data, res) {
        wx.navigateBack({
          delta: 1
        })
      }
    }
    cemeteryHttp.loginCemetery(null,loginCemeteryCallBack)
  }
})



/**
 * 手机登陆
 */
function loginByMoBile(mobile, smsCode) {
  //手机号登陆
  var loginByPhoneRequest = {
    mobile: mobile,
    msgCode: smsCode
  }
  var loginByPhoneCallBack = {
    success: function (data, res) {
      if (data) {
        //缓存用户名和密码
        wx.setStorageSync(storageKey.LOGIN_USER_NAME, data.userObj.loginName)
        wx.setStorageSync(storageKey.LOGIN_USER_PASS, data.userObj.loginPwd)
        //缓存平台登录用户ID
        if (data.userId)
          wx.setStorageSync(storageKey.PLATFORM_USER_ID, data.userId)
        //缓存用户信息
        if (data.userObj)
          wx.setStorageSync(storageKey.PLATFORM_USER_OBJ, data.userObj)
        //缓存用户权限
        if (data.resourceCodes)
          wx.setStorageSync(storageKey.PLATFORM_RESOURCE_CODES, data.resourceCodes)
        content.loginGoods();
      }
    },
    fail: function (data, res) {
      if (data.indexOf("没有此用户") >= 0) {
        //没有账号注册
        var registerPass = mobile.substr(5, 10);
        registeredAccount(mobile, registerPass, smsCode);
      } else {
        //登陆失败
        toastUtil.showToast(data);
      }
    }
  }
  platformHttp.loginPlatformByPhone(loginByPhoneRequest, loginByPhoneCallBack);
}

/**
 * 注册账号
 */
function registeredAccount(mobile, password, msgcode) {
  var registeredAccountRequest = {
    mobile: mobile,
    keys: password,
    msgCode: msgcode
  }
  var registeredAccountCallBack = {
    success: function (data, res) {
      loginByMoBile(mobile, msgcode)
    },
    fail: function (data, res) {
      toastUtil.showToast("注册失败");
    }
  }
  platformHttp.sendVerificationCode(registeredAccountRequest, registeredAccountCallBack)
}

/**
 * 验证码倒计时
 */
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}


/**
 * 检测手机号
 */
function checkMobile(mobile) {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))) {
    return false;
  } else {
    return true;
  }
} 
