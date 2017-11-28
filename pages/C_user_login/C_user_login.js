var platHttp = require('../../utils/http/RequestForPlatform.js')
var goodsHttp = require('../../utils/http/RequestForGoods.js')
var toastUtil = require('../../utils/ToastUtil.js');
var storageKey = require('../../utils/storage/StorageKey.js');
var content;

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    logo_src: "../../images/logo.png",
  },

  onLoad: function (e) {
    content = this;
  },

  systemType: function (e) {
    this.setData({ systemType: e.detail.value })
  },

  /**
   * 提交按钮
   */
  formSubmit: function (e) {
    var contentData = e.detail.value
    if (!contentData) {
      toastUtil.showToast('contentData为空')
      return;
    }
    if (!contentData.username || contentData.username == '') {
      toastUtil.showToast('账号不能为空')
      return;
    }
    if (!contentData.password || contentData.password == '') {
      toastUtil.showToast('密码不能为空')
      return;
    }
    var loginPlatData = {
      userName: contentData.username,
      userPwd: contentData.password
    }
    content.loginPlatForm(loginPlatData);
  },



  /**
   * 登陆平台
   */
  loginPlatForm: function (loginPlatData) {
    var loginPlatCallBack = {
      success: function (data, res) {
        if (data) {
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
        toastUtil.showToast("账号不正确")
      }
    }
    platHttp.loginPlatform(loginPlatData, loginPlatCallBack)
  },

  /**
   * 登陆单项
   */
  loginGoods: function () {
    var loginGoodsCallBack = {
      success: function (data, res) {
        wx.navigateBack({
          delta: 1
        })
      }
    }
    goodsHttp.loginGoods(null, loginGoodsCallBack);
  },
})

