
Page({
    data:{
	    icon: "../../../images/dog.png",
	    pagesPositionUrl: null
    },
  onLoad: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // success
        that.setData({
          nickName: res.userInfo.nickName,
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
    this.setData({
	    pagesPositionUrl: pagesPositionUrlObj
    });
  }
});