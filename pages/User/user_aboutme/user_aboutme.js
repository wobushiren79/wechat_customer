var platformHttp = require("../../../utils/http/RequestForPlatform.js")
var storageKey = require("../../../utils/storage/StorageKey.js");
var content;
Page({
  data: {
    icon: "../../../images/dog.png",
    pagesPositionUrl: null
  },
  onShow: function () {
    var userInfo = wx.getStorageSync(storageKey.PLATFORM_USER_OBJ);

    content.setData({
      nickName: userInfo.name,
      userPhone: userInfo.phone
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

    var userInfo = wx.getStorageSync(storageKey.PLATFORM_USER_OBJ);
    if (userInfo == null || userInfo.length == 0) {
      wx.navigateTo({
        url: '../user_auto_login_and_register/user_auto_login_and_register',
      })
    } else {
      content.setData({
        nickName: userInfo.name,
        userPhone: userInfo.phone
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
  }
});