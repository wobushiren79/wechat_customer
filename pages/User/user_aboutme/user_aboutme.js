var platformHttp = require("../../../utils/http/RequestForPlatform.js")
var storageKey = require("../../../utils/storage/StorageKey.js");
var modalUtil = require("../../../utils/ModalUtil.js");
var content;
var userInfo;
Page({
  data: {
    icon: "../../../images/dog.png",
    pagesPositionUrl: null,
    changeAccountTitle: "切换账号"
  },
  onShow: function () {
    var userInfo = wx.getStorageSync(storageKey.PLATFORM_USER_OBJ);

    content.setData({
      nickName: userInfo.name,
      userPhone: userInfo.phone,
      changeAccountTitle: "切换账号"
    })
    
  },
  onLoad: function () {
    content = this;
    wx.getUserInfo({
      success: function (res) {
        // success
        content.setData({
          userInfoAvatar: res.userInfo.avatarUrl
        })
      },
      fail: function () {
        // fail
        console.log("获取失败！")
      },
      complete: function () {
        // complete
        console.log("获取用户信息完成！")
      }
    })
    var pagesPositionUrlObj = getApp().pagesPositionUrl;
    content.setData({
      pagesPositionUrl: pagesPositionUrlObj
    });

    userInfo = wx.getStorageSync(storageKey.PLATFORM_USER_OBJ);
    if (userInfo == null || userInfo.length == 0) {
      wx.navigateTo({
        url: '../user_auto_login_and_register/user_auto_login_and_register',
      })
    } else {
      content.setData({
        nickName: userInfo.name,
        userPhone: userInfo.phone,
        changeAccountTitle: "切换账号"
      })
    }
  },


  /**
   * 获取用户数据
   */
  getUserInfo: function (userId) {
    var queryUserInfoRequest = {
      userId: userId
    }
    var queryUserInfoCallBack = {
      success: function (data, res) {

      },
      fail: function (data, res) {

      }
    }

    platformHttp.queryUserInfoById();
  },

  /**
   * 切换账号
   */
  changeAccount: function (e) {
    var confirm = function () {
      wx.navigateTo({
        url: "../user_auto_login_and_register/user_auto_login_and_register"
      })
    }
    if (userInfo == null || userInfo.length == 0) {
      confirm();
    }else{
      modalUtil.showModal("切换账号", "是否切换账号", confirm);
    }
  }
});