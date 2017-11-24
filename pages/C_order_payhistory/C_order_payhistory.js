
Page({
    data:{
      timeStar:"2017/04/10",
      timeEnd: "2027/04/10",
      time: "2017/03/10 13:34",
      money:"1200"
    },
    onLoad: function (op) {
      var that = this
      var content={}
      content.orderId = op.orderId
      var GmUrl = getApp().globalData.GmUrl
      var forData = { content: content }
      //转换字符串
      var ForData = JSON.stringify(forData)
      // console.log(ForData)
      wx.request({
        url: GmUrl + 'marketing/wechat/query/managepay',
        method: "POST",
        data: ForData,

        header: {
          "Content-Type": "application/x-www-form-urlencodeed",
          // "Cookie": "sid=" + res.data.content.sessionId
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1000) {
            var list = res.data.content.list
            if (res.data.content.list.length>0){
              var danqian='';
              for (var i in res.data.content.list ){
                danqian = res.data.content.list[0]
              }
              console.log(danqian)
                   that.setData({
                     history:true,
                     list:list,
                     danqian: danqian
                   })
            }else{
              history:false
            }
          } else {
            wx.showToast({
              title: res.data.message,
              duration: 2000
            })
          }
        },
        file: function (res) {
          wx.showToast({
            title: '网络错误,请稍后再试',
            duration: 2000
          })
        }
      })
    }
});