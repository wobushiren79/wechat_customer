
Page({
    data:{
      timeStar:"2017/04/10",
      timeEnd: "2027/04/10",
      time: "2017/03/10 13:34",
      money:"1200",
      method_wx:"微信",
      method_card: "银行卡",
      nickName:"",
      userInfoAvatar:"",
      num:"8",
	 pagesPositionUrl:null
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
    var pagesPositionUrlObj=getApp().pagesPositionUrl;
    this.setData({
	    pagesPositionUrl: pagesPositionUrlObj
    });
  }
});