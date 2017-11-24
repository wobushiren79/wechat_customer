Page({
    data: {
      yanzm:false,
      yanzhengm:false
    },
    onShareAppMessage: function () {
      return {
        title: '圆满人生服务+',
        path: 'pages/C_order/C_order',
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
    formSubmit: function (e) {
      wx.showLoading({
        title: '查询中',
      })
      var that = this
      var GmUrl = getApp().globalData.GmUrl
      var content = e.detail.value;
      if (content.phone && content.verificationCode) {
        var forData = { content: content }
        //转换字符串
        var ForData = JSON.stringify(forData)
        // console.log(ForData)
        wx.request({
          url: GmUrl + 'marketing/wechat/query/bury',
          method: "POST",
          data: ForData,

          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            
            if (res.data.code == 1000) {
              if (res.data.content.list.length > 0){
                var list = res.data.content.list
                wx.setStorageSync('order', list)
                // //頁面跳轉
                wx.navigateTo({
                  url: '../C_order_list/C_order_list',
                })
              }else{
                setTimeout(function () {
                  wx.hideLoading()
                }, 0)
                that.setData({
                  yanzhengm: false,
                  yanzm: true
                })
              }
            }else{
              setTimeout(function () {
                wx.hideLoading()
              }, 0)
              that.setData({
                yanzhengm: true,
                yanzm: false
              })
              // wx.showToast({
              //   title: res.data.message,
              //   duration: 2000
              // })
            }
          },
          file: function (res) {
            wx.showToast({
              title: '网络错误,请稍后再试',
              duration: 2000
            })
          }
        })
      } else if (!content.phone) {
        wx.showToast({
          title: '请输入手机号码',
          duration: 2000
        })
      } else if (!content.verificationCode) {
        wx.showToast({
          title: '请输入验证号码',
          duration: 2000
        })
      }
    },
    formCode:function(e){
      wx.showLoading({
        title: '发送中',
      })
      var that = this
      var GmUrl = getApp().globalData.GmUrl
      var content = e.detail.value;
      if (content.phone){
        var forData = { content: content }
        //转换字符串
        var ForData = JSON.stringify(forData)
        // console.log(ForData)
        wx.request({
          url: GmUrl + 'marketing/wechat/sms',
          method: "POST",
          data: ForData,

          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            console.log(res.data.content)
            if (res.data.code == 1000){
              console.log(res.data.content)
              wx.showToast({
                title: '发送成功',
                duration: 2000
              })
           }
          },
          file:function(res){
            wx.showToast({
              title: '网络错误,请稍后再试',
              duration: 2000
            })
          }
        })
      }else{
        wx.showToast({
          title: '请输入手机号码',
          duration: 2000
        })
      }
    },

});
