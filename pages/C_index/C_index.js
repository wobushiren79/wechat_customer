//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    num: '20',
    service: "24",
    money: "240",
    service_num: "7.4",
    icon_list:"../../images/index_icon_list.png",
    icon_cem:"../../images/index_icon_cem.png",
    icon_goods:"../../images/index_icon_goods.png",
    icon_help: "../../images/index_icon_help.png",
    icon_right:"../../images/icon_right.png",
    role:''
  },
  call_phone: function () {
    wx.makePhoneCall({
      phoneNumber: '966188' 
    })
  },
  onShareAppMessage: function () {
    return {
      title: '圆满人生服务+',
      path: 'pages/C_index/C_index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'success',
          duration: 1500
        })
      }
    }
  },
  // onLoad: function () {
  //   var that = this
  //   // 取出緩存登錄信息
  //   wx.getStorage({
  //     key: 'logindata',
  //       success: function(res) {
  //       //  console.log(res.data)
  //     //     wx.request({
  //     //                 url: 'http://115.28.163.211:7080/shianlife-backend-1.0-SNAPSHOT/user/info/get', 
  //     //                 method:"POST",
  //     //                 data: "{\"content\":{}}",
                      
  //     //                 header: {
  //     //                   "Content-Type":"application/x-www-form-urlencodeed",
  //     //                   "Cookie":"sid="+res.data.content.sessionId
  //     //                 },
  //     //                 success: function(res) {
  //     //                   if(res.data.code == 1000){
  //     //                     var role=res.data.content.roles
  //     //                    // console.log(role)
  //     //                     that.setData({
  //     //                       service:res.data.content.serviceSuccessSum,
  //     //                       grade:res.data.content.avgSatis,
  //     //                       role:role
  //     //                     })
  //     //                   }  
  //     //                 }
  //     //     })
  //     //   }
  //     // })



  // 	//调用应用实例的方法获取全局数据
  //   app.getUserInfo(function(userInfo){
  //     //更新数据
  //     that.setData({
  //       userInfo:userInfo
  //     })
  //   })
    
  // }
})
